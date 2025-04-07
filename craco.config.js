// craco.config.js
module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.module.rules.forEach((rule) => {
          if (Array.isArray(rule.oneOf)) {
            rule.oneOf.forEach((oneOfRule) => {
              if (oneOfRule.use) {
                oneOfRule.use.forEach((loaderConfig) => {
                  if (
                    loaderConfig.loader &&
                    loaderConfig.loader.includes('postcss-loader')
                  ) {
                    // Ensure we have an exclude array
                    loaderConfig.exclude = loaderConfig.exclude || [];
                    // Exclude react-datepicker's CSS files from being processed by PostCSS
                    loaderConfig.exclude.push(/node_modules\/react-datepicker/);
                  }
                });
              }
            });
          }
        });
        return webpackConfig;
      },
    },
    style: {
      postcss: {
        plugins: [
          require('postcss-import'),
          require('@tailwindcss/postcss')(),
          require('autoprefixer'),
        ],
      },
    },
  };