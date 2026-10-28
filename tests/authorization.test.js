const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/services/maintenance-request-service', () => ({
  list: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  listAssignments: jest.fn(),
}));

const service = require('../src/services/maintenance-request-service');
const app = require('../src/app');

function createTestToken({ id = '111', role = 'requester', name = 'Test Requester' } = {}) {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32 || secret.startsWith('CHANGE_ME')) {
    throw new Error('A valid JWT_SECRET is required to run these tests');
  }

  return jwt.sign(
    { sub: String(id), role, name },
    secret,
    {
      expiresIn: '5m',
      issuer: 'bankfix-api',
      audience: 'bankfix-client',
    }
  );
}

const foreignRequest = {
  id: 42,
  facility_id: 1,
  asset_id: null,
  title: 'Air conditioner fault',
  description: null,
  priority: 'high',
  status: 'open',
  reported_by: 'Another Requester',
  created_by_user_id: 222,
};

describe('Maintenance request authorization', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('prevents a requester from viewing another user’s request', async () => {
    service.getById.mockResolvedValue(foreignRequest);

    const response = await request(app)
      .get('/api/maintenance-requests/42')
      .set('Authorization', `Bearer ${createTestToken()}`);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('FORBIDDEN');
  });

  it('prevents a requester from updating another user’s request', async () => {
    service.getById.mockResolvedValue(foreignRequest);

    const response = await request(app)
      .patch('/api/maintenance-requests/42')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({ title: 'Updated title' });

    expect(response.status).toBe(403);
    expect(service.update).not.toHaveBeenCalled();
  });

  it('prevents a requester from deleting another user’s request', async () => {
    service.getById.mockResolvedValue(foreignRequest);

    const response = await request(app)
      .delete('/api/maintenance-requests/42')
      .set('Authorization', `Bearer ${createTestToken()}`);

    expect(response.status).toBe(403);
    expect(service.remove).not.toHaveBeenCalled();
  });

  it('prevents a requester from viewing another user’s assignments', async () => {
    service.getById.mockResolvedValue(foreignRequest);

    const response = await request(app)
      .get('/api/maintenance-requests/42/assignments')
      .set('Authorization', `Bearer ${createTestToken()}`);

    expect(response.status).toBe(403);
    expect(service.listAssignments).not.toHaveBeenCalled();
  });

  it('allows a requester to update their own request', async () => {
    const ownRequest = {
      ...foreignRequest,
      created_by_user_id: 111,
    };

    service.getById.mockResolvedValue(ownRequest);
    service.update.mockResolvedValue({
      ...ownRequest,
      title: 'Updated title',
    });

    const response = await request(app)
      .patch('/api/maintenance-requests/42')
      .set('Authorization', `Bearer ${createTestToken()}`)
      .send({ title: 'Updated title' });

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Updated title');
    expect(service.update).toHaveBeenCalledWith(42, {
      title: 'Updated title',
    });
  });

  it('allows an admin to view another user’s request', async () => {
    service.getById.mockResolvedValue(foreignRequest);

    const response = await request(app)
      .get('/api/maintenance-requests/42')
      .set(
        'Authorization',
        `Bearer ${createTestToken({ id: '999', role: 'admin', name: 'Test Admin' })}`
      );

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(42);
  });
});
