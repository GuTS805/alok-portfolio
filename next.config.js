/** @type {import('next').NextConfig} */
const nextConfig = {
  // The dev server only trusts `localhost` by default, so hitting it via
  // `127.0.0.1` (as verify-intro.py and some browsers do) gets its HMR
  // websocket blocked as a cross-origin dev request — which in turn stops the
  // client from hydrating, leaving the domain-expansion intro (and all motion)
  // dead. Trust the loopback IP too so dev matches production.
  allowedDevOrigins: ['127.0.0.1'],
};

module.exports = nextConfig;
