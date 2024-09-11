/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    //* Custom staleTimes for caching
    staleTimes: {
      dynamic: 30,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
    ],
  },
};

export default nextConfig;

/**
 * experimental configuration indicates that the developer is opting into features that are still in development or testing phases within Next.js.
 *
 * Next.js offers experimental features that are not fully stable or officially released. Developers can opt-in to use these features by including them in the experimental configuration object.
 *
 * Within experimental, staleTimes is configured with { dynamic: 30 }. This likely refers to a feature related to caching or data fetching strategies.
 * dynamic could imply a setting for dynamic content or data that needs to be refreshed after a certain period of time (30 likely denotes seconds here).
 */
