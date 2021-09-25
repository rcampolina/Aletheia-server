import * as Sentry from "@sentry/node";

export default async function SentryConfig() {
  Sentry.init({
    dsn: process.env.SENTRY_SERVER,
    tracesSampleRate: 1.0,
  });
}