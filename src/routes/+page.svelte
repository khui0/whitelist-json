<script lang="ts">
  import saveAs from "file-saver";
  import { onMount } from "svelte";
  import { Highlight } from "svelte-highlight";
  import { json } from "svelte-highlight/languages";
  import { vs2015 } from "svelte-highlight/styles";
  import { fly } from "svelte/transition";
  import UsernameField from "../lib/components/username-field.svelte";
  import { data, fetchUUID, users, type Profile } from "../lib/profiles.svelte";
  import ImportModal from "../lib/components/import-modal.svelte";

  let importModal: ImportModal | null = $state(null);

  let errors: string[] = $state([]);

  onMount(() => {
    const stored = JSON.parse(localStorage.getItem("whitelist") || "[]") as Profile[];
    if (localStorage.getItem("whitelist") !== null) {
      setState(stored);
      users.current = stored.map((item) => item.name);
    }
  });

  async function fetchAll() {
    const res = await fetchUUID(users.current);
    setState(res);
    localStorage.setItem("whitelist", JSON.stringify(res));
  }

  function setState(json: Profile[]) {
    data.json = JSON.stringify(
      json.filter((item) => !item.error),
      null,
      4,
    );
    errors = json.filter((items) => items.error).map((item) => item.name);
  }

  function copy() {
    navigator.clipboard.writeText(data.json);
  }

  function download() {
    const blob = new Blob([data.json], { type: "application/json" });
    saveAs(blob, "whitelist.json");
  }
</script>

<svelte:head>
  {@html vs2015}
</svelte:head>

<header class="grid w-full grid-cols-1 gap-2 sm:grid-cols-[auto_1fr]">
  <h1 class="text-center text-xl font-bold">whitelist.json</h1>
  <div class="flex w-full items-center gap-2">
    <UsernameField
      onsubmit={(value) => {
        if (users.current.some((item) => item.toLowerCase() === value.toLowerCase())) return;
        users.current.push(value);
        fetchAll();
      }}
    />
    <button class="btn" onclick={importModal?.open}>Import</button>
  </div>
</header>
<ul class="flex w-full flex-col gap-2">
  {#if users.current.length > 0}
    {#each users.current as user (user)}
      <li
        in:fly={{ y: -5, duration: 250 }}
        out:fly={{ y: -5, duration: 250 }}
        class="flex items-center gap-2"
      >
        <p>{user}</p>
        <div class="flex flex-1 flex-wrap items-center">
          {#if errors.includes(user)}
            <p in:fly={{ x: -5 }} class="badge badge-error font-medium uppercase">Error</p>
          {/if}
        </div>
        <button
          class="btn hover:btn-error"
          onclick={() => {
            const index = users.current.findIndex((item) => item === user);
            users.current.splice(index, 1);
            fetchAll();
          }}
        >
          Delete
        </button>
      </li>
    {/each}
  {:else}
    <p class="text-base-content/50 text-center">Add a Minecraft username</p>
  {/if}
</ul>
<div class="flex w-full flex-col gap-2">
  <div class="rounded-field w-full overflow-auto text-sm">
    <Highlight language={json} code={data.json} />
  </div>
  <div class="flex flex-wrap items-center justify-between gap-2">
    <div>
      <button class="btn" onclick={fetchAll}>Fetch all</button>
    </div>
    <div class="flex gap-2">
      <button class="btn" onclick={copy}>Copy</button>
      <button class="btn" onclick={download}>Download</button>
    </div>
  </div>
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
<ImportModal
  bind:this={importModal}
  onsubmit={(value) => {
    users.current = value.map((item) => item.name);
  }}
/>
