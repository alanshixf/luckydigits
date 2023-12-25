/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "user-images.githubusercontent.com" },
      { hostname: "s3.amazonaws.com" },
      { hostname: "www.davegray.codes" },
    ],
  },
};

module.exports = nextConfig;
