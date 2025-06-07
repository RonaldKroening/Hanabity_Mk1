const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    mode: 'production',
    paths: {
      ...env.paths,
      publicUrl: './' 
    }
  }, argv);

  return config;
};