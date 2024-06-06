/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        //formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "rlv.zcache.com",
            },
            {
                protocol: "https",
                hostname: "www.zazzle.com",
            },
            {
                protocol: "https",
                hostname:"images.pexels.com"
            }

        ],
    },
};

export default nextConfig;
