<script lang="ts">
  import saveAs from "file-saver";

  let usernames: string = $state("");
  let whitelist: string = $state("");

  let inputTimeout: number;

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
    const result = (await Promise.allSettled(promises)).map((item) => {
      const o = item as { value: any };
      return o.value;
    });

    if (result.length === 1) {
      whitelist = JSON.stringify(result[0], null, 2);
    } else if (result.length > 1) {
      whitelist = JSON.stringify(result, null, 2);
    }
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
  class="input"
  placeholder="Comma-separated list of MC usernames"
/>
<textarea
  bind:value={whitelist}
  class="textarea overflow-auto break-normal whitespace-pre"
  rows="8"
  readonly
  placeholder="whitelist.json"
></textarea>
<div class="flex flex-wrap gap-2">
  <button class="btn" onclick={copy}>Copy</button>
  <button class="btn btn-primary" onclick={download}>Download</button>
</div>
<a
  class="link text-sm"
  target="_blank"
  rel="noopener noreferrer"
  href="https://github.com/khui0/whitelist-json">GitHub</a
>
