import recommended from "@timmo001/oxlint-rules/configs/recommended";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [recommended],
  plugins: ["typescript", "unicorn", "oxc"],
  categories: {
    correctness: "error",
  },
  options: {
    typeAware: true,
  },
  ignorePatterns: [".astro/**", "dist/**", "temp/**"],
  rules: {
    "typescript/no-explicit-any": "error",
    "typescript/no-floating-promises": "error",
    "typescript/no-misused-promises": "error",
    "typescript/await-thenable": "error",
    "typescript/no-unsafe-argument": "error",
    "typescript/no-unsafe-assignment": "error",
    "typescript/no-unsafe-call": "error",
    "typescript/no-unsafe-member-access": "error",
    "typescript/no-unsafe-return": "error",
  },
});
