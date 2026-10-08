const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 80;

app.use(express.static(path.join(__dirname, '/')));

// Health check para Kubernetes Ingress / Service
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP', component: 'd1-frontend', pod: process.env.HOSTNAME || 'local' });
});

// Fallback SPA
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Tiendas D1 Frontend corriendo en http://localhost:${PORT}`);
});
