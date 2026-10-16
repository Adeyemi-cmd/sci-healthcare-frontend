import type { Page } from '@playwright/test';

/**
 * Keeps test runs from phoning Plausible: the analytics script tag is
 * present whenever NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set (as it is for the
 * test server), so every suite aborts the script request. The analytics
 * spec stubs `window.plausible` itself, which is unaffected by this.
 */
export async function blockAnalytics(page: Page): Promise<void> {
  await page.route('https://plausible.io/**', (route) => route.abort());
}
