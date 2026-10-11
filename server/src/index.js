import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { initDatabase } from './db/database.js';
import { BlockchainService } from './services/blockchainService.js';

import authRoutes from './routes/authRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import evidenceRoutes from './routes/evidenceRoutes.js';
import verifyRoutes from './routes/verifyRoutes.js';
import custodyRoutes from './routes/custodyRoutes.js';
import auditRoutes from './routes/auditRoutes.js';

const app = express();

// Security & Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Client-SHA256']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'NyayaVault Sovereign Digital Evidence Management System',
    timestamp: new Date().toISOString(),
    blockchain: {
      network: BlockchainService.isLiveNetwork ? 'LIVE_EVM' : 'CRYPTOGRAPHIC_LEDGER_ENGINE',
      contractAddress: BlockchainService.contractAddress,
      currentBlock: BlockchainService.blockCounter
    }
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/custody', custodyRoutes);
app.use('/api/audit', auditRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error: ' + err.message });
});

// Boot Sequence
async function startServer() {
  try {
    console.log('1. Initializing native database & seed data...');
    initDatabase();

    console.log('2. Initializing blockchain engine...');
    await BlockchainService.initialize();

    app.listen(config.port, () => {
      console.log(`================================================================`);
      console.log(`  NYAYAVAULT BACKEND ENGINE IS RUNNING ON PORT ${config.port}   `);
      console.log(`  API Health: http://localhost:${config.port}/api/health        `);
      console.log(`================================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
