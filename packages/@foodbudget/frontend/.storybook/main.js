const autoprefixer = require("autoprefixer");

module.exports = {
  addons: [
    "@storybook/addon-actions/register",
    "@storybook/addon-a11y/register",
    "@storybook/addon-viewport/register",
  ],
  stories: ["../src/**/*.stories.tsx"],
  webpackFinal: async (config) => {
    config.module.rules.push({
          test: /\.s?css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                modules:
                     {
                        localIdentName: "[local]",
                      },
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: () => [autoprefixer()],
              },
            },
            "sass-loader",
          ],
          exclude: ["/node_modules/"]
    })

    return config;
  },
};
