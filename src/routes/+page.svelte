<script lang="ts">
  import saveAs from "file-saver";
  import { onMount } from "svelte";
  import { Highlight } from "svelte-highlight";
  import { json } from "svelte-highlight/languages";
  import { vs2015 } from "svelte-highlight/styles";
  import { fade, fly } from "svelte/transition";
  import MingcuteCloseFill from "~icons/mingcute/close-fill";
  import ImportModal from "../lib/components/import-modal.svelte";
  import UsernameField from "../lib/components/username-field.svelte";
  import { data, fetchUUID, users, type Profile } from "../lib/profiles.svelte";
  import MingcuteCheckCircleFill from "~icons/mingcute/check-circle-fill";
  import { commandKey } from "$lib/meta";

  let importModal: ImportModal | null = $state(null);

  let errors: string[] = $state([]);

  let showCopyOverlay: boolean = $state(false);
  let copyOverlayTimeout: number = $state(-1);

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

    // Trigger animation
    showCopyOverlay = true;
    clearTimeout(copyOverlayTimeout);
    copyOverlayTimeout = setTimeout(() => {
      showCopyOverlay = false;
    }, 1000);
  }

  function download() {
    const blob = new Blob([data.json], { type: "application/json" });
    saveAs(blob, "whitelist.json");
  }
</script>

<svelte:head>
  {@html vs2015}
</svelte:head>

<svelte:document
  onkeydown={(e) => {
    if (commandKey(e) && e.key === "c") {
      e.preventDefault();
      copy();
    }
  }}
/>

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
          class="btn btn-ghost btn-square hover:btn-error"
          onclick={() => {
            const index = users.current.findIndex((item) => item === user);
            users.current.splice(index, 1);
          }}
        >
          <MingcuteCloseFill />
        </button>
      </li>
    {/each}
  {:else}
    <p class="text-base-content/50 text-center">Add a Minecraft username</p>
  {/if}
</ul>
<div class="flex w-full flex-col gap-2">
  <div class="rounded-field relative w-full overflow-auto text-sm">
    <Highlight language={json} code={data.json} />
    {#if showCopyOverlay}
      <div
        in:fade
        out:fade
        class="pointer-events-none absolute inset-0 bg-success/5 backdrop-blur-xs"
      ></div>
      <div
        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2"
      >
        <span in:fly={{ y: 10 }} out:fly={{ y: 10, delay: 50 }} class="text-success text-4xl">
          <MingcuteCheckCircleFill />
        </span>
        <span in:fly={{ y: 10, delay: 50 }} out:fly={{ y: 10 }}>
          <p class="text-xl font-medium">Copied</p>
        </span>
      </div>
    {/if}
  </div>
  <div class="flex flex-wrap items-center justify-between gap-2">
    <div>
      <button class="btn" onclick={fetchAll}>Refresh</button>
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
