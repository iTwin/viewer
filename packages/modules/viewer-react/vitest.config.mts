import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    target: 'esnext',
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/vitest.setup.ts",
    globals: true,
    include: ["src/tests/**/*.test.{ts,tsx}"],
    deps: {
      inline: ["@itwin/appui-react", "@itwin/imodel-components-react", "@itwin/components-react", "@itwin/core-react",
        "@itwin/presentation-components"
      ]
    },
  },
});