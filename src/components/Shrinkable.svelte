<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    let containerRef;
    let shrunk = false;
    export let handle;

    $: if (handle) {
        handle.addEventListener('click', () => {
            shrunk = true;
            dispatch('shrunkEvent');
        });
    }
</script>

<div class="shrinkable" bind:this={containerRef} class:shrunk>
    <slot />
</div>

<style>
    .shrinkable {
        height: 100vh;
        overflow: hidden;
        transition: height 0.5s ease;
    }
    .shrunk {
        height: 0;
        opacity: 0;
        transform-origin: top;
    }
</style>
