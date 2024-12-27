<script lang="ts">
  type NavigationObject =
    | {href: string; patch?: never; navigate?: never}
    | {href?: never; patch: string; navigate?: never}
    | {href?: never; patch?: never; navigate: string}

  type Props = NavigationObject & Record<string, any>

  const {href, patch, navigate, children, ...restProps}: Props = $props()
</script>

{#if href}
  <a {...restProps} {href}>
    {#if children}
      {@render children()}
    {/if}
  </a>
{:else if navigate}
  <a {...restProps} href={navigate} data-phx-link="redirect" data-phx-link-state="push">
    {#if children}
      {@render children()}
    {/if}
  </a>
{:else if patch}
  <a {...restProps} href={patch} data-phx-link="patch" data-phx-link-state="push">
    {#if children}
      {@render children()}
    {/if}
  </a>
{/if}
