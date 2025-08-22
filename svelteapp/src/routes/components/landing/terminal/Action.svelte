<script>
    import { onMount } from "svelte";
    import AsciiProgress from "./AsciiProgress.svelte";

    export let action;
    export let timeout = 0;
    export let noProgress = false;

    onMount(() => {
        if (timeout === 0) {
            if (typeof action === "function") {
                try {
                    action();
                } catch (e) {
                    // Silently handle action errors
                }
            }
        } else if (noProgress) {
            if (typeof action === "function") {
                setTimeout(() => {
                    try {
                        action();
                    } catch (e) {
                        // Silently handle action errors
                    }
                }, timeout);
            }
        }
    });
</script>

{#if timeout > 0 && !noProgress}
    <AsciiProgress {timeout} callback={typeof action === "function"
        ? () => {
            try {
                action();
            } catch (e) {
                // Silently handle action errors
            }
        }
        : () => {}} />
{/if}
