const htmlLoader = require('html-loader');

module.exports = {
  async process(sourceText) {
    return {
      code: `module.exports = ${await htmlLoader(sourceText)};`,
    };
  },
};
