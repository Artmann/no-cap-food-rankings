import { withSentryConfig } from '@sentry/nextjs'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

export default withSentryConfig(nextConfig, {
  org: 'pmkin',
  project: 'no-cap-food-rankings',
  silent: !process.env.CI
})
