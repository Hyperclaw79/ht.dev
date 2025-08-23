<script>
    import { onMount } from "svelte";
    import { tweened } from "svelte/motion";

    export let width = 100;
    export let value = 100;
    export let animate = true;

    // eslint-disable-next-line prefer-const
    let progress = tweened(0, { duration: 500, easing: (t) => t });

    onMount(() => {
        progress.set(Number(value) || 0);
    });

    $: {
        progress.set(Number(value) || 0);
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
        background: 
            /* Create segmented squares pattern */
            repeating-linear-gradient(
                90deg,
                #51db3e 0px, #51db3e 4.8%,     /* Green segment */
                transparent 4.8%, transparent 5%,  /* Gap */
                #51db3e 5%, #51db3e 9.8%,      /* Green segment */
                transparent 9.8%, transparent 10%, /* Gap */
                #51db3e 10%, #51db3e 14.8%,    /* Green segment */
                transparent 14.8%, transparent 15%, /* Gap */
                #51db3e 15%, #51db3e 19.8%,    /* Green segment */
                transparent 19.8%, transparent 20%, /* Gap */
                #51db3e 20%, #51db3e 24.8%,    /* Green segment */
                transparent 24.8%, transparent 25%, /* Gap */
                #51db3e 25%, #51db3e 29.8%,    /* Green segment */
                transparent 29.8%, transparent 30%, /* Gap */
                #51db3e 30%, #51db3e 34.8%,    /* Green segment */
                transparent 34.8%, transparent 35%, /* Gap */
                #51db3e 35%, #51db3e 39.8%,    /* Green segment */
                transparent 39.8%, transparent 40%, /* Gap */
                #51db3e 40%, #51db3e 44.8%,    /* Green segment */
                transparent 44.8%, transparent 45%, /* Gap */
                #51db3e 45%, #51db3e 49.8%,    /* Green segment */
                transparent 49.8%, transparent 50%, /* Gap */
                #51db3e 50%, #51db3e 54.8%,    /* Green segment */
                transparent 54.8%, transparent 55%, /* Gap */
                #51db3e 55%, #51db3e 59.8%,    /* Green segment */
                transparent 59.8%, transparent 60%, /* Gap */
                #51db3e 60%, #51db3e 64.8%,    /* Green segment */
                transparent 64.8%, transparent 65%, /* Gap */
                #51db3e 65%, #51db3e 69.8%,    /* Green segment */
                transparent 69.8%, transparent 70%, /* Gap */
                #51db3e 70%, #51db3e 74.8%,    /* Green segment */
                transparent 74.8%, transparent 75%, /* Gap */
                #ffd700 75%, #ffd700 79.8%,    /* Yellow for medium */
                transparent 79.8%, transparent 80%, /* Gap */
                #ffd700 80%, #ffd700 84.8%,    /* Yellow for medium */
                transparent 84.8%, transparent 85%, /* Gap */
                #ffd700 85%, #ffd700 89.8%,    /* Yellow for medium */
                transparent 89.8%, transparent 90%, /* Gap */
                #51db3e 90%, #51db3e 94.8%,    /* Green for high */
                transparent 94.8%, transparent 95%, /* Gap */
                #51db3e 95%, #51db3e 99.8%,    /* Green for high */
                transparent 99.8%, transparent 100% /* Gap */
            );
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
