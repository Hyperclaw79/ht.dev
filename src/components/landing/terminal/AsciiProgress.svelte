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
        transition: width ${timeout}ms;
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
        position: relative;
        height: 100%;
        background-color: rgb(11, 117, 93);
    }
</style>
