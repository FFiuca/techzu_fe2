/** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


import withPWA from 'next-pwa';

const nextConfig = {
    reactStrictMode: true,      // Enable React strict mode for improved error handling
    // swcMinify: true,            // Enable SWC minification for improved performance
    compiler: {
        // removeConsole: process.env.NODE_ENV !== "development"     // Remove console.log in production
        removeConsole: false
    },
    // future: {
    //     webpack5: true,
    // },
};


export default withPWA({
        dest: "public",         // destination directory for the PWA files
        // disable: process.env.NODE_ENV === "development",        // disable PWA in the development environment
        // disable: false,
        register: true,         // register the PWA service worker
        skipWaiting: true,      // skip waiting for service worker
        // cacheOnFrontEndNav : true,
        reloadOnOnline:true,
        // runtimeCaching: [
        //     {
        //       urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
        //       handler: 'CacheFirst',
        //       options: {
        //         cacheName: 'google-fonts',
        //         expiration: {
        //           maxEntries: 4,
        //           maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        //         },
        //       },
        //     },
        //     {
        //       urlPattern: /^https:\/\/use\.fontawesome\.com\/.*/i,
        //       handler: 'CacheFirst',
        //       options: {
        //         cacheName: 'font-awesome',
        //         expiration: {
        //           maxEntries: 1,
        //           maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        //         },
        //       },
        //     },
        //     {
        //       urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
        //       handler: 'CacheFirst',
        //       options: {
        //         cacheName: 'jsdelivr',
        //         expiration: {
        //           maxEntries: 10,
        //           maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        //         },
        //       },
        //     },
        //   ],
        fallbacks: {
            document: '/_offline', // Your custom offline page
        },
})(nextConfig);
