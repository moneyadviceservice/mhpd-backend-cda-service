import { type APIRequestContext } from '@playwright/test';
import { APIClient } from '@lib/api.lib';
import { ClaimsGatheringRedirect } from 'schemas/claimsGatheringRedirect.schema';
import { rqp } from 'schemas/rqp.schema';
import { RedirectDetails } from 'schemas/redirectDetails.schema';
import { env } from '@lib/env.lib';

interface RqpParams {
  userSessionId: string;
  iss: string;
  mhpdCorrelationId: string;
}

interface ClaimsGatheringRedirectParams {
  userSessionId: string;
  iss: string;
  mhpdCorrelationId: string;
}

interface RedirectDetailsHeaders {
  userSessionId: string;
  iss: string;
  mhpdCorrelationId: string;
  'X-XSRF-TOKEN': string;
}

export class CDAService {
  protected readonly apiClient: APIClient;
  protected readonly baseURL = env.BASE_URL;

  constructor(request: APIRequestContext) {
    this.apiClient = new APIClient(request, this.baseURL);
  }

  async getClaimsGatheringRedirect(headers: ClaimsGatheringRedirectParams) {
    return this.apiClient.get<ClaimsGatheringRedirect>('/claims-gathering-redirect', {
      headers: headers as unknown as Record<string, string>,
    });
  }

  async postRedirectDetails(headers: RedirectDetailsHeaders) {
    return this.apiClient.post<RedirectDetails>('/redirect-details', {
      headers: headers as unknown as Record<string, string>,
    });
  }

  async getRqp(headers: RqpParams) {
    return this.apiClient.get<rqp>('/rqp', {
      headers: headers as unknown as Record<string, string>,
    });
  }

  async getCSRFToken() {
    return this.apiClient.get('/csrf-token');
  }
}
