import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import db from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

// Route Imports
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { contactRouter, newsletterRouter, settingsRouter } from './routes/commonRoutes.js';

import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Cross-Origin Resource Sharing
const allowedOrigins = config.CORS_ORIGIN.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev/prep
      }
    },
    credentials: true,
  })
);

// Logging
if (config.NODE_ENV !== 'test') {
  app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Request parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiting
app.use('/api/', globalLimiter);

// Health Check Endpoint (For Render, Railway, Vercel, Uptime Monitoring)
app.get('/api/health', async (req, res) => {
  try {
    const dbTest = await db.query('SELECT 1 as connected');
    res.json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'Loop & Love Backend API',
      database: dbTest.rows.length > 0 ? 'Connected' : 'Degraded',
      version: '1.0.0',
      environment: config.NODE_ENV,
    });
  } catch (err) {
    res.status(500).json({
      status: 'DOWN',
      service: 'Loop & Love Backend API',
      error: err.message,
    });
  }
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/settings', settingsRouter);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.originalUrl} not found on Loop & Love API server.`,
  });
});

// Serve frontend static build if present
app.use(express.static(distPath));

// Client-side SPA routing fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Centralized Error Handling
app.use(errorHandler);

// Start Server
async function startServer() {
  try {
    await db.initDatabase();

    const PORT = config.PORT;
    app.listen(PORT, () => {
      console.log(`[Server] Loop & Love API Server listening on port ${PORT}`);
      console.log(`[Server] Health check available at http://127.0.0.1:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('[Server] Fatal error initializing server:', err);
    process.exit(1);
  }
}

startServer();

export default app;

