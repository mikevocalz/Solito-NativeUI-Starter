module.exports = (api) => {
  api.cache(true);

  return {
    presets: ['next/babel'],
    // In this pnpm/Turborepo workspace Next runs Babel from the repo-level
    // process cwd. Resolve the TypeGPU Babel subpath from this app's module
    // instead of leaving Babel to search from Next's compiled loader.
    plugins: [require.resolve('unplugin-typegpu/babel')],
  };
};
