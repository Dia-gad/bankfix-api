const express = require('express');
const authRoutes = require('./routes/auth-routes');
const maintenanceRequestRoutes = require('./routes/maintenance-request-routes');
const { notFoundHandler, errorHandler } = require('./middleware/error-handler');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'bankfix-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/maintenance-requests', maintenanceRequestRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
