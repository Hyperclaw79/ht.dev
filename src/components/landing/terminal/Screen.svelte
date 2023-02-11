<script>
    import { onMount } from "svelte";
    import Input from "./Input.svelte";
    import { execute } from "./commandHandler.js";
    import Output from "./Output.svelte";
    import Action from "./Action.svelte";

    let screen;
    let inputs = [{
        command: '',
        uuid: Date.now() + Math.random(),
        isLastInput: true
    }];
    let commandsCache = [];
    export let data;

    const handleExec = (command) => {
        inputs = execute(inputs, command, data, commandsCache);
        data = {...data};
        inputs = [...inputs].sort((a, b) => a.uuid - b.uuid);
    };

    onMount(() => {
        screen && screen.addEventListener("click", () => {
            let nodes = screen.querySelectorAll('input[class~="input"]');
            nodes[nodes.length - 1].focus();
        });
    });

</script>

<div class="screen" bind:this={screen}>
    <div class="innerDiv">
        <div class="banner">
            <h1 class="title">HT's Portfolio</h1>
            <pre class="subtitle">
                Enter the command <code>Start</code> or click the button.
                Alternatively, you can use the <code>Help</code> command to play around.
            </pre>
        </div>
        <div>
            {#each inputs as input (input.uuid)}
                {#if input.command !== undefined}
                    <Input
                        execCallback={handleExec}
                        blinker={input.isLastInput}
                        data={data}
                        {commandsCache}
                    />
                {:else if input.output !== undefined}
                    <Output output={input.output} error={input.error} />
                {:else if input.action !== undefined}
                    <Action action={input.action} timeout={input.timeout || 0} />
                {/if}
            {/each}
        </div>
    </div>
</div>

<style>
    .screen {
        position: relative;
        width: 100%;
        height: 40vw;
        background: var(--theme-bg);
        filter: contrast(1.25);
        opacity: 0.75;
        border: 2px solid var(--theme-primary);
        border-top: none;
        z-index: 1;
        box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.5);
    }
    
    .innerDiv {
        --scrollbar-color: #d9d9d970;
        position: relative;
        width: 99%;
        height: 100%;
        padding-right: 0.5em;
        overflow-y: scroll;
        scrollbar-width: auto;
        scrollbar-color: var(--scrollbar-color) var(--theme-bg);
    }

    .innerDiv::-webkit-scrollbar {
        width: 8px;
    }

    .innerDiv::-webkit-scrollbar-track {
        background: var(--theme-bg);
    }

    .innerDiv::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-color);
        border-radius: 10px;
        border: 2px solid var(--theme-bg);
    }

    .banner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 5%;
    }

    .title {
        font-family: "Bitwise", monospace;
    }

    .subtitle {
        font-size: 1vw;
        text-align: left;
    }

    .subtitle code {
        font-family: "Bitwise", monospace;
        font-size: 1.25vw;
        color: rgb(11, 117, 93);
    }
</style>