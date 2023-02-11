<script>
    import { onMount } from "svelte";
    import { commandsMap } from "./commandHandler.js";

    let input, line;
    let hovering = false;
    let size = 1;
    let cmdStackPointer = 1;
    export let execCallback;
    export let blinker = false;
    export let data;
    export let commandsCache = [];

    const commands = Object.keys(commandsMap);
    //eslint-disable-next-line no-useless-escape
    const commandRegex = new RegExp(`^(${commands.join('|')})\s*(.*)$`, "i");

    onMount(() => {
        setTimeout(() => {
            input.focus();
        }, 200);
        line.addEventListener("click", () => {
            input.focus();
        });
        input.addEventListener("keyup", (e) => {
            if (e.key !== "ArrowUp") {
                cmdStackPointer = 1;
            }
            if (e.key === "Enter" && execCallback) {
                execCallback(input.value);
            }
            if (e.key === "ArrowUp") {
                let prevCmd = commandsCache[commandsCache.length - cmdStackPointer]?.command;
                if (prevCmd) {
                    cmdStackPointer++;
                    size = prevCmd.length || 1;
                    input.value = prevCmd;
                    input.focus();
                }
            }
            if (e.key === "ArrowDown") {
                input.value = "";
                size = 1;
                input.focus();
            }
            if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
                input.selectionStart = input.selectionEnd = input.value.length;
                e.preventDefault();
            }
        });
        input.addEventListener("input", () => {
            size = input.value.length || 1;
            let matches = commandRegex.exec(input.value);
            if (matches) {
                input.nextElementSibling.innerHTML = matches[1];
            }
            else {
                input.nextElementSibling.innerHTML = "";
            }
            if (input.value.toLowerCase() === "start") {
                hovering = true;
                window.dispatchEvent(
                    new CustomEvent("hoverStartBtn", {
                        detail: {
                            activated: true,
                        },
                    })
                );
            } else if (hovering) {
                hovering = false;
                window.dispatchEvent(
                    new CustomEvent("hoverStartBtn", {
                        detail: {
                            activated: false,
                        },
                    })
                );
            }
        });
    });
</script>

<div class="container">
    <div class="path">(<span>{data.user.replace('@', '㉿')}</span>)-[<span>{data.cwd}</span>]</div>
    <div class="line" bind:this={line}>
        <div class="inputContainer">
            <span class="dollar">$&nbsp;</span>
            <div class="inputWrapper">
                <input
                    class="input"
                    type="text"
                    bind:this={input}
                    style={`width: ${size}ch;`}
                />
                <span class="code" />
            </div>
        </div>
        <div class="blinkerContainer"><i class:blinker /></div>
    </div>
</div>

<style>
    .container {
        --green: rgb(11, 117, 93);
        --blue: #0087ff;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .path {
        position: relative;
        font-size: 1.5vw;
        font-family: monospace;
        margin-right: auto;
        margin-left: 4em;
        color: var(--green);
    }

    .path span:first-child {
        color: var(--blue);
    }

    .path span:last-child {
        color: white;
    }

    .path::after {
        content: "";
        display: block;
        position: absolute;
        width: 3em;
        margin-left: -3em;
        margin-top: -0.5em;
        height: 150%;
        border: 2px solid var(--green);
        border-right: none;
    }

    .line {
        display: flex;
        position: relative;
        width: 100%;
        align-items: center;
        cursor: text;
    }

    .inputContainer {
        margin-left: 4vw;
        background: var(--theme-bg);
    }

    .dollar {
        font-size: 2vw;
        font-family: monospace;
    }

    .inputWrapper {
        display: inline;
        position: relative;
        font-size: 2vw;
        font-family: monospace;
    }

    .input {
        box-sizing: content-box;
        position: relative;
        background: transparent;
        caret-color: transparent;
        color: #ccc;
        border: none;
        padding-left: 0;
        padding-right: 0;
        margin-bottom: 0;
    }

    .input:active,
    .input:focus {
        outline: none;
    }

    .code {
        position: absolute;
        top: 0;
        left: 0;
        color: var(--green);
    }

    .blinkerContainer {
        background: var(--theme-bg);
    }

    .blinker {
        display: block;
        position: relative;
        width: 1vw;
        height: 2vw;
        background-color: gray;
        animation-name: blink;
        animation-duration: 800ms;
        animation-iteration-count: infinite;
        opacity: 1;
    }

    @keyframes blink {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
</style>
