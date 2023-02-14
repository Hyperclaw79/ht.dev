let counter = 0;

const commandsMap = {
    start: {
        description: "Starts the application.",
        action: (inputs) => {
            counter++;
            inputs.push({ output: "Starting...", uuid: Date.now() + counter });
            counter++;
            inputs.push({ progress: true, uuid: Date.now() + counter });
            counter++;
            inputs.push({
                action: () => {
                    const startBtn = document.querySelector(`button[class~="startBtn"]`);
                    startBtn.click();
                },
                uuid: Date.now() + counter,
                timeout: 2000
            });
        }
    },
    clear: {
        description: "Clears the inputs.",
        action: (inputs) => {
            inputs.length = 0;
        }
    },
    ls: {
        description: "Lists the available sections.",
        action: (inputs) => {
            const sections = [".", "..", ...[...document.querySelectorAll("main > section")].map((elem) => elem.id)];
            counter++;
            inputs.push({ output: sections, uuid: Date.now() + counter });
        }
    },
    help: {
        description: "Displays a list of available commands.\nIf a command is specified, it displays the description of the command.",
        action: (inputs, cmd) => {
            if (cmd.split(" ").length > 1) {
                const cmdWord = cmd.split(" ")[1];
                if (!Object.keys(commandsMap).includes(cmdWord)) {
                    counter++;
                    inputs.push({ output: `Command not found: ${cmdWord}`, uuid: Date.now() + counter, error: true });
                    return;
                }
                for (const line of commandsMap[cmdWord].description.split("\n")) {
                    counter++;
                    inputs.push({ output: line, uuid: Date.now() + counter });
                }
                return;
            }
            counter++;
            inputs.push({ output: "You can check out these commands:", uuid: Date.now() + counter });
            counter++;
            inputs.push({ output: Object.keys(commandsMap), uuid: Date.now() + counter });
            counter++;
            inputs.push({
                output: "Type 'help <command>' to get more information about a command.",
                uuid: Date.now() + counter
            });
        }
    },
    cd: {
        description: "Changes the current working directory.",
        action: (inputs, cmd, data) => {
            if (cmd.split(" ").length === 1) {
                counter++;
                inputs.push({ output: "Please specify a directory.", uuid: Date.now() + counter, error: true });
                return;
            }
            data.cwd = cmd.split(" ")[1];
        }
    },
    su: {
        description: "Changes the current user.",
        action: (inputs, cmd, data) => {
            if (cmd.split(" ").length === 1) {
                counter++;
                inputs.push({ output: "Please specify a user.", uuid: Date.now() + counter, error: true });
                return;
            }
            data.user = `${cmd.split(" ")[1]}@HT.Dev`;
        }
    },
    pwd: {
        description: "Prints the current working directory.",
        action: (inputs, cmd, data) => {
            counter++;
            inputs.push({ output: data.cwd, uuid: Date.now() + counter });
        }
    },
    echo: {
        description: "Echoes the given string.",
        action: (inputs, cmd) => {
            counter++;
            inputs.push({ output: cmd.split(" ").slice(1).join(" "), uuid: Date.now() + counter });
        }
    }
};

const execute = (inputs, cmd, data, commandsCache) => {
    commandsCache.push({ command: cmd });
    inputs.forEach(element => {
        element.isLastInput = false;
    });
    const cmdWord = cmd.toLowerCase().split(" ")[0];
    if (!Object.keys(commandsMap).includes(cmdWord)) {
        if (cmd) {
            counter++;
            inputs.push({ output: `Command not found: ${cmd}`, uuid: Date.now() + counter, error: true });
        }
    } else {
        commandsMap[cmdWord].action(inputs, cmd, data);
    }
    counter++;
    inputs.push({ command: "", uuid: Date.now() + counter, isLastInput: true });
    return inputs;
};

export { execute, commandsMap };
