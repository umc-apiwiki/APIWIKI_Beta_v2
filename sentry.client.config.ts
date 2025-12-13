import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN || '';

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || 'development',
  tunnel: process.env.NEXT_PUBLIC_SENTRY_TUNNEL || '/api/glitchtip-tunnel',
});
