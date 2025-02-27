<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<main class="flex flex-col items-center gap-4 p-4">
  {@render children()}
</main>
