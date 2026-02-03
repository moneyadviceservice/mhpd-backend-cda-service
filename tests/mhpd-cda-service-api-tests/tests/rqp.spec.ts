import { test, expect } from '@lib/test.lib';
import { v4 as uuid } from 'uuid';
import { rqpSchema } from 'schemas/rqp.schema';

const iss = 'some-iss';

test.describe('GET - /rqp', () => {
  test('should return valid schema with successful request', async ({ cdaService }) => {
    const sessionId = uuid();
    const response = await cdaService.getRqp({
      userSessionId: sessionId,
      iss,
      mhpdCorrelationId: sessionId,
    });

    expect(response.status).toBe(200);

    const validation = rqpSchema.safeParse(response.data);

    if (!validation.success) {
      console.error('❌ rqp Schema Validation Failed:', JSON.stringify(validation.error.issues, null, 2));
    }

    expect(validation.success).toBe(true);
  });

  test('should return 200 with missing correlation id', async ({ cdaService }) => {
    const userSessionId = uuid();
    const response = await cdaService.getRqp({
      userSessionId,
      iss,
      mhpdCorrelationId: '',
    });

    expect(response.status).toBe(200);
  });

  test('should return 400 with invalid correlation id', async ({ cdaService }) => {
    const userSessionId = uuid();
    const response = await cdaService.getRqp({
      userSessionId,
      iss,
      mhpdCorrelationId: 'invalid',
    });

    expect(response.status).toBe(400);
  });

  test('should return 400 with missing user session id', async ({ cdaService }) => {
    const mhpdCorrelationId = uuid();
    const response = await cdaService.getRqp({
      userSessionId: '',
      iss,
      mhpdCorrelationId,
    });

    expect(response.status).toBe(400);
  });

  test('should return 400 with invalid user session id', async ({ cdaService }) => {
    const mhpdCorrelationId = uuid();
    const response = await cdaService.getRqp({
      userSessionId: 'invalidid',
      iss,
      mhpdCorrelationId,
    });

    expect(response.status).toBe(400);
  });

  test('should return 400 with missing iss', async ({ cdaService }) => {
    const sessionId = uuid();
    const response = await cdaService.getRqp({
      userSessionId: sessionId,
      iss: '',
      mhpdCorrelationId: sessionId,
    });

    expect(response.status).toBe(400);
  });
});
