const webpack = require("webpack");

module.exports = {
  webpack: {
    plugins: {
      add: [
        [
          new webpack.ProvidePlugin({
            process: "process/browser",
          }),
          "append",
        ],
      ],
    },
    configure: (config, { env, paths }) => {
      if (env === "production") {
        // we aren't interested in generating HTML files
        const removePlugins = [
          "HtmlWebpackPlugin",
          "InlineChunkHtmlPlugin",
          "InterpolateHtmlPlugin",
        ];
        // Get rid of HTML generation plugins
        config.plugins = config.plugins.filter(
          (element) => !removePlugins.includes(element.constructor.name)
        );

        // Get rid of hash for js files
        config.output.filename = "[name].js";
        config.output.chunkFilename = "[name].chunk.js";
        config.output.assetModuleFilename = "[name][ext]";
        // config.output.path = config.output.path.replace(/\/build$/, "/dist");

        // Get rid of hash for css files
        const miniCssExtractPlugin = config.plugins.find(
          (element) => element.constructor.name === "MiniCssExtractPlugin"
        );
        miniCssExtractPlugin.options.filename = "[name].css";
        miniCssExtractPlugin.options.chunkFilename = "[name].css";

        // Get rid of hash for media files
        config.module.rules[1].oneOf.forEach((oneOf) => {
          if (
            !oneOf.options ||
            oneOf.options.name !== "static/media/[name].[hash:8].[ext]"
          ) {
            return;
          }
          oneOf.options.name = "[name].[ext]";
        });

        // Get rid of code-split chunks
        config.optimization.splitChunks = {
          // chunks: 'all',
          // name: false,
          cacheGroups: {
            default: false,
          },
        };
        config.optimization.runtimeChunk = false;
      }

      return config;
    },
  },
};
