module.exports = {
  dependency: {
    platforms: {
      ios: {
        podspecPath: './nim-glass.podspec',
      },
      android: {
        sourceDir: './android',
        packageImportPath: 'import com.nimglass.NimGlassPackage;',
        packageInstance: 'new NimGlassPackage()',
      },
    },
  },
};
