<script>
    import Shrinkable from "../Shrinkable.svelte";
    import IconCanvas from "./IconCanvas.svelte";
    import StartButton from "./StartButton.svelte";
    import Terminal from "./terminal/Terminal.svelte";

    let handle;
</script>

<Shrinkable on:shrunkEvent {handle} >
    <div class="landing">
        <IconCanvas />
        <Terminal />
        <StartButton bind:binder={handle} />
    </div>
</Shrinkable>

<style>
    .landing {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
</style>
