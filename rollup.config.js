import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const production = process.env.ROLLUP_WATCH !== "true";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/nodalia-media-player.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    production && terser(),
  ],
};
