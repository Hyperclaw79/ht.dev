<script>
    import Screen from "./Screen.svelte";
    import TitleBar from "./TitleBar.svelte";

    export let data = {
        user: "root@HT.Dev",
        cwd: "~/Desktop",
    };
</script>

<div class="terminal">
    <TitleBar {data} />
    <Screen bind:data={data} />
</div>

<style>
    .terminal {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 80vw;
        margin: auto;
    }
</style>
