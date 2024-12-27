import {normalizeComponents} from "./utils"
import {mount, hydrate, unmount, createRawSnippet} from "svelte"

interface Ref {
  el: HTMLElement
  _instance: any
}

function getAttributeJson(ref: Ref, attributeName: string): Record<string, any> {
  const data = ref.el.getAttribute(attributeName)
  return data ? JSON.parse(data) : {}
}

function getSlots(ref: Ref): Record<string, any> {
  let snippets: Record<string, any> = {}

  for (const slotName in getAttributeJson(ref, "data-slots")) {
    const base64 = getAttributeJson(ref, "data-slots")[slotName]
    const element = document.createElement("div")
    element.innerHTML = atob(base64).trim()

    const snippet = createRawSnippet(() => {
      return {
        render: () => element.outerHTML,
      }
    })

    if (slotName === "default") snippets["children"] = snippet
    else snippets[slotName] = snippet
  }

  return snippets
}

function getLiveJsonProps(ref: Ref): Record<string, any> {
  const json = getAttributeJson(ref, "data-live-json")

  if (!Array.isArray(json)) return json

  const liveJsonData: Record<string, any> = {}
  for (const liveJsonVariable of json) {
    const data = (window as any)[liveJsonVariable]
    if (data) liveJsonData[liveJsonVariable] = data
  }
  return liveJsonData
}

function getProps(ref: Ref): Record<string, any> {
  return {
    ...getAttributeJson(ref, "data-props"),
    ...getLiveJsonProps(ref),
    ...getSlots(ref),
    live: ref,
  }
}

function findSlotCtx(component: any): any {
  return component.$$.ctx.find((ctxElement: any) => ctxElement?.default)
}

function update_state(ref: Ref): void {
  const newProps = getProps(ref)
  for (const key in newProps) {
    ref._instance.state[key] = newProps[key]
  }
}

export function getHooks(components: object): object {
  components = normalizeComponents(components)

  const SvelteHook = {
    mounted(this: Ref) {
      let state = $state(getProps(this))
      const componentName = this.el.getAttribute("data-name")
      if (!componentName) throw new Error("Component name must be provided")

      const Component = (components as any)[componentName]
      if (!Component) throw new Error(`Unable to find ${componentName} component.`)

      for (const liveJsonElement of Object.keys(getAttributeJson(this, "data-live-json"))) {
        window.addEventListener(`${liveJsonElement}_initialized`, (_event) => update_state(this), false)
        window.addEventListener(`${liveJsonElement}_patched`, (_event) => update_state(this), false)
      }

      const hydrateOrMount = this.el.hasAttribute("data-ssr") ? hydrate : mount

      // @ts-ignore
      this._instance = hydrateOrMount(Component, {
        target: this.el,
        props: state,
      })
      this._instance.state = state
    },

    updated(this: Ref) {
      update_state(this)
    },

    destroyed(this: Ref) {
      if (this._instance) window.addEventListener("phx:page-loading-stop", () => unmount(this._instance), {once: true})
    },
  }

  return {
    SvelteHook,
  }
}
