import { expect, test } from '@playwright/test';

import { E2E_CONTRACTS } from './contracts';
import { ATTESTER, CLAIMED_VOUCHER } from './fixtures';
import { mockBackend, mockInvokes, useMockWallet } from './helpers';

/** Attester flow: a claimed voucher is confirmed as delivered. */

test.beforeEach(async ({ page }) => {
  await useMockWallet(page, ATTESTER);
  await mockBackend(page, { vouchers: [CLAIMED_VOUCHER('22')] });
});

test('attester confirms care delivered', async ({ page }) => {
  await page.goto('/attest');

  await expect(page.getByText('Awaiting confirmation')).toBeVisible();
  await page.getByRole('button', { name: 'Confirm care delivered' }).click();

  await expect(page.getByText('Done.')).toBeVisible();
  expect(await mockInvokes(page)).toContainEqual({
    kind: 'invoke',
    contractId: E2E_CONTRACTS.voucher,
    method: 'attest',
  });
});
