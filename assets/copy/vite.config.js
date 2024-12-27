import path from "path"
import {defineConfig} from "vite"
import {svelte} from "@sveltejs/vite-plugin-svelte"
import liveSvelte from "live_svelte/vitePlugin"

// https://vitejs.dev/config/
export default defineConfig(({command}) => {
  const isDev = command !== "build"

  return {
    base: isDev ? undefined : "/assets",
    publicDir: "static",
    plugins: [svelte(), liveSvelte()],
    worker: {
      format: "es",
    },
    ssr: {
      // we need it, because in SSR build we want no external
      // and in dev, we want external for fast updates
      noExternal: isDev ? undefined : true,
    },
    build: {
      commonjsOptions: {transformMixedEsModules: true},
      target: "es2020",
      outDir: "../priv/static/assets", // emit assets to priv/static/assets
      emptyOutDir: true,
      sourcemap: isDev, // enable source map in dev build
      manifest: false, // do not generate manifest.json
      rollupOptions: {
        input: {
          app: path.resolve(__dirname, "./js/app.js"),
        },
        output: {
          // remove hashes to match phoenix way of handling assets
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name][extname]",
        },
      },
    },
  }
})
