import app from './src/app.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Dakshinaasya Darshini Server] Listening on 0.0.0.0:${PORT}`);
});

// Handle SIGTERM gracefully so Railway doesn't abruptly kill connections
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
