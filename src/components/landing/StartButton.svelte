<script>
    import { onMount } from "svelte";


    export let binder;
    let activated = false;
    onMount(() => {
        window.addEventListener('hoverStartBtn', (e) => {
            activated = e.detail.activated;
        });
    });
</script>

<button
    class="startBtn"
    class:activated
    bind:this={binder}
>
    Start
</button>

<style>
    :root {
        --filler: var(--theme-bg-dark);
        --hover: var(--theme-primary);
    }

    .startBtn {
        position: absolute;
        top: 70vh;
        right: 14vw;
        background: transparent;
        color: #ccc;
        width: 12vw;
        height: 12vw;
        font-size: 2vw;
        padding: 2vw;
        border: none;
        border-radius: 100%;
        transition:
            transform 0.5s ease,
            text-shadow 0.5s ease;
        cursor: pointer;
        z-index: 2;
    }

    .startBtn::after {
        box-sizing: border-box;
        content: '';
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 12vw;
        height: 12vw;
        border-radius: 100%;
        border: 0.5vw dotted var(--hover);
        animation: rotate 5s linear infinite;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .startBtn:hover,
    .startBtn:focus,
    .startBtn.activated {
        animation: activate 1s;
        box-shadow:
            0 0 0 2vw transparent,
            inset 0 0 0 12vw var(--filler);
        transform: translateY(-0.25em);
        filter: drop-shadow(0 0 0.5em var(--hover));
        text-shadow: #FC0 1px 0 10px;
    }

    @keyframes activate {
        0% {
            box-shadow:
                0 0 0 0 var(--hover),
                inset 0 0 0 0 var(--filler);
        }
    }
</style>