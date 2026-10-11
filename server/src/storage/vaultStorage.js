import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

let supabase = null;
if (config.supabaseUrl && config.supabaseKey) {
  try {
    supabase = createClient(config.supabaseUrl, config.supabaseKey);
    console.log('✅ Supabase Storage Client initialized for encrypted vault.');
  } catch (err) {
    console.warn('⚠️ Supabase Storage init warning:', err.message);
  }
}

export class VaultStorage {
  /**
   * Save encrypted blob to local disk and/or Supabase Storage
   * @param {string} fileName - DOC-2026-xxxxx.enc
   * @param {Buffer} buffer - Encrypted ciphertext buffer
   */
  static async saveEncryptedBlob(fileName, buffer) {
    // 1. Local disk persistence
    try {
      if (!fs.existsSync(config.storageDir)) {
        fs.mkdirSync(config.storageDir, { recursive: true });
      }
      fs.writeFileSync(path.join(config.storageDir, fileName), buffer);
    } catch (e) {
      console.warn('Local disk write warning:', e.message);
    }

    // 2. Cloud Supabase Storage persistence (survives Render restarts)
    if (supabase) {
      try {
        const { error } = await supabase.storage
          .from(config.supabaseBucket)
          .upload(fileName, buffer, {
            contentType: 'application/octet-stream',
            upsert: true
          });
        if (error) {
          console.warn('Supabase storage upload error:', error.message);
        } else {
          console.log(`☁️ Synced ${fileName} to Supabase Storage (${config.supabaseBucket})`);
        }
      } catch (err) {
        console.warn('Supabase upload exception:', err.message);
      }
    }
  }

  /**
   * Retrieve encrypted blob from local disk or Supabase Storage fallback
   * @param {string} fileName - DOC-2026-xxxxx.enc
   * @returns {Promise<Buffer|null>}
   */
  static async getEncryptedBlob(fileName) {
    const localPath = path.join(config.storageDir, fileName);

    // Check local disk first
    if (fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }

    // Fallback: download from Supabase Storage
    if (supabase) {
      try {
        const { data, error } = await supabase.storage
          .from(config.supabaseBucket)
          .download(fileName);

        if (!error && data) {
          const arrayBuffer = await data.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          // Cache locally for subsequent fast reads
          try {
            if (!fs.existsSync(config.storageDir)) {
              fs.mkdirSync(config.storageDir, { recursive: true });
            }
            fs.writeFileSync(localPath, buffer);
          } catch (_) {}
          return buffer;
        }
      } catch (err) {
        console.warn('Supabase storage download error:', err.message);
      }
    }

    return null;
  }
}
