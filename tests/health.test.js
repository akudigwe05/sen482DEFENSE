const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {

  it('returns status ok with timestamp', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });

  it('returns version from environment variable when set', async () => {
    process.env.npm_package_version = '9.9.9';

    const res = await request(app).get('/health');

    expect(res.body.version).toBe('9.9.9');
  });

  it('falls back to default version when env is missing', async () => {
    delete process.env.npm_package_version;

    const res = await request(app).get('/health');

    expect(res.body.version).toBe('1.0.0');
  });

});