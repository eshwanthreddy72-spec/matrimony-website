import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import authRoutes from './server/routes/auth.ts';
import profileRoutes from './server/routes/profile.ts';
import matchesRoutes from './server/routes/matches.ts';
import interestsRoutes from './server/routes/interests.ts';
import favoritesRoutes from './server/routes/favorites.ts';
import mediaRoutes from './server/routes/media.ts';
import adminRoutes from './server/routes/admin.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Basic request logger in dev
  app.use((req, _res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.url}`);
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Matrimony Management Platform'
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api', profileRoutes);
  app.use('/api', matchesRoutes);
  app.use('/api', interestsRoutes);
  app.use('/api', favoritesRoutes);
  app.use('/api', mediaRoutes);
  app.use('/api/admin', adminRoutes);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Matrimony Management Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
