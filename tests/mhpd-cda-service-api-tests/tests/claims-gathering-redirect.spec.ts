import { test, expect } from '@lib/test.lib';
import { v4 as uuid } from 'uuid';
import { ClaimsGatheringRedirectSchema } from 'schemas/claimsGatheringRedirect.schema';
import { env } from '@lib/env.lib';

const iss = 'some-iss';

test.describe('GET - /claims-gathering-redirect', () => {
  test('should return valid schema with successful request', async ({ cdaService, pensionsDataService }) => {
    const sessionId = uuid();
    const pdsCsrfResponse = await pensionsDataService.getCSRFToken();
    const pdsCsrfToken = pdsCsrfResponse.cookies.get('X-XSRF-TOKEN');

    expect(pdsCsrfToken).toBeDefined();

    const headers = {
      userSessionId: sessionId,
      iss: iss,
      mhpdCorrelationId: sessionId,
    };

    const headersWithCsrfToken = { ...headers, 'X-XSRF-TOKEN': pdsCsrfToken as string };

    const body = {
      clientId: env.CLIENT_ID,
      clientSecret: env.CLIENT_SECRET,
      authorisationCode: env.AUTHORISATION_CODE,
      redirectUrl: env.REDIRECT_URL,
      codeVerifier: env.CODE_VERIFIER,
    };

    const pensionDataResponse = await pensionsDataService.postPensionsData(headersWithCsrfToken, body);
    expect(pensionDataResponse.status).toBe(202);

    const response = await cdaService.getClaimsGatheringRedirect(headers);
    expect(response.status).toBe(200);

    const validation = ClaimsGatheringRedirectSchema.safeParse(response.data);

    if (!validation.success) {
      console.error(
        '❌ Claims Gathering Redirect Schema Validation Failed:',
        JSON.stringify(validation.error.issues, null, 2),
      );
    }

    expect(validation.success).toBe(true);
  });

  test('should return 200 with missing correlation id', async ({ cdaService, pensionsDataService }) => {
    const userSessionId = uuid();

    const pdsCsrfResponse = await pensionsDataService.getCSRFToken();
    const pdsCsrfToken = pdsCsrfResponse.cookies.get('X-XSRF-TOKEN');

    expect(pdsCsrfToken).toBeDefined();

    const headers = {
      userSessionId: userSessionId,
      iss: iss,
      mhpdCorrelationId: '',
    };

    const headersWithCsrfToken = { ...headers, 'X-XSRF-TOKEN': pdsCsrfToken as string };

    const body = {
      clientId: env.CLIENT_ID,
      clientSecret: env.CLIENT_SECRET,
      authorisationCode: env.AUTHORISATION_CODE,
      redirectUrl: env.REDIRECT_URL,
      codeVerifier: env.CODE_VERIFIER,
    };

    const pensionDataResponse = await pensionsDataService.postPensionsData(headersWithCsrfToken, body);
    expect(pensionDataResponse.status).toBe(202);

    const response = await cdaService.getClaimsGatheringRedirect(headers);
    expect(response.status).toBe(200);
  });

  test('should return 400 with invalid correlation id', async ({ cdaService }) => {
    const userSessionId = uuid();
    const response = await cdaService.getClaimsGatheringRedirect({
      userSessionId,
      iss,
      mhpdCorrelationId: 'invalid',
    });

    expect(response.status).toBe(400);
  });

  test('should return 400 with missing user session id', async ({ cdaService }) => {
    const mhpdCorrelationId = uuid();
    const response = await cdaService.getClaimsGatheringRedirect({
      userSessionId: '',
      iss,
      mhpdCorrelationId,
    });

    expect(response.status).toBe(400);
  });

  test('should return 400 with invalid user session id', async ({ cdaService }) => {
    const mhpdCorrelationId = uuid();
    const response = await cdaService.getClaimsGatheringRedirect({
      userSessionId: 'invalidid',
      iss,
      mhpdCorrelationId,
    });

    expect(response.status).toBe(400);
  });

  test('should return 400 with missing iss', async ({ cdaService }) => {
    const sessionId = uuid();
    const response = await cdaService.getClaimsGatheringRedirect({
      userSessionId: sessionId,
      iss: '',
      mhpdCorrelationId: sessionId,
    });

    expect(response.status).toBe(400);
  });
});
