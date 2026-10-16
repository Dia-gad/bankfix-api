require('dotenv').config();
const app = require('./app');

const port = Number(process.env.PORT || 3000);
const server = app.listen(port, () => console.log(`BankFix API listening on port ${port}`));

async function shutdown(signal) {
  console.log(`${signal} received; shutting down`);
  server.close(() => process.exit(0));
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
