const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const webpack = require('webpack');
const path = require('path');
const withTM = require('next-transpile-modules')(
  // All of the packages will resolve to our monorepo so we can match that path.
  [path.resolve(__dirname, '../../packages')]
);

// module.exports = withPWA({
//   pwa: {
//     dest: 'public',
//     runtimeCaching

//   },
//   exportTrailingSlash: true,
// });
module.exports =
  //withTM(
  //withBundleAnalyzer({
  {
    webpack5: true,
    pwa: {
      dest: 'public',
      runtimeCaching,
    },
    trailingSlash: true,
    env: {
      stagingMediaURL: 'https://mcprod.wheelhero.com/media/',
    },
    plugins: [
      new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 10000,
      }),
    ],
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.alias['@sentry/node'] = '@sentry/browser';
      }
      return config;
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // JODIT!!!
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    //  };
    //});
  };
//);

// const withPlugins = require('next-compose-plugins');
// const withImages = require('next-images');
// const withSass = require('@zeit/next-sass');
// const withCSS = require('@zeit/next-css');
// const withFonts = require('next-fonts');
// const webpack = require('webpack');
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

/*const withPWA = require('next-pwa');
module.exports = withTM(
    withPWA({
        pwa: {
            dest: 'public',
        },
        webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
            if (!isServer) {
                config.resolve.alias['@sentry/node'] = '@sentry/browser';
            }
            config.resolve.alias['@pdeals/models'] = '../models/';
            config.resolve.modules.push(path.resolve('./'));
            return config;
        },
    })
);
// const withPWA = require('next-pwa');

module.exports = withBundleAnalyzer(
  withTM(
    withFonts(
      withCSS(
        withImages(
          withSass({
            images: {
              domains: ['res.cloudinary.com'],
            },
            //                    withPWA({
            webpack(config, options) {
              config.plugins.push(
                new webpack.ProvidePlugin({
                  React: 'react',
                })
              );
              config.module.rules.push({
                test: /\.(eot|ttf|woff|woff2)$/,
                use: {
                  loader: 'url-loader',
                },
              });
              if (!options.isServer) {
                config.resolve.alias['@sentry/node'] = '@sentry/browser';
              }
              config.resolve.alias['@pdeals/models'] = '../models/';
              config.resolve.modules.push(path.resolve('../models'));
              config.resolve.modules.push(path.resolve('./'));
              return config;
            },
          })
        )
      )
    )
  )
);
*/
