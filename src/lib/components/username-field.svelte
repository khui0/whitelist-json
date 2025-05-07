<script lang="ts">
  let {
    value = $bindable(""),
    onsubmit,
  }: {
    value?: string;
    onsubmit?: (value: string) => void;
  } = $props();

  let valid: boolean = $derived(/^[A-Za-z0-9_]{3,16}$/.test(value));
</script>

<form
  class="flex w-full gap-2"
  onsubmit={(e) => {
    e.preventDefault();
    onsubmit?.(value);
    value = "";
  }}
>
  <div class="input relative flex-1 pr-11">
    <input
      bind:value
      type="text"
      placeholder="Username"
      maxlength="16"
      oninput={() => {
        value = value.trim().replace(/[^A-Za-z0-9_]/, "");
      }}
    />
    <span
      class="text-base-content/50 pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 px-2 text-xs font-medium"
    >
      {value.length}/16
    </span>
  </div>
  <button class="btn" disabled={!valid}>Add</button>
</form>
