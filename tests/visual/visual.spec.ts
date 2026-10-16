import { expect, test } from '@playwright/test';

import { blockAnalytics } from '../analytics-guard';
import {
  blockRpc,
  CLINIC_ADDRESS,
  freezeClock,
  mockApi,
  settle,
  VOUCHER_ID,
} from './fixtures';

/**
 * Visual regression snapshots for the six routes that make up the app.
 *
 * Each test runs once per project (desktop 1280px, mobile 390px) with the
 * backend mocked, so no testnet, indexer or wallet is needed. If a snapshot
 * fails after an intentional style change, run
 * `npm run test:visual:update`, inspect the diff, and commit the new files.
 */

test.beforeEach(async ({ page }) => {
  await freezeClock(page);
  await blockRpc(page);
  await blockAnalytics(page);
  await mockApi(page);
});

test('home — verified clinic directory', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Verified clinics')).toBeVisible();
  await expect(page.getByText('Ikeja General Clinic')).toBeVisible();
  await settle(page);
  await expect(page).toHaveScreenshot('home.png');
});

test('clinic detail — fund a voucher', async ({ page }) => {
  await page.goto(`/clinics/${CLINIC_ADDRESS}`);
  await expect(page.getByText('Fund care')).toBeVisible();
  await expect(page.getByText('Outpatient consult').first()).toBeVisible();
  await settle(page);
  await expect(page).toHaveScreenshot('clinic-detail.png');
});

test('my vouchers — disconnected', async ({ page }) => {
  await page.goto('/my');
  await expect(page.getByText('Vouchers I funded')).toBeVisible();
  await settle(page);
  await expect(page).toHaveScreenshot('my.png');
});

test('clinic desk — disconnected', async ({ page }) => {
  await page.goto('/clinic');
  await expect(page.getByText('Connect the clinic')).toBeVisible();
  await settle(page);
  await expect(page).toHaveScreenshot('clinic-desk.png');
});

test('attest — disconnected', async ({ page }) => {
  await page.goto('/attest');
  await expect(page.getByText('Connect an attester')).toBeVisible();
  await settle(page);
  await expect(page).toHaveScreenshot('attest.png');
});

test('voucher detail — history and receipt', async ({ page }) => {
  await page.goto(`/vouchers/${VOUCHER_ID}`);
  await expect(page.getByText('History')).toBeVisible();
  await expect(page.getByText('Outpatient consult').first()).toBeVisible();
  await settle(page);
  await expect(page).toHaveScreenshot('voucher.png');
});
