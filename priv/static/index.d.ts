export { getRender } from "./render";
export { getHooks } from "./hooks.svelte";
export type Live = {
    pushEvent(event: string, payload?: object, onReply?: (reply: any, ref: number) => void): number;
    pushEventTo(phxTarget: any, event: string, payload?: object, onReply?: (reply: any, ref: number) => void): number;
    handleEvent(event: string, callback: (payload: any) => void): Function;
    removeHandleEvent(callbackRef: Function): void;
    upload(name: string, files: any): void;
    uploadTo(phxTarget: any, name: string, files: any): void;
};
