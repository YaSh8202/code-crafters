// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import removeImports from 'next-remove-imports'

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));


/** @type {function(import("next").NextConfig): import("next").NextConfig}} */
const removeImportsFun = removeImports({
  // test: /node_modules([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
  // matchImports: "\\.(less|css|scss|sass|styl)$"
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ["avatars.githubusercontent.com", "upcdn.io", "res.cloudinary.com", "firebasestorage.googleapis.com"],
  },
  staticPageGenerationTimeout: 100,
};
// export default config;
const nextConfig = {
  ...removeImportsFun({
    webpack(config,) {
      return config
    },
  }),
  ...config,
};

export default nextConfig;
