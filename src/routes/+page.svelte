<script lang="ts">
  import saveAs from "file-saver";
  import { onMount } from "svelte";

  let usernames: string = $state("");
  let whitelist: string = $state("");

  let inputTimeout: number;

  onMount(() => {
    const stored = localStorage.getItem("usernames");
    if (stored) {
      usernames = stored;
      fetchUsernames();
    }
  });

  function oninput() {
    clearTimeout(inputTimeout);
    inputTimeout = setTimeout(fetchUsernames, 1000);
  }

  async function fetchUsernames() {
    const promises = usernames
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length >= 3 && item.length <= 16)
      .map((item) => {
        return fetch("/api?username=" + encodeURIComponent(item)).then((response) =>
          response.json(),
        );
      });
    const result = (await Promise.allSettled(promises))
      .map((item) => {
        const o = item as { value: any };
        return o.value;
      })
      .filter((item) => !item.message);

    if (result.length === 1) {
      whitelist = JSON.stringify(result[0], null, 2);
    } else if (result.length > 1) {
      whitelist = JSON.stringify(result, null, 2);
    }

    localStorage.setItem("usernames", usernames);
  }

  function copy() {
    navigator.clipboard.writeText(whitelist);
  }

  function download() {
    const blob = new Blob([whitelist], { type: "application/json" });
    saveAs(blob, "whitelist.json");
  }
</script>

<h1 class="font-mono text-2xl font-bold tracking-tight">whitelist.json</h1>
<input
  bind:value={usernames}
  {oninput}
  type="text"
  class="input w-full"
  placeholder="Comma-separated list of MC usernames"
/>
<textarea
  bind:value={whitelist}
  class="textarea w-full overflow-auto break-normal whitespace-pre"
  rows="8"
  readonly
  placeholder="whitelist.json"
></textarea>
<div class="flex flex-wrap gap-2">
  <button class="btn" onclick={copy}>Copy</button>
  <button class="btn btn-primary" onclick={download}>Download</button>
</div>
<div class="text-base-content/50 flex flex-wrap gap-2 text-sm">
  <a
    class="link"
    target="_blank"
    rel="noopener noreferrer"
    href="https://github.com/khui0/whitelist-json">GitHub</a
  >
  <p>{import.meta.env.PACKAGE_VERSION}</p>
</div>
