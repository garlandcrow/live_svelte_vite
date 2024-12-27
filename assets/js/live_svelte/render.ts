import {normalizeComponents} from "./utils"
import {render} from "svelte/server"
import {createRawSnippet} from "svelte"

export function getRender(components: object) {
  components = normalizeComponents(components)
  return function r(name: string, props: object, slots: object): any {
    const snippets = Object.fromEntries(
      Object.entries(slots).map(([slotName, v]) => {
        const snippet = createRawSnippet((_name) => {
          return {
            render: () => v,
          }
        })
        if (slotName === "default") return ["children", snippet]
        else return [slotName, snippet]
      })
    )

    // @ts-ignore
    return render(components[name] as any, {props: {...props, ...snippets}})
  }
}
