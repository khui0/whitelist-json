<script lang="ts">
  import "../app.css";
  let { children } = $props();

  import { injectAnalytics } from "@vercel/analytics/sveltekit";
  injectAnalytics();
</script>

<svelte:head>
  <title>whitelist.json</title>
</svelte:head>

<main class="mx-auto flex max-w-110 flex-col items-center gap-4 p-4">
  {@render children()}
</main>
