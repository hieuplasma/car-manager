module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx'
        ],
        alias: {
          "@redux":["./src/redux"],
          "@utils":["./src/utils"],
          "@screens":["./src/screens"],
          "@navigation":["./src/navigation"],
          "@common":["./src/common"]
        }
      }
    ]
  ]
};
