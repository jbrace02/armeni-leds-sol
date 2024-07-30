const webpack = require('webpack');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert'),
        os: require.resolve('os-browserify'),
        path: require.resolve('path-browserify'),
        buffer: require.resolve('buffer/'),
      };
      config.resolve.alias = {
        ...config.resolve.alias,
        '@solana/web3.js': require.resolve('@solana/web3.js'),
      };
    }
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      })
    );
    return config;
  },
  transpilePackages: [
    '@solana/web3.js',
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-react-ui',
    '@tiplink/wallet-adapter',
    '@mui/material',
    '@mui/icons-material',
    '@emotion/react',
    '@emotion/styled',
    '@solana-mobile/wallet-adapter-mobile',
    '@solana-mobile/mobile-wallet-adapter-protocol-web3js',
  ],
  images: {
    disableStaticImages: false,
  },
};
