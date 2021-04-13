const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const withFonts = require('next-fonts');
const webpack = require('webpack');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const path = require('path');
const withTM = require('next-transpile-modules')(
  // All of the packages will resolve to our monorepo so we can match that path.
  [path.resolve(__dirname, '../../packages')]
);
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
*/
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
