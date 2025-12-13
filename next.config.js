const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
};

const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  url: process.env.GLITCHTIP_SERVER_URL,
  silent: true,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions, {
  hideSourceMaps: false,
  disableLogger: true,
});