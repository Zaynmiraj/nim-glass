module.exports = {
  project: {},
  commands: [],
  dependencies: {
    'nim-glass': {
      root: '.',
      platforms: {
        ios: {
          sourceDir: './ios'
        },
        android: {
          sourceDir: './android'
        }
      }
    }
  }
};
