'use client';

import * as Sentry from '@sentry/browser';
import { useEffect } from 'react';

import { ErrorReporter } from '@/components/ErrorReporter';
import { Button, Card } from '@/components/ui';

import './globals.css';

/**
 * Last-resort crash page. Next renders this instead of the root layout when
 * something throws outside an inner boundary, so it initialises error
 * reporting itself (the layout's reporter never mounted) and forwards the
 * crash. The scrubber in `beforeSend` applies here too.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <ErrorReporter />
        <main className="mx-auto max-w-6xl px-6 py-8">
          <Card className="space-y-3 p-5">
            <h1 className="text-xl font-semibold tracking-tight">
              Something went wrong
            </h1>
            <p className="text-sm text-[var(--color-ink-soft)]">
              The page crashed and the team has been notified. No funds move
              without your wallet&apos;s approval, so nothing was submitted by
              this error.
            </p>
            <Button onClick={() => reset()}>Try again</Button>
          </Card>
        </main>
      </body>
    </html>
  );
}
