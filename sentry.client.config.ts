import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://0c426d58e5a0f7625362cf8d0dab69db@o1110961.ingest.us.sentry.io/4511005529473024',
  environment: process.env.NODE_ENV,
  integrations: [Sentry.replayIntegration()],
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  tracesSampleRate: 1.0
})
