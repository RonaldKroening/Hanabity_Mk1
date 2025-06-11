const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    mode: env.mode || 'development', // Don't force production
    paths: {
      ...env.paths,
      publicUrl: '/'
    }
  }, argv);

  config.output.publicPath = '/';
  return config;
};