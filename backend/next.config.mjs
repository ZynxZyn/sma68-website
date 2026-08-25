/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@prisma/client'],
  outputFileTracingRoot: new URL('../', import.meta.url).pathname,
};

export default nextConfig;
