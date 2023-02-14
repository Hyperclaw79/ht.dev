<script>
    import { commandsMap } from "./commandHandler.js";

    export let output, error;

    const commands = Object.keys(commandsMap);
    const commandRegex = new RegExp(`^(${commands.join("|")})$`);
    
    const beep = () => {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(420, audioContext.currentTime);
        const biquadFilter = audioContext.createBiquadFilter();
        biquadFilter.type = "lowpass";
        biquadFilter.frequency.setValueAtTime(200, audioContext.currentTime + 1);
        oscillator.connect(biquadFilter);
        biquadFilter.connect(audioContext.destination);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    };

    $: if (error) { beep(); }
</script>

<div class="outputContainer">
    {#if Array.isArray(output)}
        {#each output as line}
            <span class="output" class:command={commandRegex.exec(line)}>{line}</span>
        {/each}
    {:else}
        <span class="output" class:error>
            {output}
        </span>
    {/if}
</div>

<style>
    .outputContainer {
        display: flex;
        align-items: center;
        padding: 0.25rem 1.25rem;
        gap: 1rem;
    }

    .output {
        font-family: monospace;
        font-size: 1.5vw;
        white-space: pre-wrap;
        text-align: left;
    }
    
    .command {
        color: rgb(11, 117, 93);
    }

    .error {
        color: rgb(169, 16, 16);
    }
</style>
