import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/schema.ts",
  generates: {
    "./src/_generated/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
