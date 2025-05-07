<script lang="ts">
  import "../app.css";
  import "@fontsource-variable/rubik";

  let { children } = $props();

  import { injectAnalytics } from "@vercel/analytics/sveltekit";
  injectAnalytics();
</script>

<svelte:head>
  <title>whitelist.json</title>
</svelte:head>

<div class="mx-auto flex max-w-xl flex-col items-center gap-4 p-4">
  {@render children()}
</div>
