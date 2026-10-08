const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;

// Health check endpoint for GKE readiness and liveness probes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'retail-frontend',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend assets
app.use(express.static(path.join(__dirname, '/')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Retail Frontend SPA running at http://0.0.0.0:${PORT}`);
});
