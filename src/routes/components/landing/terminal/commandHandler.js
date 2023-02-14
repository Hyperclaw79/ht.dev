let counter = 0;

const commandsMap = {
    start: (inputs) => {
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
    },
    clear: (inputs) => {
        inputs.length = 0;
    },
    ls: (inputs) => {
        const sections = [".", "..", ...[...document.querySelectorAll("main > section")].map((elem) => elem.id)];
        counter++;
        inputs.push({ output: sections, uuid: Date.now() + counter });
    },
    help: (inputs) => {
        counter++;
        inputs.push({ output: "You can check out these commands:", uuid: Date.now() + counter });
        counter++;
        inputs.push({ output: Object.keys(commandsMap), uuid: Date.now() + counter });
    },
    chdir: (inputs, cmd, data) => {
        if (cmd.split(" ").length === 1) {
            counter++;
            inputs.push({ output: "Please specify a directory.", uuid: Date.now() + counter, error: true });
        }
        data.cwd = cmd.split(" ")[1];
    },
    pwd: (inputs, cmd, data) => {
        counter++;
        inputs.push({ output: data.cwd, uuid: Date.now() + counter });
    },
    echo: (inputs, cmd) => {
        counter++;
        inputs.push({ output: cmd.split(" ").slice(1).join(" "), uuid: Date.now() + counter });
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
        commandsMap[cmdWord](inputs, cmd, data);
    }
    counter++;
    inputs.push({ command: "", uuid: Date.now() + counter, isLastInput: true });
    return inputs;
};

export { execute, commandsMap };
