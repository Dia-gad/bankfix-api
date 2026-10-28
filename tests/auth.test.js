const request = require('supertest');
const app = require('../src/app');

describe('Authentication security', () => {
  it('rejects requests to maintenance endpoints without a token', async () => {
    const response = await request(app)
      .get('/api/maintenance-requests');

    expect(response.status).toBe(401);
  });
});

  it('rejects an invalid Bearer token', async () => {
    const response = await request(app)
      .get('/api/maintenance-requests')
      .set('Authorization', 'Bearer not-a-valid-token');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('INVALID_TOKEN');
  });

  it('rejects an authorization header that does not use Bearer', async () => {
    const response = await request(app)
      .get('/api/maintenance-requests')
      .set('Authorization', 'Basic some-invalid-credentials');

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
