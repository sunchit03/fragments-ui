module.exports = function (webpack) {
  return {
    resolve: {
      fallback: {
        util: require.resolve('util/'),
        fs: false,
        os: false,
        path: false,
      },
    },
  };
};
