<script>
    import { onMount } from "svelte";

    export let startProgress = 0;
    export let endProgress = 90;
    export let timeout = 1000;
    export let callback;

    let currProgress = startProgress;

    onMount(() => {
        setTimeout(() => { currProgress = endProgress; }, 100);
        if (callback) {
            setTimeout(callback, timeout - 100);
        }
    });
</script>

<div class="progress">
    <div class="progress-bar" style={`
        width: ${currProgress}%;
        transition: width ${timeout}ms ease;
    `}/>
</div>

<style>
    .progress {
        position: relative;
        display: inline-block;
        width: 90%;
        height: 20px;
    }

    .progress-bar {
        --green: rgb(11, 117, 93);
        --grey: #6e6e6e78;
        position: relative;
        height: 100%;
        background-image: linear-gradient(90deg, var(--green) 40%, var(--grey) 40%, var(--grey) 50%, var(--green) 50%, var(--green) 90%, var(--grey) 90%, var(--grey) 100%);
        background-size: 50.00px 50.00px;
        animation: gradient 10s ease infinite;
    }

    @keyframes gradient {
        0% {
            background-position: 0% 100%;
        }
        100% {
            background-position: 100% 0%;
        }
    }
</style>
