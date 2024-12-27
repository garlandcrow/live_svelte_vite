import { getRender } from "live_svelte";

const Components = import.meta.glob("../svelte/**/*.svelte", { eager: true });

export const render = getRender(Components);
