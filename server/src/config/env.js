import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'nyayavault_default_secret_key_change_in_production_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  masterEncryptionKey: process.env.MASTER_ENCRYPTION_KEY || 'c3f1e9b2a7d4f8e6c3f1e9b2a7d4f8e6c3f1e9b2a7d4f8e6c3f1e9b2a7d4f8e6',
  storageDir: path.resolve(__dirname, '../../storage/vault'),
  databasePath: path.resolve(__dirname, '../../storage/nyayavault.sqlite'),
  rpcUrl: process.env.RPC_URL || 'http://127.0.0.1:8545',
  chainId: parseInt(process.env.CHAIN_ID || '31337', 10),
  relayerPrivateKey: process.env.RELAYER_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  // Turso Cloud SQLite Configuration
  tursoUrl: process.env.TURSO_DATABASE_URL || '',
  tursoAuthToken: process.env.TURSO_AUTH_TOKEN || '',
  // Supabase Object Storage Configuration
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '',
  supabaseBucket: process.env.SUPABASE_STORAGE_BUCKET || 'nyayavault-vault'
};
