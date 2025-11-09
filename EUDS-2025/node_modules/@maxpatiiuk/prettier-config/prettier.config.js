/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  // Single quote is more popular among JS libraries
  singleQuote: true,
  // GitHub renders Markdown in whitespace-insensitive way, so we should wrap prose
  proseWrap: "always",
  plugins: [
    "@prettier/plugin-xml",
    "prettier-plugin-package",
    "prettier-plugin-sh",
    "prettier-plugin-tailwindcss",
  ],
};

export default config;
