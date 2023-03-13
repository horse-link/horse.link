/// <reference types="vitest" />
import { defineConfig, loadEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";

export default ({ mode }: UserConfig) => {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  process.env = { ...process.env, ...loadEnv(mode!, process.cwd()) }; // mode is not null as UserConfig is an interface with all optional types

  return defineConfig({
    plugins: [
      react(),
      svgrPlugin({
        svgrOptions: {
          icon: true
        }
      })
    ],
    define: {
      "process.env": process.env
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      env: {
        VITE_SUBGRAPH_URL: "mock_url",
        VITE_ALCHEMY_API_KEY: "mock_key",
        VITE_SCANNER_URL: "https://goerli.etherscan.io",
        VITE_API_URL: "/",
        VITE_WALLET_NAV_ACTIVE: "true",
        VITE_EVENT_TS: "1679269426000"
      }
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "assets/[name].js",
          chunkFileNames: "assets/[name].js",
          assetFileNames: "assets/[name].[ext]"
        }
      }
    }
  });
};
