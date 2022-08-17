module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true,
    mocha: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: { "no-console": "off", "prettier/prettier": "error" },
  plugins: ["mocha", "prettier"],
};
