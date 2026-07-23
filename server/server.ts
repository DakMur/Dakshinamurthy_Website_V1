import app from './src/app.js';

// IMPORTANT: Use process.env.PORT first. Do NOT hardcode 5000.
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`[Dakshinaasya Darshini Server] Listening on ${HOST}:${PORT}`);
});

// Handle SIGTERM gracefully so Railway doesn't abruptly kill connections
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
