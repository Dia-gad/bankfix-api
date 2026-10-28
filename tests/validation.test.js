const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

function createTestToken() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32 || secret.startsWith('CHANGE_ME')) {
    throw new Error('A valid JWT_SECRET is required to run these tests');
  }

  return jwt.sign(
    {
      sub: '999999',
      role: 'requester',
      name: 'Week 3 Test User',
    },
    secret,
    {
      expiresIn: '5m',
      issuer: 'bankfix-api',
      audience: 'bankfix-client',
    }
  );
}

describe('Maintenance request validation', () => {
  let token;

  beforeAll(() => {
    token = createTestToken();
  });

  it('rejects a request with a title that is too short', async () => {
    const response = await request(app)
      .post('/api/maintenance-requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        facility_id: 1,
        title: 'AB',
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects an invalid priority', async () => {
    const response = await request(app)
      .post('/api/maintenance-requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        facility_id: 1,
        title: 'Air conditioner fault',
        priority: 'critical',
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects client-supplied reporter information', async () => {
    const response = await request(app)
      .post('/api/maintenance-requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        facility_id: 1,
        title: 'Air conditioner fault',
        reported_by: 'Someone Else',
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects a malformed maintenance request ID', async () => {
    const response = await request(app)
      .patch('/api/maintenance-requests/not-a-number')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated maintenance title',
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_ID');
  });

  it('rejects an empty update', async () => {
    const response = await request(app)
      .patch('/api/maintenance-requests/8')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('EMPTY_UPDATE');
  });
});
