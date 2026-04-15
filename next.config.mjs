/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "www-asia.nissan-cdn.net",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/offers",
        destination: "/cars",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
