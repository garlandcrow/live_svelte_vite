import { Plugin } from "vite";
interface PluginOptions {
    path?: string;
    entrypoint?: string;
}
declare function liveSveltePlugin(opts?: PluginOptions): Plugin;
export default liveSveltePlugin;
