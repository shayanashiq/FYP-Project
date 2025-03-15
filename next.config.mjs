/** @type {import('next').NextConfig} */
import { startNotificationCron } from "./src/server/cronJob.mjs"


// startNotificationCron()
const nextConfig = {
  images: {
    domains: [
      
    ],
  },
};

export default nextConfig;
