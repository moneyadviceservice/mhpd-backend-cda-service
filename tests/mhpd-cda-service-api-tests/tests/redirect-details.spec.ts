import { test, expect } from '@lib/test.lib';
import { RedirectDetailsSchema } from 'schemas/redirectDetails.schema';
import { v4 as uuid } from 'uuid';

const iss = 'some-iss';

test.describe('POST - /redirect-details', () => {
  test('should return valid schema with successful request', async ({ cdaService }) => {
    const sessionId = uuid();

    const csrfResponse = await cdaService.getCSRFToken();
    const csrfToken = csrfResponse.cookies.get('X-XSRF-TOKEN');

    expect(csrfToken).toBeDefined();

    const response = await cdaService.postRedirectDetails({
      userSessionId: sessionId,
      iss: iss,
      mhpdCorrelationId: sessionId,
      'X-XSRF-TOKEN': csrfToken as string,
    });

    expect(response.status).toBe(200);

    const validation = RedirectDetailsSchema.safeParse(response.data);

    if (!validation.success) {
      console.error(
        '❌ Redirect Details Schema Validation Failed:',
        JSON.stringify(validation.error.issues, null, 2),
      );
    }

    expect(validation.success).toBe(true);
  });

  test('should return 200 with missing correlation id', async ({ cdaService }) => {
    const userSessionId = uuid();

    const csrfResponse = await cdaService.getCSRFToken();
    const csrfToken = csrfResponse.cookies.get('X-XSRF-TOKEN');

    expect(csrfToken).toBeDefined();

    const response = await cdaService.postRedirectDetails({
      userSessionId,
      iss: iss,
      mhpdCorrelationId: '',
      'X-XSRF-TOKEN': csrfToken as string,
    });

    expect(response.status).toBe(200);
  });

  test('should return 400 with invalid correlation id', async ({ cdaService }) => {
    const userSessionId = uuid();

    const csrfResponse = await cdaService.getCSRFToken();
    const csrfToken = csrfResponse.cookies.get('X-XSRF-TOKEN');

    expect(csrfToken).toBeDefined();

    const response = await cdaService.postRedirectDetails({
      userSessionId,
      iss: iss,
      mhpdCorrelationId: 'invalid',
      'X-XSRF-TOKEN': csrfToken as string,
    });

    expect(response.status).toBe(400);
  });

  test('should return 400 with missing user session id', async ({ cdaService }) => {
    const mhpdCorrelationId = uuid();

    const csrfResponse = await cdaService.getCSRFToken();
    const csrfToken = csrfResponse.cookies.get('X-XSRF-TOKEN');

    expect(csrfToken).toBeDefined();

    const response = await cdaService.postRedirectDetails({
      userSessionId: '',
      iss: iss,
      mhpdCorrelationId,
      'X-XSRF-TOKEN': csrfToken as string,
    });

    expect(response.status).toBe(400);
  });

  test('should return 400 with invalid user session id', async ({ cdaService }) => {
    const mhpdCorrelationId = uuid();

    const csrfResponse = await cdaService.getCSRFToken();
    const csrfToken = csrfResponse.cookies.get('X-XSRF-TOKEN');

    expect(csrfToken).toBeDefined();

    const response = await cdaService.postRedirectDetails({
      userSessionId: 'invalid',
      iss: iss,
      mhpdCorrelationId,
      'X-XSRF-TOKEN': csrfToken as string,
    });

    expect(response.status).toBe(400);
  });

  test('should return 400 with missing iss', async ({ cdaService }) => {
    const sessionId = uuid();

    const csrfResponse = await cdaService.getCSRFToken();
    const csrfToken = csrfResponse.cookies.get('X-XSRF-TOKEN');

    expect(csrfToken).toBeDefined();

    const response = await cdaService.postRedirectDetails({
      userSessionId: sessionId,
      iss: '',
      mhpdCorrelationId: sessionId,
      'X-XSRF-TOKEN': csrfToken as string,
    });

    expect(response.status).toBe(400);
  });
});
