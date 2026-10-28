const request = require('supertest');
const app = require('../src/app');

describe('BankFix API', () => {
  describe('GET /health', () => {
    it('returns a successful health response', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        service: 'bankfix-api',
      });
    });

    it('does not expose the X-Powered-By header', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.headers['x-powered-by']).toBeUndefined();
    });
  });

  describe('Unknown routes', () => {
    it('returns 404 for an endpoint that does not exist', async () => {
      const response = await request(app)
        .get('/this-route-does-not-exist');

      expect(response.status).toBe(404);
    });
  });
});
