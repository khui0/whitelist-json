<script lang="ts">
  import saveAs from "file-saver";
  import { onMount } from "svelte";
  import { Highlight } from "svelte-highlight";
  import { json } from "svelte-highlight/languages";
  import { vs2015 } from "svelte-highlight/styles";
  import { fly } from "svelte/transition";
  import UsernameField from "../lib/components/username-field.svelte";
  import { data, fetchUUID, users, type Profile } from "../lib/profiles.svelte";

  onMount(() => {
    const stored = JSON.parse(localStorage.getItem("whitelist") || "[]") as Profile[];
    if (localStorage.getItem("whitelist") !== null) {
      data.json = JSON.stringify(stored, null, 4);
      users.current = stored.map((item) => item.name);
    }
  });

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
  <h1 class="text-center font-mono text-xl font-bold tracking-tight">whitelist.json</h1>
  <div class="flex w-full items-center gap-2">
    <UsernameField
      onsubmit={(value) => {
        if (users.current.some((item) => item.toLowerCase() === value.toLowerCase())) return;
        users.current.push(value);
      }}
    />
    <button class="btn">Import</button>
  </div>
</header>
<ul class="flex w-full flex-col gap-2">
  {#if users.current.length > 0}
    {#each users.current as user (user)}
      <li
        in:fly={{ y: -5, duration: 250 }}
        out:fly={{ y: -5, duration: 250 }}
        class="flex items-center"
      >
        <p class="flex-1">{user}</p>
        <button
          class="btn hover:btn-error"
          onclick={() => {
            const index = users.current.findIndex((item) => item === user);
            users.current.splice(index, 1);
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
      <button
        class="btn"
        onclick={async () => {
          const res = await fetchUUID(users.current);
          console.log(res);
        }}
      >
        Fetch all
      </button>
    </div>
    <div class="flex gap-2">
      <button class="btn" onclick={copy}>Copy</button>
      <button class="btn" onclick={download}>Download</button>
    </div>
  </div>
</div>
