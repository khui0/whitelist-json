<script lang="ts">
  import z, { uuidv4, ZodError } from "zod";
  import type { Profile } from "../profiles.svelte";

  let value: string = $state("");
  let error: ZodError | null = $state(null);

  const schema = z.array(
    z.object({
      uuid: uuidv4(),
      name: z.string().regex(/^[A-Za-z0-9_]{3,16}$/),
    }),
  );

  let modal: HTMLDialogElement | null = $state(null);

  let {
    onsubmit,
  }: {
    onsubmit?: (value: Profile[]) => void;
  } = $props();

  export const open = () => {
    modal?.showModal();
  };

  export const close = () => {
    modal?.close();
  };
</script>

<dialog class="modal" bind:this={modal}>
  <div class="modal-box">
    <h3 class="text-lg font-bold">Import</h3>
    <p class="text-base-content/70 my-1">Paste an existing whitelist.json below</p>
    <textarea class="textarea my-2 w-full resize-none" bind:value></textarea>
    <p class="text-base-content/70 my-1">
      Your changes will not be saved until you click 'Fetch all'
    </p>
    {#if error !== null}
      <ul class="text-error text-sm font-medium">
        {#each error.issues as issue}
          <li>{issue.message}</li>
        {/each}
      </ul>
    {/if}
    <div class="modal-action">
      <form method="dialog">
        <button class="btn">Cancel</button>
        <button
          class="btn"
          onclick={(e) => {
            e.preventDefault();
            const result = schema.safeParse(JSON.parse(value));
            if (result.error) {
              error = result.error;
            } else {
              error = null;
              onsubmit?.(result.data);
              close();
            }
          }}
        >
          Import
        </button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
