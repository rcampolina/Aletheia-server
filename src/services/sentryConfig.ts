import * as Sentry from "@sentry/node";

export default async function SentryConfig() {
  Sentry.init({
    dsn: process.env.SENTRY_CONFIG,
    tracesSampleRate: 1.0,
  });
}