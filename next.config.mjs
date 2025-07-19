/** @type {import('next').NextConfig} */
const nextConfig = {
    // This is the critical fix.
    // We are telling the Next.js server-side bundler to NOT try and be clever
    // with the 'pdf-parse' library. Instead, it should just treat it as
    // an external package to be required at runtime. This prevents the
    // bundler from accidentally trying to execute its internal test files.
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push('pdf-parse');
        }
        return config;
    },
    // We can also add experimental flags for other potentially problematic packages
    // This is a good practice for robustness.
    experimental: {
        serverComponentsExternalPackages: ['mammoth'],
    },
};

export default nextConfig;