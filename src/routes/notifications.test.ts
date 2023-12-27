import supertest from 'supertest'; 
import { app } from '..';

describe('GET /posts', () => {
  it('should return paginated posts', async () => {
    const response = await supertest(app)
      .get('/posts')
      .query({ page: 1, pageSize: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('currentPage', 1);
    expect(response.body).toHaveProperty('pageSize', 1);
    expect(response.body).toHaveProperty('totalItems');
  });

});
