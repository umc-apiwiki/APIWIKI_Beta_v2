const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  // Sentry 설정이 없어도 빌드가 가능하도록 설정
  sentry: {
    disableServerWebpackPlugin: !process.env.SENTRY_AUTH_TOKEN,
    disableClientWebpackPlugin: !process.env.SENTRY_AUTH_TOKEN,
  },
};

const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  url: process.env.GLITCHTIP_SERVER_URL,
  silent: true,
  // 환경 변수가 없을 때는 Sentry 업로드를 건너뜀
  dryRun: !process.env.SENTRY_AUTH_TOKEN,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions, {
  hideSourceMaps: true,
  disableLogger: true,
});