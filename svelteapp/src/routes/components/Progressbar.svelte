<script>
    import { onMount } from "svelte";
    import { tweened } from "svelte/motion";

    export let width = 100;
    export let value = 100;
    export let animate = true;

    // eslint-disable-next-line prefer-const
    let progress = tweened(0, { duration: 500, easing: (t) => t });

    onMount(() => {
        progress.set(value);
    });

    $: {
        progress.set(value);
    }
</script>

<div class="progress-bar" style="width: {width}%;">
    <div
        class="progress-bar__fill"
        class:animate={animate}
        style="max-width: {$progress - 2}%;"
    />
</div>

<style>
    .progress-bar {
        height: 20px;
        position: relative;
        background: rgba(0, 0, 0, 0.17);
        border-radius: 16px;
        border: 1px solid rgba(168, 168, 168, 0.97);
        overflow: clip;
        filter: drop-shadow(2px 4px 6px black);
    }

    .progress-bar::before {
        position: absolute;
        width: 100%;
        height: 18px;
        left: 0;
        bottom: 0;
        content: "";
        border: 6px solid rgb(168 168 168 / 70%);
        border-radius: 16px;
        filter: blur(4px);
    }

    .progress-bar__fill {
        width: 100%;
        height: 12px;
        background: linear-gradient(90deg, var(--theme-primary), #51db3e);
        border-radius: 16px;
        position: absolute;
        top: 0;
        left: 0;
        padding-top: 0;
        margin-top: 4px;
        margin-left: 4px;
        transition: width 0.5s ease;
    }

    .animate {
        animation: scaler 5s ease-in-out 0s infinite;
    }

    @keyframes scaler {
        10% {
            width: 0%;
        }
        20%, 100% {
            width: 100%;
        }
    }
</style>
