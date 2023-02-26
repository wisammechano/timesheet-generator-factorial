const webpack = require("webpack");

const shouldUseSourceMap = false;
process.env.GENERATE_SOURCEMAP = shouldUseSourceMap;

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
          "MiniCssExtractPlugin",
        ];
        // Get rid of HTML generation plugins
        config.plugins = config.plugins.filter(
          (element) => !removePlugins.includes(element.constructor.name)
        );

        // Get rid of hash for js files
        // renaming file to prevent the need to change bookmarklet links
        config.output.filename = "bundle.js";
        config.output.chunkFilename = "[name].chunk.js";
        config.output.assetModuleFilename = "[name][ext]";
        // config.output.path = config.output.path.replace(/\/build$/, "/dist");

        // Re-enable style-loader
        config.module.rules[0].oneOf.forEach((oneof) => {
          if (oneof.test?.toString() === "/\\.css$/") {
            oneof.use = cssLoader();
          }
        });

        // Get rid of hash for css files
        const miniCssExtractPlugin = config.plugins.find(
          (element) => element.constructor.name === "MiniCssExtractPlugin"
        );
        if (miniCssExtractPlugin) {
          miniCssExtractPlugin.options.filename = "[name].css";
          miniCssExtractPlugin.options.chunkFilename = "[name].css";
        }

        // Get rid of code-split chunks
        config.optimization.minimize = false;
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

function cssLoader() {
  const loaders = [
    require.resolve("style-loader"),
    {
      loader: require.resolve("css-loader"),
      options: {
        importLoaders: 1,
        sourceMap: shouldUseSourceMap,
        modules: {
          mode: "icss",
        },
      },
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve("postcss-loader"),
      options: {
        postcssOptions: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: "postcss",
          config: false,
          plugins: [
            "tailwindcss",
            "postcss-flexbugs-fixes",
            [
              "postcss-preset-env",
              {
                autoprefixer: {
                  flexbox: "no-2009",
                },
                stage: 3,
              },
            ],
          ],
        },
        sourceMap: shouldUseSourceMap,
      },
    },
  ];

  return loaders;
}
