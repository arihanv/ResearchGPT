/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
      config.externals = [...config.externals, "canvas", "jsdom","encoding","detalib"];
      config.resolve.fallback = { fs: false };
     return config;
  },
  compiler: {
    removeConsole:process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
   },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // ignoreDuringBuilds: true,
  },
  // typescript: {
  //   // !! WARN !!
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has type errors.
  //   // !! WARN !!
  //   ignoreBuildErrors: true,
  // },
}

export default nextConfig
