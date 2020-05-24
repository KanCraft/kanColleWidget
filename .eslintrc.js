module.exports = {
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    node: true,
    browser: true,
    es6: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    chrome: "readonly"
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      ts: true,
      tsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: [
    "react"
  ],
  rules: {
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "indent": [
      "error",
      2,
      {"SwitchCase": 0}
    ],
    "@typescript-eslint/indent": [
      "error", 2, { "SwitchCase": 0 }
    ],
    "@typescript-eslint/explicit-function-return-type": ["off"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/no-parameter-properties": ["error", { allows: ["private", "public"] }],
    "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "no-public" }]
  }
};