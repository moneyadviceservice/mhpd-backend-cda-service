import { test as baseTest } from '@playwright/test';
import { CDAService } from '@services/cda-service';
import { PensionsDataService } from '@services/pensions-data-service';

interface TestFixtures {
  cdaService: CDAService;
  pensionsDataService: PensionsDataService;
}

export const test = baseTest.extend<TestFixtures>({
  cdaService: async ({ request }, use) => {
    const cdaService = new CDAService(request);
    await use(cdaService);
  },

  pensionsDataService: async ({ request }, use) => {
    const pensionsDataService = new PensionsDataService(request);
    await use(pensionsDataService);
  },
});

export * from '@playwright/test';
