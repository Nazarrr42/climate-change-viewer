const path = require("path");
const vueSrc = "./src";

module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        options.prettify = false;
        return options;
      });
  },
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      sass: {
        data: ' @import "@/assets/styles/globals.scss"; ',
      },
    },
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.geojson$/,
          loader: "json-loader",
        },
      ],
    },
    resolve: {
      alias: {
        "@": path.join(__dirname, vueSrc),
      },
    },
  },
};
