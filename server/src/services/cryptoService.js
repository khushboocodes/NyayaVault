import crypto from 'crypto';
import { config } from '../config/env.js';

export class CryptoService {
  /**
   * Computes SHA-256 hash of a Buffer or string.
   * Returns lowercase 64-char hex string.
   */
  static sha256(bufferOrString) {
    return crypto.createHash('sha256').update(bufferOrString).digest('hex');
  }

  /**
   * Computes Merkle Root from an array of 64-char hex hashes.
   */
  static computeMerkleRoot(hashArray) {
    if (!hashArray || hashArray.length === 0) {
      return this.sha256(Buffer.from(''));
    }
    let currentLevel = hashArray.map(h => (h.startsWith('0x') ? h.slice(2) : h));

    while (currentLevel.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        if (i + 1 < currentLevel.length) {
          const combined = currentLevel[i] + currentLevel[i + 1];
          nextLevel.push(this.sha256(Buffer.from(combined, 'hex')));
        } else {
          // Odd number of leaves: hash with itself
          const combined = currentLevel[i] + currentLevel[i];
          nextLevel.push(this.sha256(Buffer.from(combined, 'hex')));
        }
      }
      currentLevel = nextLevel;
    }

    return currentLevel[0];
  }

  /**
   * Generates a 256-bit random Data Encryption Key (DEK).
   */
  static generateDEK() {
    return crypto.randomBytes(32);
  }

  /**
   * Encrypts plaintext buffer using AES-256-GCM.
   * Returns { ciphertext, iv, authTag, encryptedDEK }
   */
  static encryptEnvelope(plaintextBuffer) {
    const dek = this.generateDEK();
    const iv = crypto.randomBytes(12); // 96-bit IV for GCM

    const cipher = crypto.createCipheriv('aes-256-gcm', dek, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintextBuffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Encrypt DEK under Master Encryption Key (MEK)
    const mek = Buffer.from(config.masterEncryptionKey, 'hex');
    const mekIv = crypto.randomBytes(12);
    const mekCipher = crypto.createCipheriv('aes-256-gcm', mek, mekIv);
    const encryptedDekPayload = Buffer.concat([mekCipher.update(dek), mekCipher.final()]);
    const mekTag = mekCipher.getAuthTag();

    const encryptedDekBundle = JSON.stringify({
      iv: mekIv.toString('hex'),
      payload: encryptedDekPayload.toString('hex'),
      tag: mekTag.toString('hex')
    });

    return {
      ciphertext,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      encryptedDEK: Buffer.from(encryptedDekBundle).toString('base64')
    };
  }

  /**
   * Decrypts ciphertext buffer using stored AES-256-GCM parameters and encrypted DEK.
   */
  static decryptEnvelope(ciphertextBuffer, ivHex, authTagHex, encryptedDekBase64) {
    // 1. Decrypt DEK using MEK
    const mek = Buffer.from(config.masterEncryptionKey, 'hex');
    const dekBundle = JSON.parse(Buffer.from(encryptedDekBase64, 'base64').toString('utf-8'));
    const mekIv = Buffer.from(dekBundle.iv, 'hex');
    const mekPayload = Buffer.from(dekBundle.payload, 'hex');
    const mekTag = Buffer.from(dekBundle.tag, 'hex');

    const mekDecipher = crypto.createDecipheriv('aes-256-gcm', mek, mekIv);
    mekDecipher.setAuthTag(mekTag);
    const dek = Buffer.concat([mekDecipher.update(mekPayload), mekDecipher.final()]);

    // 2. Decrypt Ciphertext using DEK
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', dek, iv);
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([decipher.update(ciphertextBuffer), decipher.final()]);

    return plaintext;
  }

  /**
   * Generates ECDSA keypair for officer signing (curve secp256k1).
   */
  static generateOfficerKeyPair() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'secp256k1',
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    return { privateKey, publicKey };
  }

  /**
   * Signs a data digest using an ECDSA private key.
   */
  static signDigest(digestHex, privateKeyPem) {
    const sign = crypto.createSign('SHA256');
    sign.update(Buffer.from(digestHex, 'hex'));
    sign.end();
    return sign.sign(privateKeyPem, 'hex');
  }

  /**
   * Verifies an ECDSA digital signature over a digest.
   */
  static verifySignature(digestHex, signatureHex, publicKeyPem) {
    try {
      const verify = crypto.createVerify('SHA256');
      verify.update(Buffer.from(digestHex, 'hex'));
      verify.end();
      return verify.verify(publicKeyPem, signatureHex, 'hex');
    } catch {
      return false;
    }
  }

  /**
   * Generates HMAC-SHA256 stamp for Section 63 BSA certificate sealing.
   */
  static computeHmacSeal(dataString) {
    return crypto
      .createHmac('sha256', config.masterEncryptionKey)
      .update(dataString)
      .digest('hex');
  }
}
