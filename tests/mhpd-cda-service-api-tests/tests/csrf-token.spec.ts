import { test, expect } from '@lib/test.lib';

test.describe('GET - /csrf-token', () => {
  test('should fetch a valid CSRF token', async ({ cdaService }) => {
    const response = await cdaService.getCSRFToken();
    const csrfToken = response.cookies.get('X-XSRF-TOKEN');
    expect(csrfToken).toBeDefined();
    expect(response.status).toBe(200);
    expect(csrfToken).not.toBeNull();
    expect(typeof csrfToken).toBe('string');
    expect((csrfToken as string).length).toBeGreaterThan(0);
  });
});
