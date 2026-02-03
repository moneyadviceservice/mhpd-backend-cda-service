import { APIClient } from '@lib/api.lib';
import { env } from '@lib/env.lib';
import { type APIRequestContext } from '@playwright/test';

interface PensionsDataHeaders {
  userSessionId: string;
  iss: string;
  mhpdCorrelationId: string;
  'X-XSRF-TOKEN': string;
}

interface PensionsData {
  clientId: string;
  clientSecret: string;
  authorisationCode: string;
  redirectUrl: string;
  codeVerifier: string;
}

export class PensionsDataService {
  protected readonly apiClient: APIClient;
  protected readonly baseURL = env.BASE_URL_PDS;

  constructor(request: APIRequestContext) {
    this.apiClient = new APIClient(request, this.baseURL);
  }

  async postPensionsData(headers: PensionsDataHeaders, data: PensionsData) {
    return this.apiClient.post('/pensions-data', {
      headers: headers as unknown as Record<string, string>,
      data: data as unknown as Record<string, string>,
    });
  }

  async getCSRFToken() {
    return this.apiClient.get('/csrf-token');
  }
}
