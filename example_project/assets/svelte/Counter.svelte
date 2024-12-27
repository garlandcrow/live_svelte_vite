<script lang="ts">
import Link from "./components/Link.svelte"
    let {number, live} = $props()

    function increase() {
        live.pushEvent("set_number", {number: number + 2})
    }

    function decrease() {
        live.pushEvent("set_number", {number: number - 1})
    }

</script>
<Link navigate="/home">shit</Link>

<h1>Component is working</h1>
<p>The number is {number}</p>

<button class="bg-blue-500 p-4" onclick={increase}>+</button>
<button onclick={decrease}>-</button>
