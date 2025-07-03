import {FlatCompat} from "@eslint/eslintrc";
import pluginReact from "eslint-plugin-react";
import {dirname} from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Enforce arrow function components by default
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react: pluginReact,
    },
    rules: {
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "function-declaration",
          unnamedComponents: "function-expression", // for HOC returns
        },
      ],
    },
  },
];

export default eslintConfig;
