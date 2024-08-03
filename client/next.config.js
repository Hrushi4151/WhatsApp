/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
   env:{
     NEXT_PUBLIC_ZEGO_APP_ID:"1727954945",
     NEXT_PUBLIC_ZEGO_SERVER_ID:"160198d1ae33dd709db36c0eb8ee5c86"
   },
  images:{
    domains:["localhost"]
  }
};

module.exports = nextConfig;
