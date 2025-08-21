<script>
    import { onMount } from "svelte";
    import AsciiProgress from "./AsciiProgress.svelte";

    export let action;
    export let timeout = 0;
    export let noProgress = false;

    const safeExecuteAction = () => {
        try {
            if (typeof action === 'function') {
                action();
            }
        } catch (error) {
            console.error('Action execution error:', error);
        }
    };

    onMount(() => {
        if (timeout === 0) {
            safeExecuteAction();
        } else if (noProgress) {
            setTimeout(safeExecuteAction, timeout);
        }
    });
</script>

{#if timeout > 0 && !noProgress}
    <AsciiProgress {timeout} callback={safeExecuteAction} />
{/if}
