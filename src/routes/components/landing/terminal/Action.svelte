<script>
    import { onMount } from "svelte";
    import AsciiProgress from "./AsciiProgress.svelte";

    export let action;
    export let timeout = 0;
    export let noProgress = false;

    onMount(() => {
        if (timeout === 0) {
            action();
        } else if (noProgress) {
            setTimeout(action, timeout);
        }
    });
</script>

{#if timeout > 0 && !noProgress}
    <AsciiProgress {timeout} callback={action} />
{/if}
