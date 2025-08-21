import { n as noop, c as create_ssr_component, d as createEventDispatcher, f as add_attribute, g as getContext, a as subscribe, h as each, e as escape, v as validate_component, i as null_to_empty, j as assign, k as identity, l as set_store_value, b as setContext } from "../../chunks/ssr.js";
import { w as writable } from "../../chunks/index2.js";
import * as closest from "closest-match";
import TagCloud from "TagCloud";
import { f as firstExpJob, e as extractEndYear } from "../../chunks/utils.js";
import "jspdf";
import domtoimage from "dom-to-image-more";
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);
const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
function is_void(name) {
  return void_element_names.test(name) || name.toLowerCase() === "!doctype";
}
const Shrinkable_svelte_svelte_type_style_lang = "";
const css$u = {
  code: ".shrinkable.svelte-ua7787{height:100vh;overflow:hidden;transition:height 0.5s ease}.shrunk.svelte-ua7787{height:0;opacity:0;transform-origin:top}",
  map: null
};
const Shrinkable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const dispatch = createEventDispatcher();
  let containerRef;
  let shrunk = false;
  let { handle } = $$props;
  if ($$props.handle === void 0 && $$bindings.handle && handle !== void 0)
    $$bindings.handle(handle);
  $$result.css.add(css$u);
  {
    if (handle) {
      handle.addEventListener("click", () => {
        shrunk = true;
        dispatch("shrunkEvent");
      });
    }
  }
  return `<div class="${["shrinkable svelte-ua7787", shrunk ? "shrunk" : ""].join(" ").trim()}"${add_attribute("this", containerRef, 0)}>${slots.default ? slots.default({}) : ``} </div>`;
});
const transpose = (matrix) => {
  return matrix[0].map((_col, c) => matrix.map((_row, r) => matrix[r][c]));
};
const mutate = (arr, width, height) => {
  return arr.map((item) => ({
    x: item.x + Math.random() * (width / 2),
    y: item.y + Math.random() * (height / 2)
  }));
};
const generateGrid = (len) => {
  const numRows = Math.ceil(Math.sqrt(len));
  const numCols = Math.ceil(len / numRows);
  const widthRanges = Array.from({ length: numRows }, (_, i) => Math.ceil(window.innerWidth / numRows * i));
  const heightRanges = Array.from({ length: numCols }, (_, i) => Math.ceil(window.innerHeight / numCols * i));
  const grid = Array.from({ length: numRows }, (_, i) => Array.from({ length: numCols }, (_2, j) => ({ x: widthRanges[i], y: heightRanges[j] })));
  return mutate(transpose(grid).flat(1), window.innerWidth / numRows, window.innerHeight / numCols);
};
const getRandomRotation = () => {
  return Math.floor(Math.random() * 120) - 60;
};
const getIconData = (icons) => {
  const grid = generateGrid(icons.length);
  const iconData = icons.map((icon, idx) => {
    return { icon, position: grid[idx], rotation: getRandomRotation() };
  });
  return iconData;
};
const IconCanvas_svelte_svelte_type_style_lang = "";
const css$t = {
  code: ".icon.svelte-1ywxnw6{--size:6vw;position:absolute;filter:grayscale(0.75);opacity:25%;width:var(--size);height:var(--size)}",
  map: null
};
const IconCanvas = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $skills, $$unsubscribe_skills;
  const { skills } = Object.fromEntries(getContext("api"));
  $$unsubscribe_skills = subscribe(skills, (value) => $skills = value);
  const icons = (skillObj) => {
    return getIconData(skillObj["Technical Skills"].sort(() => Math.random() - 0.5).map((skill) => skill.icon));
  };
  $$result.css.add(css$t);
  $$unsubscribe_skills();
  return `<div>${$skills && $skills["Technical Skills"] && $skills["Soft Skills"] ? `${each(icons($skills), (icon) => {
    return `<img${add_attribute("key", icon.icon, 0)} class="icon svelte-1ywxnw6"${add_attribute("src", icon.icon, 0)} alt="Technical Skill Icon"${add_attribute(
      "style",
      `
                    transform: rotate(${icon.rotation}deg);
                    top: ${icon.position.y}px;
                    left: ${icon.position.x}px;
                `,
      0
    )}>`;
  })}` : ``} </div>`;
});
const StartButton_svelte_svelte_type_style_lang = "";
const css$s = {
  code: ':root{--filler:var(--theme-bg-dark);--hover:var(--theme-primary)}.startBtn.svelte-1fbioqh{position:absolute;top:70vh;right:14vw;background:transparent;color:#ccc;width:12vw;height:12vw;font-size:2vw;padding:2vw;border:none;border-radius:100%;transition:transform 0.5s ease,\n            text-shadow 0.5s ease;cursor:pointer;z-index:2}.startBtn.svelte-1fbioqh::after{box-sizing:border-box;content:"";display:block;position:absolute;top:0;bottom:0;left:0;right:0;width:12vw;height:12vw;border-radius:100%;border:0.5vw dotted var(--hover);animation:svelte-1fbioqh-rotate 5s linear infinite}@keyframes svelte-1fbioqh-rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.startBtn.svelte-1fbioqh:hover,.startBtn.svelte-1fbioqh:focus,.startBtn.activated.svelte-1fbioqh{animation:svelte-1fbioqh-activate 1s;box-shadow:0 0 0 2vw transparent,\n            inset 0 0 0 12vw var(--filler);transform:translateY(-0.25em);filter:drop-shadow(0 0 0.5em var(--hover));text-shadow:#FC0 1px 0 10px}@keyframes svelte-1fbioqh-activate{0%{box-shadow:0 0 0 0 var(--hover),\n                inset 0 0 0 0 var(--filler)}}',
  map: null
};
const StartButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { binder } = $$props;
  new Audio("startSfx.mp3");
  if ($$props.binder === void 0 && $$bindings.binder && binder !== void 0)
    $$bindings.binder(binder);
  $$result.css.add(css$s);
  return `<button class="${["startBtn svelte-1fbioqh", ""].join(" ").trim()}"${add_attribute("this", binder, 0)} data-svelte-h="svelte-q5iahm">Start
</button>`;
});
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
        timeout: 2e3
      });
    }
  },
  admin: {
    description: "Login to the admin console",
    action: (inputs) => {
      counter++;
      inputs.push({
        action: () => {
          location.href = "/admin";
        },
        uuid: Date.now() + counter
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
      const sections = [".", "..", ...[...document.querySelectorAll("main > section")].map((elem) => elem.id)].filter((elem) => elem !== "downloadResume");
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
  inputs.forEach((element) => {
    element.isLastInput = false;
  });
  const cmdWord = cmd.toLowerCase().split(" ")[0];
  if (!Object.keys(commandsMap).includes(cmdWord)) {
    if (cmd) {
      counter++;
      inputs.push({ output: `Command not found: ${cmd}`, uuid: Date.now() + counter, error: true });
      const closestMatch = closest.closestMatch(cmdWord, Object.keys(commandsMap));
      if (closest.distance(cmdWord, closestMatch) < 3) {
        counter++;
        inputs.push({ output: `Did you mean: ${closestMatch}?`, uuid: Date.now() + counter });
      }
    }
  } else {
    commandsMap[cmdWord].action(inputs, cmd, data);
  }
  counter++;
  inputs.push({ command: "", uuid: Date.now() + counter, isLastInput: true });
  return inputs;
};
const Input_svelte_svelte_type_style_lang = "";
const css$r = {
  code: '.container.svelte-1qpkq2m.svelte-1qpkq2m{--green:rgb(11, 117, 93);--blue:#0087ff;display:flex;flex-direction:column;align-items:flex-start}.path.svelte-1qpkq2m.svelte-1qpkq2m{position:relative;font-size:1.5vw;font-family:monospace;margin-right:auto;margin-left:4em;color:var(--green)}.path.svelte-1qpkq2m span.svelte-1qpkq2m:first-child{color:var(--blue)}.path.svelte-1qpkq2m span.svelte-1qpkq2m:last-child{color:white}.path.svelte-1qpkq2m.svelte-1qpkq2m::after{content:"";display:block;position:absolute;width:3em;margin-left:-3em;margin-top:-0.5em;height:150%;border:2px solid var(--green);border-right:none}.line.svelte-1qpkq2m.svelte-1qpkq2m{display:flex;position:relative;width:100%;align-items:center;cursor:text}.line.svelte-1qpkq2m.svelte-1qpkq2m::after{content:attr(data-cmd-desc);display:block;position:absolute;width:60vw;white-space:pre-wrap;text-align:left;margin-top:10%;margin-left:3rem;font-size:1.5vw;font-family:monospace;color:grey}.inputContainer.svelte-1qpkq2m.svelte-1qpkq2m{margin-left:4vw;background:var(--theme-bg)}.dollar.svelte-1qpkq2m.svelte-1qpkq2m{font-size:2vw;font-family:monospace}.inputWrapper.svelte-1qpkq2m.svelte-1qpkq2m{display:inline;position:relative;font-size:2vw;font-family:monospace}.input.svelte-1qpkq2m.svelte-1qpkq2m{box-sizing:content-box;position:relative;background:transparent;caret-color:transparent;color:#ccc;border:none;padding-left:0;padding-right:0;margin-bottom:0}.input.svelte-1qpkq2m.svelte-1qpkq2m:active,.input.svelte-1qpkq2m.svelte-1qpkq2m:focus{outline:none}.code.svelte-1qpkq2m.svelte-1qpkq2m{position:absolute;top:0;left:0;color:var(--green)}.blinkerContainer.svelte-1qpkq2m.svelte-1qpkq2m{background:var(--theme-bg)}.blinker.svelte-1qpkq2m.svelte-1qpkq2m{display:block;position:relative;width:1vw;height:2vw;background-color:gray;animation-name:svelte-1qpkq2m-blink;animation-duration:800ms;animation-iteration-count:infinite;opacity:1}@keyframes svelte-1qpkq2m-blink{from{opacity:1}to{opacity:0}}',
  map: null
};
const Input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let input, line;
  let size = 1;
  let { execCallback } = $$props;
  let { blinker = false } = $$props;
  let { data } = $$props;
  let { commandsCache = [] } = $$props;
  const commands = Object.keys(commandsMap);
  new RegExp(`^(${commands.join("|")})s*(.*)$`, "i");
  if ($$props.execCallback === void 0 && $$bindings.execCallback && execCallback !== void 0)
    $$bindings.execCallback(execCallback);
  if ($$props.blinker === void 0 && $$bindings.blinker && blinker !== void 0)
    $$bindings.blinker(blinker);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.commandsCache === void 0 && $$bindings.commandsCache && commandsCache !== void 0)
    $$bindings.commandsCache(commandsCache);
  $$result.css.add(css$r);
  return `<div class="container svelte-1qpkq2m"><div class="path svelte-1qpkq2m">(<span class="svelte-1qpkq2m">${escape(data.user.replace("@", "㉿"))}</span>)-[<span class="svelte-1qpkq2m">${escape(data.cwd)}</span>]</div> <div class="line svelte-1qpkq2m"${add_attribute("this", line, 0)}><div class="inputContainer svelte-1qpkq2m"><span class="dollar svelte-1qpkq2m" data-svelte-h="svelte-10pf2tt">$ </span> <div class="inputWrapper svelte-1qpkq2m"><input class="input svelte-1qpkq2m" type="text" spellcheck="false"${add_attribute("style", `width: ${size}ch;`, 0)}${add_attribute("this", input, 0)}> <span class="code svelte-1qpkq2m"></span></div></div> <div class="blinkerContainer svelte-1qpkq2m"><i class="${["svelte-1qpkq2m", blinker ? "blinker" : ""].join(" ").trim()}"></i></div></div> </div>`;
});
const Output_svelte_svelte_type_style_lang = "";
const css$q = {
  code: ".outputContainer.svelte-q6z2cq{display:flex;align-items:center;padding:0.25rem 1.25rem;gap:1rem}.output.svelte-q6z2cq{font-family:monospace;font-size:1.5vw;white-space:pre-wrap;text-align:left}.command.svelte-q6z2cq{color:rgb(11, 117, 93)}.error.svelte-q6z2cq{color:rgb(169, 16, 16)}",
  map: null
};
const Output = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { output, error } = $$props;
  const commands = Object.keys(commandsMap);
  const commandRegex = new RegExp(`^(${commands.join("|")})$`);
  const midCommandRegex = new RegExp(`(${commands.join("|")})s*.*$`);
  let cmdWord = null;
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
  if ($$props.output === void 0 && $$bindings.output && output !== void 0)
    $$bindings.output(output);
  if ($$props.error === void 0 && $$bindings.error && error !== void 0)
    $$bindings.error(error);
  $$result.css.add(css$q);
  {
    if (error) {
      beep();
    }
  }
  {
    if (midCommandRegex.exec(output)) {
      cmdWord = midCommandRegex.exec(output)[1];
    }
  }
  return `<div class="outputContainer svelte-q6z2cq">${Array.isArray(output) ? `${each(output, (line) => {
    return `<span class="${["output svelte-q6z2cq", commandRegex.exec(line) ? "command" : ""].join(" ").trim()}">${escape(line)}</span>`;
  })}` : `<span class="${["output svelte-q6z2cq", error ? "error" : ""].join(" ").trim()}">${cmdWord ? `${escape(output.split(cmdWord)[0])}<span class="command svelte-q6z2cq">${escape(cmdWord)}</span>${escape(output.split(cmdWord)?.[1])}` : `${escape(output)}`}</span>`} </div>`;
});
const AsciiProgress_svelte_svelte_type_style_lang = "";
const css$p = {
  code: ".progress.svelte-1jvuocu{position:relative;display:inline-block;width:90%;height:20px}.progress-bar.svelte-1jvuocu{--green:rgb(11, 117, 93);--grey:#6e6e6e78;position:relative;height:100%;background-image:linear-gradient(90deg, var(--green) 40%, var(--grey) 40%, var(--grey) 50%, var(--green) 50%, var(--green) 90%, var(--grey) 90%, var(--grey) 100%);background-size:50.00px 50.00px;animation:svelte-1jvuocu-gradient 10s ease infinite}@keyframes svelte-1jvuocu-gradient{0%{background-position:0% 100%}100%{background-position:100% 0%}}",
  map: null
};
const AsciiProgress = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { startProgress = 0 } = $$props;
  let { endProgress = 90 } = $$props;
  let { timeout = 1e3 } = $$props;
  let { callback } = $$props;
  let currProgress = startProgress;
  if ($$props.startProgress === void 0 && $$bindings.startProgress && startProgress !== void 0)
    $$bindings.startProgress(startProgress);
  if ($$props.endProgress === void 0 && $$bindings.endProgress && endProgress !== void 0)
    $$bindings.endProgress(endProgress);
  if ($$props.timeout === void 0 && $$bindings.timeout && timeout !== void 0)
    $$bindings.timeout(timeout);
  if ($$props.callback === void 0 && $$bindings.callback && callback !== void 0)
    $$bindings.callback(callback);
  $$result.css.add(css$p);
  return `<div class="progress svelte-1jvuocu"><div class="progress-bar svelte-1jvuocu"${add_attribute(
    "style",
    `
        width: ${currProgress}%;
        transition: width ${timeout}ms ease;
    `,
    0
  )}></div> </div>`;
});
const Action = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { action } = $$props;
  let { timeout = 0 } = $$props;
  let { noProgress = false } = $$props;
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.timeout === void 0 && $$bindings.timeout && timeout !== void 0)
    $$bindings.timeout(timeout);
  if ($$props.noProgress === void 0 && $$bindings.noProgress && noProgress !== void 0)
    $$bindings.noProgress(noProgress);
  return `${timeout > 0 && !noProgress ? `${validate_component(AsciiProgress, "AsciiProgress").$$render($$result, { timeout, callback: action }, {}, {})}` : ``}`;
});
const Screen_svelte_svelte_type_style_lang = "";
const css$o = {
  code: '.screen.svelte-x2g8pg.svelte-x2g8pg{position:relative;width:100%;height:40vw;background:var(--theme-bg);filter:contrast(1.25);opacity:0.75;border:2px solid var(--theme-primary);border-top:none;z-index:1;box-shadow:0 0 4px 4px rgba(0, 0, 0, 0.5)}.innerDiv.svelte-x2g8pg.svelte-x2g8pg{--scrollbar-color:#d9d9d970;position:relative;width:99%;height:100%;padding-right:0.5em;overflow-y:scroll;scrollbar-width:auto;scrollbar-color:var(--scrollbar-color) var(--theme-bg)}.innerDiv.svelte-x2g8pg.svelte-x2g8pg::-webkit-scrollbar{width:8px}.innerDiv.svelte-x2g8pg.svelte-x2g8pg::-webkit-scrollbar-track{background:var(--theme-bg)}.innerDiv.svelte-x2g8pg.svelte-x2g8pg::-webkit-scrollbar-thumb{background-color:var(--scrollbar-color);border-radius:10px;border:2px solid var(--theme-bg)}.banner.svelte-x2g8pg.svelte-x2g8pg{display:flex;flex-direction:column;align-items:center;justify-content:center;padding-top:5%}.title.svelte-x2g8pg.svelte-x2g8pg{font-family:"Bitwise", monospace}.subtitle.svelte-x2g8pg.svelte-x2g8pg{font-size:1vw;text-align:left}.subtitle.svelte-x2g8pg code.svelte-x2g8pg{font-family:"Bitwise", monospace;font-size:1.25vw;color:rgb(11, 117, 93)}',
  map: null
};
const Screen = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let screen;
  let inputs = [
    {
      command: "",
      uuid: Date.now() + Math.random(),
      isLastInput: true
    }
  ];
  const commandsCache = [];
  let { data } = $$props;
  const handleExec = (command) => {
    inputs = execute(inputs, command, data, commandsCache);
    data = { ...data };
    inputs = [...inputs].sort((a, b) => a.uuid - b.uuid);
  };
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$o);
  return `<div class="screen svelte-x2g8pg"${add_attribute("this", screen, 0)}><div class="innerDiv svelte-x2g8pg"><div class="banner svelte-x2g8pg" data-svelte-h="svelte-17kxlhg"><h1 class="title svelte-x2g8pg">HT&#39;s Portfolio</h1> <pre class="subtitle svelte-x2g8pg">                Enter the command <code class="svelte-x2g8pg">Start</code> or click the button.
                Alternatively, you can use the <code class="svelte-x2g8pg">Help</code> command to play around.
            </pre></div> <div>${each(inputs, (input) => {
    return `${input.command !== void 0 ? `${validate_component(Input, "Input").$$render(
      $$result,
      {
        execCallback: handleExec,
        blinker: input.isLastInput,
        data,
        commandsCache
      },
      {},
      {}
    )}` : `${input.output !== void 0 ? `${validate_component(Output, "Output").$$render($$result, { output: input.output, error: input.error }, {}, {})}` : `${input.action !== void 0 ? `${validate_component(Action, "Action").$$render(
      $$result,
      {
        action: input.action,
        timeout: input.timeout || 0
      },
      {},
      {}
    )}` : ``}`}`}`;
  })}</div></div> </div>`;
});
const TitleBar_svelte_svelte_type_style_lang = "";
const css$n = {
  code: ".titleBar.svelte-xuv39y.svelte-xuv39y{position:relative;display:flex;align-items:center;width:80vw;height:1.5em;background:black;z-index:99;border:5px solid var(--theme-primary);user-select:none}.titleBar.svelte-xuv39y .titleBarText.svelte-xuv39y{color:#ccc;font-family:monospace;font-size:1vw;padding-left:0.5em;padding-right:0.5em;margin-left:auto;margin-left:auto}.titleBar.svelte-xuv39y .titleBarButtons.svelte-xuv39y{--icon-size:1.25em;display:flex;margin-left:auto;padding-right:var(--icon-size);align-items:center;gap:calc(var(--icon-size) / 2)}.titleBar.svelte-xuv39y .titleBtn.svelte-xuv39y{display:inline-block;width:var(--icon-size);height:var(--icon-size);fill:#ccc;cursor:pointer}.titleBar.svelte-xuv39y .titleBtn.svelte-xuv39y:hover{fill:#fff}",
  map: null
};
const TitleBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$n);
  return `<div class="titleBar svelte-xuv39y"><span class="titleBarText svelte-xuv39y">${escape(data.user)}:${escape(data.cwd)}</span> <div class="titleBarButtons svelte-xuv39y" data-svelte-h="svelte-ux8pbu"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="titleBtn svelte-xuv39y"><rect x="3" y="19" width="18" height="2"></rect></svg> <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="titleBtn svelte-xuv39y"><rect x="3" y="3" width="18" height="2"></rect><rect x="3" y="19" width="18" height="2"></rect><rect x="3" y="11" width="2" height="8"></rect><rect x="19" y="11" width="2" height="8"></rect></svg> <svg class="titleBtn svelte-xuv39y" viewBox="0 0 24 24"><path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"></path></svg></div> </div>`;
});
const Terminal_svelte_svelte_type_style_lang = "";
const css$m = {
  code: ".terminal.svelte-1ldeppr{position:relative;display:flex;flex-direction:column;justify-content:center;align-items:center;width:80vw;margin:auto}",
  map: null
};
const Terminal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data = { user: "root@HT.Dev", cwd: "~/Desktop" } } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$m);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="terminal svelte-1ldeppr">${validate_component(TitleBar, "TitleBar").$$render($$result, { data }, {}, {})} ${validate_component(Screen, "Screen").$$render(
      $$result,
      { data },
      {
        data: ($$value) => {
          data = $$value;
          $$settled = false;
        }
      },
      {}
    )} </div>`;
  } while (!$$settled);
  return $$rendered;
});
const Landing_svelte_svelte_type_style_lang = "";
const css$l = {
  code: ".landing.svelte-1lrpmz4{display:flex;flex-direction:column;height:100%;position:relative}",
  map: null
};
const Landing = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let handle;
  $$result.css.add(css$l);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Shrinkable, "Shrinkable").$$render($$result, { handle }, {}, {
      default: () => {
        return `<div class="landing svelte-1lrpmz4">${validate_component(IconCanvas, "IconCanvas").$$render($$result, {}, {}, {})} ${validate_component(Terminal, "Terminal").$$render($$result, {}, {}, {})} ${validate_component(StartButton, "StartButton").$$render(
          $$result,
          { binder: handle },
          {
            binder: ($$value) => {
              handle = $$value;
              $$settled = false;
            }
          },
          {}
        )}</div>`;
      }
    })}`;
  } while (!$$settled);
  return $$rendered;
});
const Recursor_svelte_svelte_type_style_lang = "";
const css$k = {
  code: ':root{--base-font-size:1vw}h2.svelte-vurpgg.svelte-vurpgg{font-size:calc(var(--base-font-size) * 1.75)}h3.svelte-vurpgg.svelte-vurpgg{font-size:calc(var(--base-font-size) * 1.5)}h4.svelte-vurpgg.svelte-vurpgg{font-size:calc(var(--base-font-size) * 1.25)}.node.svelte-vurpgg.svelte-vurpgg{--node-color:var(--theme-primary);--shadow-size:12px;--outer-shadow-size:1px;background:var(--theme-bg);padding:2vw;padding-top:0;margin-left:1vw;border:2px solid var(--node-color);box-shadow:inset var(--shadow-size) 0px 2px 0px black,\n            inset calc(var(--shadow-size) * -1) 0px 2px 0px black,\n            inset 0px calc(var(--shadow-size) * -1) 2px 0px black,\n            var(--outer-shadow-size) var(--outer-shadow-size) 1px 1px black}.node.svelte-vurpgg .heading.svelte-vurpgg{background:var(--node-color);width:calc(100% + 2vw);margin-left:-2vw;margin-top:0;padding:1vw;box-shadow:0px var(--shadow-size) 2px 0px black}.Job.svelte-vurpgg.svelte-vurpgg{--shadow-size:12px;position:relative;transition:transform 0.25s ease-in-out}.Job.svelte-vurpgg.svelte-vurpgg:hover,.Job.svelte-vurpgg.svelte-vurpgg:active,.Job.svelte-vurpgg.svelte-vurpgg:focus{--outer-shadow-size:2px;transform:scale(1.1);z-index:10}.Job.svelte-vurpgg.svelte-vurpgg::before{content:" ";position:absolute;top:50%;left:100%;right:0;display:block;height:8px;width:5%;background:var(--theme-primary);z-index:3}.Job.svelte-vurpgg.svelte-vurpgg::after{content:attr(data-year);position:absolute;top:calc(50% - 34px);left:103%;right:0;display:block;height:60px;width:8%;padding:8px;background:var(--theme-bg);z-index:5;white-space:pre-line}.Role.svelte-vurpgg.svelte-vurpgg{--shadow-size:8px;--node-color:#3b3bf4}.Product.svelte-vurpgg.svelte-vurpgg{--shadow-size:4px;--node-color:#cc8006}.Product.svelte-vurpgg.svelte-vurpgg,.Role.svelte-vurpgg.svelte-vurpgg:not(:has(.Product)){padding:0 1vw 1vw 1vw}.Product.svelte-vurpgg .heading.svelte-vurpgg,.Role.svelte-vurpgg:not(:has(.Product)) .heading.svelte-vurpgg{width:100%;margin-left:-1vw;margin-bottom:1vw}.Product.svelte-vurpgg .contents.svelte-vurpgg,.Role.svelte-vurpgg:not(:has(.Product)) .contents.svelte-vurpgg{overflow-y:auto;max-height:18rem}.Product.svelte-vurpgg .contents.svelte-vurpgg::-webkit-scrollbar,.Role.svelte-vurpgg:not(:has(.Product)) .contents.svelte-vurpgg::-webkit-scrollbar{width:0.25rem}.Product.svelte-vurpgg .contents.svelte-vurpgg::-webkit-scrollbar-thumb,.Role.svelte-vurpgg:not(:has(.Product)) .contents.svelte-vurpgg::-webkit-scrollbar-thumb{background:var(--node-color);border-radius:0.25rem}.Product.svelte-vurpgg .contents.svelte-vurpgg::-webkit-scrollbar-track,.Role.svelte-vurpgg:not(:has(.Product)) .contents.svelte-vurpgg::-webkit-scrollbar-track{background:color-mix(\n            in oklab,\n            var(--theme-bg) 90%,\n            white\n        );border-radius:0.25rem}.mobile-only.svelte-vurpgg.svelte-vurpgg{display:none}details.svelte-vurpgg.svelte-vurpgg{cursor:pointer;user-select:none}summary.svelte-vurpgg.svelte-vurpgg{font-size:var(--base-font-size);filter:brightness(0.8)}.children.svelte-vurpgg.svelte-vurpgg{display:flex;flex-direction:column;align-items:stretch;justify-content:center;gap:2vw}.caption.svelte-vurpgg.svelte-vurpgg{font-size:calc(var(--base-font-size) * 1.25);font-style:italic;margin:0;padding:0}.description.svelte-vurpgg.svelte-vurpgg{font-weight:bold;white-space:pre-line;font-size:calc(var(--base-font-size) * 1.25);text-align:start;margin:0}.skills.svelte-vurpgg.svelte-vurpgg{font-weight:bold;color:rgb(171, 171, 171);font-size:calc(var(--base-font-size) * 1);font-family:"M PLUS 1 Code", sans-serif;text-align:start}@media screen and (max-width: 1200px){.Job.svelte-vurpgg.svelte-vurpgg::after,.Job.svelte-vurpgg.svelte-vurpgg::before{display:none}.mobile-only.svelte-vurpgg.svelte-vurpgg{display:initial}}@media screen and (max-width: 640px){:root{--base-font-size:2vw}}',
  map: null
};
const Recursor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let headTag;
  let { node, nodeIdx } = $$props;
  const headingMap = { Job: "h2", Role: "h3", Product: "h4" };
  if ($$props.node === void 0 && $$bindings.node && node !== void 0)
    $$bindings.node(node);
  if ($$props.nodeIdx === void 0 && $$bindings.nodeIdx && nodeIdx !== void 0)
    $$bindings.nodeIdx(nodeIdx);
  $$result.css.add(css$k);
  headTag = headingMap[node.type];
  {
    console.log(node);
  }
  return `${Array.isArray(node) ? `${each(node, (child, idx) => {
    return `${validate_component(Recursor, "svelte:self").$$render($$result, { node: child, nodeIdx: idx }, {}, {})}`;
  })}` : `<div class="${escape(null_to_empty(`node ${node.type}`), true) + " svelte-vurpgg"}"${add_attribute("data-year", node.year?.split(" – ").reverse().join("\n↑\n"), 0)}>${((tag) => {
    return tag ? `<${headTag} class="heading svelte-vurpgg">${is_void(tag) ? "" : `${escape(node.name)} ${node.year ? `<span class="mobile-only svelte-vurpgg">(${escape(node.year)})</span>` : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(headTag)} <div class="contents svelte-vurpgg">${node.caption ? `<blockquote class="caption svelte-vurpgg">${escape(node.caption)}</blockquote>` : ``} ${node.description ? `<pre class="description svelte-vurpgg">${escape(node.description)}</pre>` : ``} ${node.skills ? `<p class="skills svelte-vurpgg">Technologies Used: ${escape(node.skills.join(", "))}</p>` : ``} ${node.children?.length > 0 ? `<details ${nodeIdx === 0 ? "open" : ""} class="svelte-vurpgg"><summary class="svelte-vurpgg" data-svelte-h="svelte-r17sgt">Click for Details</summary> <div class="children svelte-vurpgg">${each(node.children, (child, idx) => {
    return `<div>${validate_component(Recursor, "svelte:self").$$render($$result, { node: child, nodeIdx: idx }, {}, {})} </div>`;
  })}</div></details>` : ``}</div></div>`}`;
});
const Experience_svelte_svelte_type_style_lang = "";
const css$j = {
  code: '.container.svelte-qo2kw5{display:flex;flex-direction:column;align-items:center;justify-content:center;margin-left:auto;margin-right:auto}.contents.svelte-qo2kw5{position:relative;display:flex;flex-direction:column;align-items:stretch;justify-content:center;width:70vw;margin-top:1em;gap:2vw}.contents.svelte-qo2kw5::before{position:absolute;right:-8%;top:-5%;bottom:-5%;content:" ";display:block;width:8px;background:linear-gradient(\n            to bottom,\n            rgba(80,80,80,0) 0%,\n            rgb(167 63 63) 4%,\n            rgb(70 21 21) 96%,\n            rgba(80,80,80,0) 100%\n        )}@media screen and (max-width: 1200px){.container.svelte-qo2kw5{padding-bottom:2rem}.contents.svelte-qo2kw5::before{display:none}}@media screen and (max-width: 640px){.contents.svelte-qo2kw5{width:80vw}}',
  map: null
};
const Experience = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $experience, $$unsubscribe_experience;
  const { experience } = Object.fromEntries(getContext("api"));
  $$unsubscribe_experience = subscribe(experience, (value) => $experience = value);
  $$result.css.add(css$j);
  $$unsubscribe_experience();
  return `${$experience ? `<div class="container svelte-qo2kw5"><h1 class="font-effect-anaglyph" data-svelte-h="svelte-59nisp">Experience</h1> <div class="contents svelte-qo2kw5">${validate_component(Recursor, "Recursor").$$render($$result, { node: $experience }, {}, {})}</div></div>` : ``}`;
});
const Tiltable_svelte_svelte_type_style_lang = "";
const css$i = {
  code: ".tilting-card-content.svelte-1fn60rc.svelte-1fn60rc{--perspective:1000px;--rotateX:0;--rotateY:0;--angle:5deg;position:relative;display:inherit;transform:perspective(var(--perspective)) rotateX(var(--rotateX))\n            rotateY(var(--rotateY));transition:transform 350ms ease}.mouse-position-tracker.svelte-1fn60rc.svelte-1fn60rc{position:absolute;inset:0}.mouse-position-tracker.svelte-1fn60rc>div.svelte-1fn60rc{position:absolute;width:calc(100% / 3);height:calc(100% / 3);z-index:2}.tilting-card-content.svelte-1fn60rc.svelte-1fn60rc:has(.mouse-position-tracker\n            > div:nth-child(1):hover){--rotateX:var(--angle);--rotateY:calc(var(--angle) * -1)}.tilting-card-content.svelte-1fn60rc.svelte-1fn60rc:has(.mouse-position-tracker\n            > div:nth-child(2):hover){--rotateX:var(--angle)}.tilting-card-content.svelte-1fn60rc.svelte-1fn60rc:has(.mouse-position-tracker\n            > div:nth-child(3):hover){--rotateX:var(--angle);--rotateY:var(--angle)}.tilting-card-content.svelte-1fn60rc.svelte-1fn60rc:has(.mouse-position-tracker\n            > div:nth-child(4):hover){--rotateY:calc(var(--angle) * -1)}.tilting-card-content.svelte-1fn60rc.svelte-1fn60rc:has(.mouse-position-tracker\n            > div:nth-child(6):hover){--rotateY:var(--angle)}.tilting-card-content.svelte-1fn60rc.svelte-1fn60rc:has(.mouse-position-tracker\n            > div:nth-child(7):hover){--rotateX:calc(var(--angle) * -1);--rotateY:calc(var(--angle) * -1)}.tilting-card-content.svelte-1fn60rc.svelte-1fn60rc:has(.mouse-position-tracker\n            > div:nth-child(8):hover){--rotateX:calc(var(--angle) * -1)}.tilting-card-content.svelte-1fn60rc.svelte-1fn60rc:has(.mouse-position-tracker\n            > div:nth-child(9):hover){--rotateX:calc(var(--angle) * -1);--rotateY:var(--angle)}.mouse-position-tracker.svelte-1fn60rc>div.svelte-1fn60rc:nth-of-type(3n - 2){left:0}.mouse-position-tracker.svelte-1fn60rc>div.svelte-1fn60rc:nth-of-type(3n - 1){left:calc(100% / 3)}.mouse-position-tracker.svelte-1fn60rc>div.svelte-1fn60rc:nth-of-type(3n){right:0}.mouse-position-tracker.svelte-1fn60rc>div.svelte-1fn60rc:nth-child(n + 1):nth-child(-n + 3){top:0}.mouse-position-tracker.svelte-1fn60rc>div.svelte-1fn60rc:nth-child(n + 4):nth-child(-n + 6){top:calc(100% / 3)}.mouse-position-tracker.svelte-1fn60rc>div.svelte-1fn60rc:nth-child(n + 7):nth-child(-n + 9){bottom:0}",
  map: null
};
const Tiltable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$i);
  return ` <div class="tilting-card-content svelte-1fn60rc" role="button" tabindex="0">${slots.default ? slots.default({}) : ``} <div class="mouse-position-tracker svelte-1fn60rc">${each({ length: 9 }, (_) => {
    return `<div class="tracker svelte-1fn60rc"></div>`;
  })}</div> </div>`;
});
const GhCard_svelte_svelte_type_style_lang = "";
const css$h = {
  code: '.shrinker.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{position:relative;display:flex;transform-origin:top;transition:transform 1s ease-in-out}.ghCard.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{--card-header-bg:var(--theme-primary);--card-bg:var(--theme-bg);--card-color:#eee;--tags-color:rgb(171, 171, 171);--stats-header-color:rgb(192, 192, 192);position:relative;background:var(--card-bg);color:var(--card-color);padding:1em;margin:1em 0;border-radius:4px;width:37vw;display:flex;flex-direction:column;filter:drop-shadow(2px 4px 6px black);transition:transform 0.5s ease-in-out}.clearTX.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{transform:none !important}.ghCard.svelte-y1qh51 .titleHolder.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{width:calc(100% + 2em);background:var(--card-header-bg);position:relative;margin-left:-1em;margin-top:-1em;margin-bottom:1em;box-shadow:0px 6px 4px 0px rgba(0,0,0,0.75)}.ghCard.svelte-y1qh51 .title.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{text-decoration:none;text-transform:uppercase}.ghCard.svelte-y1qh51 .title a.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51,.ghCard.svelte-y1qh51 .title a.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51:hover,.ghCard.svelte-y1qh51 .title a.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51:active,.ghCard.svelte-y1qh51 .title a.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51:visited{color:var(--card-color);text-decoration:none;cursor:pointer}.ghCard.svelte-y1qh51 .title a[href].svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{border-bottom:dashed}.ghCard.svelte-y1qh51 .cardBody.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{position:relative;width:100%;height:100%;display:flex;flex-direction:column}.ghCard.svelte-y1qh51 img.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51,.ghCard.svelte-y1qh51 .fallback.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{position:relative;width:100%;height:calc(37vw / 2);pointer-events:none}.ghCard.svelte-y1qh51 .fallback.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{background:repeating-linear-gradient(\n            45deg,\n            #babbbf,\n            #c3c3c3 10px,\n            #929292 10px,\n            #e1e1e1 20px\n        );display:flex;align-items:center;justify-content:center;font-size:5vw;color:rgba(255, 255, 255, 0.25)}.ghCard.svelte-y1qh51 .description.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{--font-size:1.25vw;font-weight:bold;white-space:pre-wrap;font-size:calc(var(--font-size) * 1);text-align:start}.ghCard.svelte-y1qh51 .tags.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{--font-size:1vw;font-weight:bold;font-size:small;color:var(--tags-color);font-size:calc(var(--font-size) * 1);font-family:"M PLUS 1 Code", sans-serif}.ghCard.svelte-y1qh51 .statsHolder.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{position:relative;display:flex;align-items:center;margin-top:auto;backdrop-filter:contrast(0.75);border:1px dashed black;filter:drop-shadow(0px 2px 3px black)}.ghCard.svelte-y1qh51 .statsHolder.svelte-y1qh51>div.svelte-y1qh51.svelte-y1qh51{display:flex;flex-direction:column;margin-left:auto;margin-right:auto;height:100%;justify-content:space-evenly;align-items:center}.ghCard.svelte-y1qh51 .statsHolder.svelte-y1qh51>div.svelte-y1qh51>span.svelte-y1qh51{position:relative;font-weight:bold;font-size:larger;color:var(--stats-header-color)}.ghCard.svelte-y1qh51 .statsHolder img.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{width:3vw;height:3vw}.ghCard.svelte-y1qh51 .stats.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{display:flex;width:20vw;margin-left:auto;margin-right:auto;flex-direction:column;justify-content:center;align-items:center;margin-top:1em}.ghCard.svelte-y1qh51 .stat.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{width:100%;display:flex;justify-content:space-between}.ghCard.svelte-y1qh51 .statKey.svelte-y1qh51>span.svelte-y1qh51.svelte-y1qh51:first-child{fill:var(--card-color);margin-right:10px}.ghCard.svelte-y1qh51 .statValue.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{font-weight:bold}@media screen and (max-width: 1332px){.ghCard.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{transform:none !important}}@media screen and (max-width: 1200px){.ghCard.svelte-y1qh51 .description.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{font-size:calc(var(--font-size) * 1.5)}.ghCard.svelte-y1qh51 .tags.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{font-size:calc(var(--font-size) * 1.5)}.ghCard.svelte-y1qh51 .statsHolder>div img.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{width:5vw;height:5vw}}@media screen and (max-width: 640px){.ghCard.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{width:100%}.ghCard.svelte-y1qh51 img.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{height:unset}.ghCard.svelte-y1qh51 .description.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{font-size:calc(var(--font-size) * 3)}.ghCard.svelte-y1qh51 .tags.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{font-size:calc(var(--font-size) * 3)}.ghCard.svelte-y1qh51 .statsHolder.svelte-y1qh51>div.svelte-y1qh51.svelte-y1qh51{margin-left:4vw;margin-right:4vw;gap:1vw}.ghCard.svelte-y1qh51 .statsHolder>div img.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{width:10vw;height:10vw}.ghCard.svelte-y1qh51 .stats.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{width:30vw}}@media screen and (max-width: 480px){.ghCard.svelte-y1qh51 .stats.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{width:40vw}}@media screen and (max-width: 720px) and (min-width: 640px){.ghCard.svelte-y1qh51 .stats.svelte-y1qh51.svelte-y1qh51.svelte-y1qh51{font-size:2vw}}',
  map: null
};
const GhCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let card;
  let allStatsPresent;
  let nonZeroStats;
  let displayStats;
  let { name, title, description, imageUrl, tags } = $$props;
  let { htmlUrl = void 0 } = $$props;
  let { watcherCount = void 0 } = $$props;
  let { stargazerCount = void 0 } = $$props;
  let { forkCount = void 0 } = $$props;
  let { oddOrEven = void 0 } = $$props;
  let { inview = false } = $$props;
  const stats = {
    watchers: {
      count: watcherCount,
      icon: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
                    <path fill-rule="evenodd" d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"></path>
                </svg>`
    },
    stars: {
      count: stargazerCount,
      icon: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
                    <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
                </svg>`
    },
    forks: {
      count: forkCount,
      icon: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
                    <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                </svg>`
    }
  };
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.description === void 0 && $$bindings.description && description !== void 0)
    $$bindings.description(description);
  if ($$props.imageUrl === void 0 && $$bindings.imageUrl && imageUrl !== void 0)
    $$bindings.imageUrl(imageUrl);
  if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0)
    $$bindings.tags(tags);
  if ($$props.htmlUrl === void 0 && $$bindings.htmlUrl && htmlUrl !== void 0)
    $$bindings.htmlUrl(htmlUrl);
  if ($$props.watcherCount === void 0 && $$bindings.watcherCount && watcherCount !== void 0)
    $$bindings.watcherCount(watcherCount);
  if ($$props.stargazerCount === void 0 && $$bindings.stargazerCount && stargazerCount !== void 0)
    $$bindings.stargazerCount(stargazerCount);
  if ($$props.forkCount === void 0 && $$bindings.forkCount && forkCount !== void 0)
    $$bindings.forkCount(forkCount);
  if ($$props.oddOrEven === void 0 && $$bindings.oddOrEven && oddOrEven !== void 0)
    $$bindings.oddOrEven(oddOrEven);
  if ($$props.inview === void 0 && $$bindings.inview && inview !== void 0)
    $$bindings.inview(inview);
  $$result.css.add(css$h);
  card = {
    name,
    title,
    description,
    htmlUrl,
    imageUrl,
    tags,
    watcherCount,
    stargazerCount,
    forkCount
  };
  allStatsPresent = Object.values(stats).every((stat) => stat.count !== void 0);
  nonZeroStats = Object.values(stats).reduce((a, b) => a + b.count, 0) > 0;
  displayStats = allStatsPresent && nonZeroStats;
  return `<div class="${["shrinker svelte-y1qh51", inview ? "clearTX" : ""].join(" ").trim()}" style="transform: scaleY(0);"><div class="${["ghCard svelte-y1qh51", inview ? "clearTX" : ""].join(" ").trim()}" style="${"transform: translateX(" + escape(2 * Math.pow(-1, oddOrEven), true) + "0vw);"}"><div class="titleHolder svelte-y1qh51"><h2 class="title svelte-y1qh51"><a${add_attribute("href", card.htmlUrl, 0)} target="_blank" rel="noopener noreferrer" class="svelte-y1qh51">${escape(card.title)}</a></h2></div> <div class="cardBody svelte-y1qh51">${card.imageUrl ? `<img${add_attribute("src", card.imageUrl, 0)}${add_attribute("alt", card.name, 0)} class="svelte-y1qh51">` : `<div class="fallback svelte-y1qh51" data-svelte-h="svelte-y14wjz"><span>No Image for this one...</span></div>`} <pre class="description svelte-y1qh51">${escape(card.description)}</pre> <p class="tags svelte-y1qh51">Technologies Used: ${escape(card.tags.join(", "))}</p> ${displayStats ? `<div class="statsHolder svelte-y1qh51"><div class="svelte-y1qh51" data-svelte-h="svelte-jcgezz"><span class="svelte-y1qh51">STATS</span> <img src="/icons/github.png" alt="github icon" class="svelte-y1qh51"></div> <p class="stats svelte-y1qh51">${each(Object.entries(stats), ([key, value]) => {
    return `<span class="${"stat " + escape(key, true) + " svelte-y1qh51"}"><span class="statKey svelte-y1qh51"> <span class="svelte-y1qh51"><!-- HTML_TAG_START -->${value.icon}<!-- HTML_TAG_END --></span> <span class="svelte-y1qh51">${escape(key.toUpperCase())}</span></span> <span class="statValue svelte-y1qh51">${escape(value.count)}</span> </span>`;
  })}</p></div>` : ``}</div></div> </div>`;
});
const GihtubCards_svelte_svelte_type_style_lang = "";
const { Object: Object_1$1 } = globals;
const css$g = {
  code: ".githubCards.svelte-ljkcbs{display:flex;gap:1em;align-content:center;justify-content:center;flex-wrap:wrap;width:80vw;margin-left:auto;margin-right:auto;user-select:none}@media screen and (max-width: 800px){.githubCards.svelte-ljkcbs{padding-bottom:0}}",
  map: null
};
const GihtubCards = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $projects, $$unsubscribe_projects;
  let { inview = false } = $$props;
  const { projects } = Object.fromEntries(getContext("api"));
  $$unsubscribe_projects = subscribe(projects, (value) => $projects = value);
  if ($$props.inview === void 0 && $$bindings.inview && inview !== void 0)
    $$bindings.inview(inview);
  $$result.css.add(css$g);
  $$unsubscribe_projects();
  return `<div class="githubCards svelte-ljkcbs">${$projects.length ? each($projects, (card, idx) => {
    return `${validate_component(Tiltable, "Tiltable").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(GhCard, "GhCard").$$render($$result, Object_1$1.assign({}, card, { oddOrEven: idx }, { inview }), {}, {})} `;
      }
    })}`;
  }) : `<p data-svelte-h="svelte-1qi119p">No projects found...</p>`} </div>`;
});
const Projects = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { inview = false } = $$props;
  if ($$props.inview === void 0 && $$bindings.inview && inview !== void 0)
    $$bindings.inview(inview);
  return `<h1 class="font-effect-anaglyph" data-svelte-h="svelte-i552s3">MY PROJECTS</h1> ${validate_component(GihtubCards, "GihtubCards").$$render($$result, { inview }, {}, {})}`;
});
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a, b) {
  if (a === b || a !== a)
    return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let {
      delay = 0,
      duration = 400,
      easing = identity,
      interpolate = get_interpolator
    } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > /** @type {number} */
      duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
const Progressbar_svelte_svelte_type_style_lang = "";
const css$f = {
  code: '.progress-bar.svelte-1hge3kc{height:20px;position:relative;background:rgba(0, 0, 0, 0.17);border-radius:16px;border:1px solid rgba(168, 168, 168, 0.97);overflow:clip;filter:drop-shadow(2px 4px 6px black)}.progress-bar.svelte-1hge3kc::before{position:absolute;width:100%;height:18px;left:0;bottom:0;content:"";border:6px solid rgb(168 168 168 / 70%);border-radius:16px;filter:blur(4px)}.progress-bar__fill.svelte-1hge3kc{width:100%;height:12px;background:linear-gradient(90deg, var(--theme-primary), #51db3e);border-radius:16px;position:absolute;top:0;left:0;padding-top:0;margin-top:4px;margin-left:4px;transition:width 0.5s ease}.animate.svelte-1hge3kc{animation:svelte-1hge3kc-scaler 5s ease-in-out 0s infinite}@keyframes svelte-1hge3kc-scaler{10%{width:0%}20%,100%{width:100%}}',
  map: null
};
const Progressbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $progress, $$unsubscribe_progress;
  let { width = 100 } = $$props;
  let { value = 100 } = $$props;
  let { animate = true } = $$props;
  let progress = tweened(0, { duration: 500, easing: (t) => t });
  $$unsubscribe_progress = subscribe(progress, (value2) => $progress = value2);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.animate === void 0 && $$bindings.animate && animate !== void 0)
    $$bindings.animate(animate);
  $$result.css.add(css$f);
  {
    {
      progress.set(value);
    }
  }
  $$unsubscribe_progress();
  return `<div class="progress-bar svelte-1hge3kc" style="${"width: " + escape(width, true) + "%;"}"><div class="${["progress-bar__fill svelte-1hge3kc", animate ? "animate" : ""].join(" ").trim()}" style="${"max-width: " + escape($progress - 2, true) + "%;"}"></div> </div>`;
});
const Skills_svelte_svelte_type_style_lang = "";
const css$e = {
  code: ".skill-set.svelte-1auk4bn.svelte-1auk4bn.svelte-1auk4bn{display:flex;flex-direction:row;justify-content:space-evenly;gap:1em;background:var(--theme-bg);width:80vw;margin-left:auto;margin-right:auto;margin-top:1em;text-transform:uppercase;box-shadow:2px 4px 6px black,\n            -2px 4px 6px black;user-select:none}.skill-category.svelte-1auk4bn.svelte-1auk4bn.svelte-1auk4bn{--icon-gap:1vw;display:flex;flex-direction:column;gap:1em;position:relative;width:100%;backdrop-filter:contrast(1.25);padding:2rem}.skill-category.svelte-1auk4bn.svelte-1auk4bn.svelte-1auk4bn:nth-child(1){box-shadow:1px 2px 3px black;transform:translateX(calc(100% + 1em));transition:transform 400ms ease-in-out}.skill-category.svelte-1auk4bn.svelte-1auk4bn.svelte-1auk4bn:nth-child(2){box-shadow:-1px 2px 3px black;transform:translateX(calc((100% + 1em) * -1));transition:transform 400ms ease-in-out}.clearTX.svelte-1auk4bn.svelte-1auk4bn.svelte-1auk4bn{transform:none !important}.skill-category.svelte-1auk4bn .title-holder.svelte-1auk4bn.svelte-1auk4bn{position:relative;width:100%;padding-left:2rem;padding-right:2rem;margin-left:-2rem;margin-top:-2rem;background:var(--theme-primary);box-shadow:0px 2px 4px black;display:flex;flex-direction:row;justify-content:center;align-items:center;gap:var(--icon-gap)}.skill-category.svelte-1auk4bn .title-holder.svelte-1auk4bn>.svelte-1auk4bn{filter:drop-shadow(2px 4px 6px black)}.skill.svelte-1auk4bn.svelte-1auk4bn.svelte-1auk4bn{display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start}.skill.svelte-1auk4bn>div.svelte-1auk4bn.svelte-1auk4bn{display:flex;flex-direction:row;justify-content:flex-start;align-items:center;gap:var(--icon-gap);filter:drop-shadow(2px 4px 6px black)}.skill-category.svelte-1auk4bn img.svelte-1auk4bn.svelte-1auk4bn{width:2vw;height:2vw}@media screen and (max-width: 640px){.skill-set.svelte-1auk4bn.svelte-1auk4bn.svelte-1auk4bn{flex-direction:column}.skill-category.svelte-1auk4bn.svelte-1auk4bn.svelte-1auk4bn{--icon-gap:2vw;padding-left:4vw;padding-right:4vw;width:auto}.skill-category.svelte-1auk4bn .title-holder.svelte-1auk4bn.svelte-1auk4bn{width:auto;margin-left:-4vw;margin-right:-4vw}.skill-category.svelte-1auk4bn.svelte-1auk4bn.svelte-1auk4bn:nth-child(1){box-shadow:1px 2px 3px black;transform:none}.skill-category.svelte-1auk4bn.svelte-1auk4bn.svelte-1auk4bn:nth-child(2){box-shadow:1px -2px 3px black;transform:translateY(calc((100% + 1em) * -1));transition-duration:3s}.skill.svelte-1auk4bn>div.svelte-1auk4bn.svelte-1auk4bn{margin-left:auto;margin-right:auto}.skill-category.svelte-1auk4bn img.svelte-1auk4bn.svelte-1auk4bn{width:8vw;height:8vw}}",
  map: null
};
const Skills = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $skills, $$unsubscribe_skills;
  const { skills } = Object.fromEntries(getContext("api"));
  $$unsubscribe_skills = subscribe(skills, (value) => $skills = value);
  let { inview = false } = $$props;
  if ($$props.inview === void 0 && $$bindings.inview && inview !== void 0)
    $$bindings.inview(inview);
  $$result.css.add(css$e);
  $$unsubscribe_skills();
  return `${$skills && $skills["Technical Skills"] && $skills["Soft Skills"] ? `<div class="container"><h1 class="font-effect-anaglyph" data-svelte-h="svelte-1dkvvbz">SKILLS</h1> <div class="skill-set svelte-1auk4bn"><div class="${["skill-category svelte-1auk4bn", inview ? "clearTX" : ""].join(" ").trim()}"><div class="title-holder svelte-1auk4bn" data-svelte-h="svelte-1l8s2j5"><img src="/icons/technical.png" alt="technical icon" class="svelte-1auk4bn"> <h2 class="svelte-1auk4bn">Technical Skills</h2></div> ${each($skills["Technical Skills"], (skill) => {
    return `<div class="skill svelte-1auk4bn"><div class="svelte-1auk4bn">${skill.icon ? `<img${add_attribute("src", skill.icon, 0)}${add_attribute("alt", skill.name, 0)} class="svelte-1auk4bn">` : ``} <h3>${escape(skill.name)}</h3></div> ${validate_component(Progressbar, "Progressbar").$$render($$result, { width: 100, value: skill.confidence }, {}, {})} </div>`;
  })}</div> <div class="${["skill-category svelte-1auk4bn", inview ? "clearTX" : ""].join(" ").trim()}"><div class="title-holder svelte-1auk4bn" data-svelte-h="svelte-sfgrle"><img src="/icons/soft-skills.png" alt="soft-skills icon" class="svelte-1auk4bn"> <h2 class="svelte-1auk4bn">Soft Skills</h2></div> ${each($skills["Soft Skills"], (skill) => {
    return `<div class="skill svelte-1auk4bn"><div class="svelte-1auk4bn">${skill.icon ? `<img${add_attribute("src", skill.icon, 0)}${add_attribute("alt", skill.name, 0)} class="svelte-1auk4bn">` : ``} <h3>${escape(skill.name)}</h3></div> ${validate_component(Progressbar, "Progressbar").$$render($$result, { width: 100, value: skill.confidence }, {}, {})} </div>`;
  })}</div></div></div>` : ``}`;
});
const IntersectionObserver_svelte_svelte_type_style_lang = "";
const css$d = {
  code: "div.svelte-1hzn8rv{width:100%;height:100%}",
  map: null
};
const IntersectionObserver_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { once = false } = $$props;
  let { top = 0 } = $$props;
  let { bottom = 0 } = $$props;
  let { left = 0 } = $$props;
  let { right = 0 } = $$props;
  let intersecting = false;
  let container;
  if ($$props.once === void 0 && $$bindings.once && once !== void 0)
    $$bindings.once(once);
  if ($$props.top === void 0 && $$bindings.top && top !== void 0)
    $$bindings.top(top);
  if ($$props.bottom === void 0 && $$bindings.bottom && bottom !== void 0)
    $$bindings.bottom(bottom);
  if ($$props.left === void 0 && $$bindings.left && left !== void 0)
    $$bindings.left(left);
  if ($$props.right === void 0 && $$bindings.right && right !== void 0)
    $$bindings.right(right);
  $$result.css.add(css$d);
  return `<div class="svelte-1hzn8rv"${add_attribute("this", container, 0)}>${slots.default ? slots.default({ intersecting }) : ``}</div>`;
});
const Listing_svelte_svelte_type_style_lang = "";
const css$c = {
  code: '.listing.svelte-f77s4l.svelte-f77s4l{position:relative;display:flex;flex-direction:column;max-width:80vw;box-shadow:2px 2px 2px 1px black;transition:transform 1s ease-in-out}.listing.svelte-f77s4l.svelte-f77s4l::before{content:" ";position:absolute;top:50%;left:100%;right:0;display:block;height:8px;width:5%;background:var(--theme-primary);z-index:3}.listing.svelte-f77s4l.svelte-f77s4l::after{content:attr(data-year);position:absolute;top:calc(43%);left:103%;right:0;display:block;height:20px;width:8%;padding:8px;background:var(--theme-bg);z-index:5}.titleHolder.svelte-f77s4l.svelte-f77s4l{display:flex;justify-content:center;align-items:center;padding:1vw 1vw;background-color:var(--theme-primary);box-shadow:0px 2px 4px black;z-index:1}.title.svelte-f77s4l.svelte-f77s4l{font-size:2.25vw;margin:0}.content.svelte-f77s4l.svelte-f77s4l{display:flex;align-items:stretch;background-color:var(--theme-bg);padding:0.5vw}.details.svelte-f77s4l.svelte-f77s4l{display:flex;flex-direction:column;justify-content:center;padding:1vw 2vw;width:100%;font-size:2vw}.from.svelte-f77s4l.svelte-f77s4l{display:flex;align-items:center;justify-content:center;gap:1vw;white-space:nowrap}.icon.svelte-f77s4l.svelte-f77s4l{width:2vw;height:2vw}.assetHolder.svelte-f77s4l.svelte-f77s4l{position:relative;width:20vw;height:auto}.asset.svelte-f77s4l.svelte-f77s4l{position:relative;width:100%;height:100%;transition:transform 0.5s ease-in-out}.fallback.svelte-f77s4l.svelte-f77s4l{background:repeating-linear-gradient(\n            45deg,\n            #babbbf,\n            #c3c3c3 10px,\n            #929292 10px,\n            #e1e1e1 20px\n        );position:relative;display:flex;align-items:center;justify-content:center;width:20vw;height:auto;font-size:2vw;color:rgba(255, 255, 255, 0.25);user-select:none}.fallback.svelte-f77s4l>span.svelte-f77s4l{padding:2vw}.mobile-only.svelte-f77s4l.svelte-f77s4l{display:none}.zoom.svelte-f77s4l.svelte-f77s4l{position:absolute;top:250%;bottom:0;left:150%;right:0;width:16vw;height:12vw;transform:scale(3);border:2px solid var(--theme-primary);box-shadow:2px 2px 4px 0px rgba(0,0,0,0.75),\n            -2px 2px 4px 0px rgba(0,0,0,0.75),\n            2px -2px 4px 0px rgba(0,0,0,0.75),\n            -2px -2px 4px 0px rgba(0,0,0,0.75);z-index:99}.glow.svelte-f77s4l.svelte-f77s4l{animation:svelte-f77s4l-glow 1s ease-in-out infinite alternate}@keyframes svelte-f77s4l-glow{from{box-shadow:2px 2px 4px 0px rgba(0,0,0,0.75),\n                -2px 2px 4px 0px rgba(0,0,0,0.75),\n                2px -2px 4px 0px rgba(0,0,0,0.75),\n                -2px -2px 4px 0px rgba(0,0,0,0.75)}to{box-shadow:2px 2px 4px 0px rgba(0,0,0,0.75),\n                -2px 2px 4px 0px rgba(0,0,0,0.75),\n                2px -2px 4px 0px rgba(0,0,0,0.75),\n                -2px -2px 4px 0px rgba(0,0,0,0.75),\n                0px 0px 20px 0px rgba(255,255,255,0.75)}}.backdrop.svelte-f77s4l.svelte-f77s4l{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0, 0, 0, 0.5);z-index:98}@media screen and (max-width: 640px){.listing.svelte-f77s4l.svelte-f77s4l::before,.listing.svelte-f77s4l.svelte-f77s4l::after{display:none}.title.svelte-f77s4l.svelte-f77s4l{font-size:5vw}.details.svelte-f77s4l.svelte-f77s4l{font-size:4vw}.icon.svelte-f77s4l.svelte-f77s4l{width:4vw;height:4vw}.assetHolder.svelte-f77s4l.svelte-f77s4l,.fallback.svelte-f77s4l.svelte-f77s4l{width:30vw}.fallback.svelte-f77s4l>span.svelte-f77s4l{padding:5vw}.mobile-only.svelte-f77s4l.svelte-f77s4l{display:block;color:#888}.zoom.svelte-f77s4l.svelte-f77s4l{width:28vw;height:21vw;left:125%}}',
  map: null
};
const Listing = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name, type, from, year, idx } = $$props;
  let { image = null } = $$props;
  let { assetZoomable = true } = $$props;
  let { inview = false } = $$props;
  let zoomable;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.from === void 0 && $$bindings.from && from !== void 0)
    $$bindings.from(from);
  if ($$props.year === void 0 && $$bindings.year && year !== void 0)
    $$bindings.year(year);
  if ($$props.idx === void 0 && $$bindings.idx && idx !== void 0)
    $$bindings.idx(idx);
  if ($$props.image === void 0 && $$bindings.image && image !== void 0)
    $$bindings.image(image);
  if ($$props.assetZoomable === void 0 && $$bindings.assetZoomable && assetZoomable !== void 0)
    $$bindings.assetZoomable(assetZoomable);
  if ($$props.inview === void 0 && $$bindings.inview && inview !== void 0)
    $$bindings.inview(inview);
  $$result.css.add(css$c);
  return `<div class="listing svelte-f77s4l"${add_attribute("data-year", year, 0)}${add_attribute(
    "style",
    !inview && idx > 0 ? `transform: translateY(calc((100% + 2vw) * -${idx})` : "",
    0
  )}><div class="${["svelte-f77s4l", ""].join(" ").trim()}"></div> <div class="titleHolder svelte-f77s4l"><h2 class="title svelte-f77s4l">${escape(type === "Achievement" ? "🏆" : "📜")} ${escape(name)}</h2></div> <div class="content svelte-f77s4l">${image ? `<div class="assetHolder svelte-f77s4l">${assetZoomable ? `<button class="image-button" title="Click to zoom" style="border: none; background: none; padding: 0; cursor: pointer;"><img${add_attribute("src", image, 0)}${add_attribute("alt", name, 0)} class="${[
    "asset svelte-f77s4l",
    " glow"
  ].join(" ").trim()}"${add_attribute("this", zoomable, 0)}></button>` : `<img${add_attribute("src", image, 0)}${add_attribute("alt", name, 0)} class="${["asset svelte-f77s4l", ""].join(" ").trim()}"${add_attribute("this", zoomable, 0)}>`}</div>` : `<div class="fallback svelte-f77s4l" data-svelte-h="svelte-14tj1sf"><span class="svelte-f77s4l">No Image for this one...</span></div>`} <div class="details svelte-f77s4l"><div class="from svelte-f77s4l"><img${add_attribute("src", from.icon, 0)}${add_attribute("alt", from.name, 0)} class="icon svelte-f77s4l"> <span>${escape(from.name)}</span></div> <span class="mobile-only svelte-f77s4l">${escape(year)}</span></div></div> </div>`;
});
const Achievements_svelte_svelte_type_style_lang = "";
const { Object: Object_1 } = globals;
const css$b = {
  code: '.container.svelte-1i6hj6q{display:flex;flex-direction:column;align-items:center;justify-content:center;margin-left:auto;margin-right:auto}.contents.svelte-1i6hj6q{position:relative;display:flex;flex-direction:column;align-items:stretch;justify-content:center;margin-top:1em;gap:2vw}.contents.svelte-1i6hj6q::before{position:absolute;right:-8%;top:-5%;bottom:-5%;content:" ";display:block;width:8px;background:linear-gradient(\n            to bottom,\n            rgba(80,80,80,0) 0%,\n            rgb(167 63 63) 4%,\n            rgb(70 21 21) 96%,\n            rgba(80,80,80,0) 100%\n        )}@media screen and (max-width: 640px){.contents.svelte-1i6hj6q::before{display:none}}',
  map: null
};
const Achievements = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $achievements, $$unsubscribe_achievements;
  const { achievements } = Object.fromEntries(getContext("api"));
  $$unsubscribe_achievements = subscribe(achievements, (value) => $achievements = value);
  $$result.css.add(css$b);
  $$unsubscribe_achievements();
  return `${validate_component(IntersectionObserver_1, "IntersectionObserver").$$render($$result, {}, {}, {
    default: ({ intersecting }) => {
      return `<div class="container svelte-1i6hj6q"><h1 class="font-effect-anaglyph" data-svelte-h="svelte-xk9o1x">Achievements &amp; Certificates</h1> <div class="contents svelte-1i6hj6q">${$achievements ? `${each($achievements, (data, idx) => {
        return `${validate_component(Listing, "Listing").$$render($$result, Object_1.assign({}, data, { idx }, { inview: intersecting }), {}, {})}`;
      })}` : ``}</div></div>`;
    }
  })}`;
});
const Footer_svelte_svelte_type_style_lang = "";
const css$a = {
  code: 'footer.svelte-1nd74h8.svelte-1nd74h8{position:absolute;left:0;right:0;bottom:0;padding:1rem;background:var(--theme-bg);user-select:none;box-shadow:0px -2px 4px 1px black}.content.svelte-1nd74h8.svelte-1nd74h8{display:flex;flex-direction:row;align-items:center;justify-content:space-evenly}.socials.svelte-1nd74h8.svelte-1nd74h8{display:flex;justify-content:center;align-items:center;gap:1vw}.social.svelte-1nd74h8.svelte-1nd74h8,.social.svelte-1nd74h8.svelte-1nd74h8:visited,.social.svelte-1nd74h8.svelte-1nd74h8:active{text-decoration:none;color:#eee}.social.svelte-1nd74h8.svelte-1nd74h8{position:relative;display:flex;align-items:center;justify-content:center;gap:1vw;padding:0.5rem 0.75rem;border:2px solid black;box-shadow:0px 3px 2px 0px black;transition:all 0.25s ease-in-out}.social.svelte-1nd74h8.svelte-1nd74h8::after{content:"";position:absolute;width:100%;height:100%;background:inherit;backdrop-filter:brightness(0.5);z-index:0;transform-origin:left;transition:transform 0.25s ease-in-out}.social.svelte-1nd74h8>.svelte-1nd74h8{z-index:2}.social.svelte-1nd74h8.svelte-1nd74h8:hover{transform:scale(1.1)}.social.svelte-1nd74h8.svelte-1nd74h8:hover::after{transform:scaleX(0)}.social.svelte-1nd74h8.svelte-1nd74h8:active{box-shadow:none}.social.svelte-1nd74h8 .icon.svelte-1nd74h8{width:2vw;height:2vw;cursor:pointer}.social.svelte-1nd74h8 .social-name.svelte-1nd74h8{--base-font-size:1.5vw;font-size:var(--base-font-size)}.copyright.svelte-1nd74h8.svelte-1nd74h8{--base-font-size:2vw;font-size:var(--base-font-size)}.copyright.svelte-1nd74h8 span.svelte-1nd74h8:last-child{font-size:calc(var(--base-font-size) * 0.8);filter:brightness(0.5)}@media screen and (max-width: 640px){footer.svelte-1nd74h8.svelte-1nd74h8{padding:2vw}.social.svelte-1nd74h8 .icon.svelte-1nd74h8{width:4vw;height:4vw}.social.svelte-1nd74h8 .social-name.svelte-1nd74h8{--base-font-size:3vw;font-size:var(--base-font-size)}.copyright.svelte-1nd74h8.svelte-1nd74h8{--base-font-size:3vw}}',
  map: null
};
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $socials, $$unsubscribe_socials;
  const { socials } = Object.fromEntries(getContext("api"));
  $$unsubscribe_socials = subscribe(socials, (value) => $socials = value);
  $$result.css.add(css$a);
  $$unsubscribe_socials();
  return `<footer class="svelte-1nd74h8"><div class="content svelte-1nd74h8"><div class="socials svelte-1nd74h8">${$socials ? `${each($socials, (social) => {
    return `${social.url && social.icon ? `<a${add_attribute("href", social.url, 0)} target="_blank" rel="noopener noreferrer" class="social svelte-1nd74h8"><img class="icon svelte-1nd74h8"${add_attribute("src", social.icon, 0)}${add_attribute("alt", social.name, 0)}${add_attribute("title", social.name, 0)}> <span class="social-name svelte-1nd74h8">${escape(social.name)}</span> </a>` : ``}`;
  })}` : ``}</div> <div class="copyright svelte-1nd74h8"><span class="svelte-1nd74h8" data-svelte-h="svelte-1ky6mv6">© Harshith Thota</span> <span class="svelte-1nd74h8">${escape((/* @__PURE__ */ new Date()).getFullYear())}</span></div></div> </footer>`;
});
const Typewriter_svelte_svelte_type_style_lang = "";
const css$9 = {
  code: "p.svelte-xl9oit{margin:0}.cursor.svelte-xl9oit{animation:svelte-xl9oit-blink 0.5s infinite ease-in-out}@keyframes svelte-xl9oit-blink{0%,100%{border-right:6px solid #ffffff2c}50%{border-right:6px solid #ffffffa5}}",
  map: null
};
const throttler = 10;
const Typewriter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $firstRender, $$unsubscribe_firstRender;
  let { data } = $$props;
  let { needToType = false } = $$props;
  let { callback } = $$props;
  let { cleaner } = $$props;
  let content = "";
  let textHolder;
  let rafId;
  let counter2 = 0;
  const firstRender = writable(true);
  $$unsubscribe_firstRender = subscribe(firstRender, (value) => $firstRender = value);
  const type = () => {
    if (content.length === data.length) {
      cancelAnimationFrame(rafId);
      set_store_value(firstRender, $firstRender = false, $firstRender);
      if (callback) {
        callback();
      } else {
        needToType = true;
      }
      return;
    }
    if (counter2++ % throttler === 0) {
      content = data.slice(0, content.length + 1);
    }
    rafId = requestAnimationFrame(type);
  };
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.needToType === void 0 && $$bindings.needToType && needToType !== void 0)
    $$bindings.needToType(needToType);
  if ($$props.callback === void 0 && $$bindings.callback && callback !== void 0)
    $$bindings.callback(callback);
  if ($$props.cleaner === void 0 && $$bindings.cleaner && cleaner !== void 0)
    $$bindings.cleaner(cleaner);
  $$result.css.add(css$9);
  {
    if (needToType) {
      if ($firstRender) {
        needToType = false;
        content = "";
        rafId = requestAnimationFrame(type);
      } else {
        const sleeper = new Promise((resolve) => setTimeout(resolve, 100));
        sleeper.then(() => {
          needToType = false;
          content = "";
          rafId = requestAnimationFrame(type);
        });
      }
    }
  }
  {
    if (cleaner) {
      content = "";
    }
  }
  $$unsubscribe_firstRender();
  return `<p class="svelte-xl9oit"><span${add_attribute("this", textHolder, 0)}></span><span class="${[
    "svelte-xl9oit",
    content.length > 0 && content.length !== data.length ? "cursor" : ""
  ].join(" ").trim()}"></span></p>`;
});
const Header_svelte_svelte_type_style_lang = "";
const css$8 = {
  code: '.header.svelte-rxdrub.svelte-rxdrub{display:flex;flex-direction:row;align-items:center;width:100%;text-align:center;justify-content:space-around}.header.svelte-rxdrub>div.svelte-rxdrub{display:flex;flex-direction:column;align-items:center;justify-content:center}.nameHolder.svelte-rxdrub.svelte-rxdrub{position:relative;overflow:hidden;width:20ch;font-size:2.25vw}.name.svelte-rxdrub.svelte-rxdrub{display:inline;position:relative;transition:all 1s ease}.name.svelte-rxdrub>.svelte-rxdrub{overflow:hidden;display:inline-block;vertical-align:middle}.cap.svelte-rxdrub.svelte-rxdrub{font-size:3.5vw;color:var(--theme-primary);font-family:"Exo", monospace;text-shadow:0px 0px 0 rgb(137,-14,0),\n            1px 1px 0 rgb(115,-36,0),\n            2px 2px 0 rgb(92,-59,0),\n            3px 3px 0 rgb(70,-81,0),\n            4px 4px 0 rgb(48,-103,0),\n            5px 5px  0 rgb(26,-125,0),\n            6px 6px 5px rgba(0,0,0,1),\n            6px 6px 1px rgba(0,0,0,0.5),\n            0px 0px 5px rgba(0,0,0,.2);animation:none}.name.firstname.svelte-rxdrub>span.svelte-rxdrub:not(.cap){animation:svelte-rxdrub-slide 3s ease infinite}.name.lastname.svelte-rxdrub>span.svelte-rxdrub:not(.cap){display:inline-block;animation:svelte-rxdrub-squeeze 3s ease infinite;transform-origin:left}.name.svelte-rxdrub>span.cap.svelte-rxdrub{display:inline}code.svelte-rxdrub.svelte-rxdrub{font-size:1.5vw;color:grey;animation:svelte-rxdrub-recenter 3s ease infinite}.codeChild.svelte-rxdrub.svelte-rxdrub{display:inline-block;position:relative;background:#151515;transform-style:preserve-3d;animation:svelte-rxdrub-flipper 3s ease infinite}.codeChild.svelte-rxdrub.svelte-rxdrub::after{content:attr(data-switched);text-align:var(--align);display:inline-block;position:absolute;left:1vw;right:0;top:0;bottom:0;width:100%;height:100%;background:#151515;transform-style:preserve-3d;transform:rotateX(270deg) translateZ(1em)}@keyframes svelte-rxdrub-slide{0%{width:0%;opacity:0}50%{width:7ch;opacity:1}100%{width:0%;opacity:0}}@keyframes svelte-rxdrub-squeeze{0%{transform:scaleX(0);opacity:0}50%{transform:scaleX(1);opacity:1}100%{transform:scaleX(0);opacity:0}}@keyframes svelte-rxdrub-recenter{0%{transform:translateX(-3.5ch)}50%{transform:translateX(0)}100%{transform:translateX(-3.5ch)}}@keyframes svelte-rxdrub-flipper{0%,100%{transform:rotateX(90deg);color:var(--theme-bg)}50%{transform:rotateX(0);color:currentColor}}.headerRight.svelte-rxdrub.svelte-rxdrub{gap:1rem}img.svelte-rxdrub.svelte-rxdrub{width:8vw;height:8vw;border-radius:50%;object-fit:cover;border:4px solid #fff;box-shadow:0 2px 4px rgba(0, 0, 0, 0.2)}.socials.svelte-rxdrub.svelte-rxdrub{display:flex;justify-content:center;align-items:center;gap:1vw}.social.svelte-rxdrub.svelte-rxdrub,.social.svelte-rxdrub.svelte-rxdrub:visited,.social.svelte-rxdrub.svelte-rxdrub:active{text-decoration:none;color:#eee}.social.svelte-rxdrub.svelte-rxdrub{position:relative;display:flex;align-items:center;justify-content:center;gap:1vw;transition:all 0.25s ease-in-out}.social.svelte-rxdrub>.svelte-rxdrub{z-index:2}.social.svelte-rxdrub.svelte-rxdrub:hover{transform:scale(1.1)}.social.svelte-rxdrub.svelte-rxdrub:active{box-shadow:none}.social.svelte-rxdrub .icon.svelte-rxdrub{width:2vw;height:2vw;cursor:pointer}@media screen and (max-width: 640px){code.svelte-rxdrub.svelte-rxdrub,.nameHolder.svelte-rxdrub .svelte-rxdrub{animation:none !important}.nameHolder.svelte-rxdrub.svelte-rxdrub{display:flex;flex-direction:column;align-items:flex-start;width:100%;font-size:4vw;line-height:1}.cap.svelte-rxdrub.svelte-rxdrub{font-size:6vw}code.svelte-rxdrub.svelte-rxdrub{font-size:3vw}.headerRight.svelte-rxdrub.svelte-rxdrub{gap:2rem}img.svelte-rxdrub.svelte-rxdrub{width:16vw;height:16vw}.socials.svelte-rxdrub.svelte-rxdrub{gap:2vw}.social.svelte-rxdrub .icon.svelte-rxdrub{width:4vw;height:4vw}}',
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { socials } = $$props;
  if ($$props.socials === void 0 && $$bindings.socials && socials !== void 0)
    $$bindings.socials(socials);
  $$result.css.add(css$8);
  return `<div class="header svelte-rxdrub"><div class="headerLeft svelte-rxdrub" data-svelte-h="svelte-4jquul"><div class="nameHolder svelte-rxdrub"><div class="name firstname svelte-rxdrub"><span class="cap svelte-rxdrub">H</span> <span class="svelte-rxdrub">ARSHITH</span></div> <div class="name lastname svelte-rxdrub"><span class="cap svelte-rxdrub">T</span> <span class="svelte-rxdrub">HOTA</span></div></div> <code class="svelte-rxdrub"><div class="codeChild svelte-rxdrub" data-switched="🐍 " style="--align: right;">PYTHON</div> <div class="codeChild svelte-rxdrub" data-switched="👨‍💻" style="--align: left;">DEVELOPER</div></code></div> <div class="headerRight svelte-rxdrub"><img src="https://avatars.githubusercontent.com/u/29298411?v=4" alt="Avatar" class="svelte-rxdrub"> <div class="socials svelte-rxdrub">${socials ? `${each(socials, (social) => {
    return `${social.url && social.icon ? `<a${add_attribute("href", social.url, 0)} target="_blank" rel="noopener noreferrer" class="social svelte-rxdrub"><img class="icon svelte-rxdrub"${add_attribute("src", social.icon, 0)}${add_attribute("alt", social.name, 0)}${add_attribute("title", social.name, 0)}> </a>` : ``}`;
  })}` : ``}</div></div> </div>`;
});
const TextSphere_svelte_svelte_type_style_lang = "";
const css$7 = {
  code: ".holder.svelte-gl5rqr{display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;height:100%;font-size:1vw}.tagcloud{width:30vw !important;height:30vw !important}@media screen and (max-width: 600px){.holder.svelte-gl5rqr{font-size:2.5vw}.tagcloud{width:50vw !important;height:50vw !important}}",
  map: null
};
const TextSphere = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { tags } = $$props;
  let binder;
  const colors = [
    "#ddd",
    "#bf2828",
    "#bf2828",
    "#bf2828",
    "#bf2828",
    "#bf5a28",
    "#bf8c28",
    "#bfbe28",
    "#8cbf28",
    "#5abf28",
    "#28bf28",
    "#28bf5a",
    "#28bf8c",
    "#28bfbe",
    "#289cbf",
    "#285abf",
    "#2828bf",
    "#5a28bf",
    "#8c28bf",
    "#be28bf"
  ];
  if ($$props.tags === void 0 && $$bindings.tags && tags !== void 0)
    $$bindings.tags(tags);
  $$result.css.add(css$7);
  {
    if (tags?.length > 0 && binder) {
      TagCloud("span[class~=holder]", tags, {
        radius: window.innerWidth > 600 ? 300 : 100,
        maxSpeed: "fast",
        initSpeed: "fast",
        direction: 135,
        keep: true
      });
      document.querySelectorAll("span.tagcloud--item").forEach((elem) => {
        elem.style.color = colors[Math.floor(Math.random() * colors.length)];
      });
    }
  }
  return `<span class="holder svelte-gl5rqr"${add_attribute("this", binder, 0)}></span>`;
});
const SkillTable_svelte_svelte_type_style_lang = "";
const css$6 = {
  code: ".container.svelte-8b1vcn.svelte-8b1vcn{display:flex;flex-direction:column;justify-content:center;width:75vw;height:100%;margin:0 auto;font-family:monospace;text-align:center;transition:all 1s ease-in-out}.header.svelte-8b1vcn.svelte-8b1vcn{background-color:#1a1a1a;color:#ddd;padding:8px;border:1px solid #ddd}.section.svelte-8b1vcn.svelte-8b1vcn{overflow:hidden;max-height:0;border:1px solid #ddd;transition:max-height 1s cubic-bezier(0, 1, 0, 1)}.interests.svelte-8b1vcn.svelte-8b1vcn{box-shadow:0px -2px 4px 2px #000000;transform:translateY(-100%);transition:transform 2s ease-in-out}.invisible.svelte-8b1vcn.svelte-8b1vcn{opacity:0;transition:all 1s ease-in-out}.slid.svelte-8b1vcn.svelte-8b1vcn{transform:none}.section.shown.svelte-8b1vcn.svelte-8b1vcn{max-height:1000px;transition:max-height 1s ease-in-out}.row.svelte-8b1vcn.svelte-8b1vcn{display:flex;flex-direction:row;justify-content:center;background-color:#ddd;color:#000}.cell.svelte-8b1vcn.svelte-8b1vcn{border:1px solid #000;padding:0.5em;flex:1 1 0}.row.svelte-8b1vcn.svelte-8b1vcn:nth-child(even){background-color:#000;color:#ddd}.row.svelte-8b1vcn:nth-child(even) .cell.svelte-8b1vcn{border:1px solid #ddd}",
  map: null
};
function getSkills(exprnc, proj = []) {
  let skills = [];
  exprnc.forEach((exp) => {
    if (exp.skills) {
      const nonInternalSkills = exp.skills.filter((skill) => !["internal", "proprietary", "private"].some((keyword) => skill.toLowerCase().includes(keyword)));
      skills = [...skills, ...nonInternalSkills];
    }
    if (exp.children) {
      skills = [...skills, ...getSkills(exp.children)];
    }
  });
  proj.forEach((prj) => {
    skills = [...skills, ...prj.tags || []];
  });
  return skills;
}
const SkillTable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $projects, $$unsubscribe_projects;
  let $experience, $$unsubscribe_experience;
  let { show } = $$props;
  let tags;
  const { experience, projects } = Object.fromEntries(getContext("api"));
  $$unsubscribe_experience = subscribe(experience, (value) => $experience = value);
  $$unsubscribe_projects = subscribe(projects, (value) => $projects = value);
  if ($$props.show === void 0 && $$bindings.show && show !== void 0)
    $$bindings.show(show);
  $$result.css.add(css$6);
  {
    if ($experience.length > 0 && $projects.length > 0) {
      tags = [...new Set(getSkills($experience, $projects))];
    }
  }
  $$unsubscribe_projects();
  $$unsubscribe_experience();
  return `<div class="container svelte-8b1vcn"><div class="${["category skills svelte-8b1vcn", !show ? "invisible" : ""].join(" ").trim()}"><div class="header svelte-8b1vcn" data-svelte-h="svelte-t4v44d"><span>Skills</span></div> <div class="${["section svelte-8b1vcn", show ? "shown" : ""].join(" ").trim()}">${validate_component(TextSphere, "TextSphere").$$render($$result, { tags }, {}, {})}</div></div> <div class="${[
    "category interests svelte-8b1vcn",
    (show ? "slid" : "") + " " + (!show ? "invisible" : "")
  ].join(" ").trim()}"><div class="header svelte-8b1vcn" data-svelte-h="svelte-zv93j0"><span>Interests</span></div> <div class="${["section svelte-8b1vcn", show ? "shown" : ""].join(" ").trim()}" data-svelte-h="svelte-na24yi"><div class="row svelte-8b1vcn"><div class="cell svelte-8b1vcn">Cybersecurity</div></div> <div class="row svelte-8b1vcn"><div class="cell svelte-8b1vcn">Artificial Intelligence</div></div> <div class="row svelte-8b1vcn"><div class="cell svelte-8b1vcn">Data Science</div></div> <div class="row svelte-8b1vcn"><div class="cell svelte-8b1vcn">Automation Systems</div></div></div></div> </div>`;
});
const About_svelte_svelte_type_style_lang = "";
const css$5 = {
  code: ".about.svelte-16f43dv{--grey:rgba(24, 24, 24, 1);display:flex;flex-direction:column;align-items:center;background-image:radial-gradient(circle, rgba(24,24,24,0.5) 60%, rgba(0,0,0,1) 120%);color:#fff;width:80vw;height:100%;margin-left:auto;margin-right:auto;margin-top:1em;min-height:80vh;padding:1.5rem 0;border:10px solid var(--theme-primary);box-shadow:2px 2px 2px 2px black,\n            -2px -2px 2px 2px black;user-select:none}.content.svelte-16f43dv{display:flex;align-items:center;justify-content:flex-start;width:80vw;height:100%}.description.svelte-16f43dv{position:relative;display:flex;flex-direction:column;align-items:flex-start;height:100%;gap:1rem;font-size:1.5vw;text-align:start;color:#ccc;font-family:monospace;white-space:pre-line;padding:0 1.5rem;margin-bottom:auto}@media screen and (max-width: 640px){.about.svelte-16f43dv{width:80vw;border:5px solid var(--theme-primary);margin-left:auto;margin-right:auto}.description.svelte-16f43dv{font-size:3.5vw;width:88vw;padding:0 2vw}.description.svelte-16f43dv::after{display:none}}",
  map: null
};
const About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let yearsElapsed;
  let data;
  let $experience, $$unsubscribe_experience;
  let $socials, $$unsubscribe_socials;
  let { inview } = $$props;
  const { experience } = Object.fromEntries(getContext("api"));
  $$unsubscribe_experience = subscribe(experience, (value) => $experience = value);
  let start = new Date(2019, 0, 2);
  let end = /* @__PURE__ */ new Date();
  let needToType = false;
  let typeNextPara = false;
  let cleanContent = false;
  let showSkills = false;
  const { socials } = Object.fromEntries(getContext("api"));
  $$unsubscribe_socials = subscribe(socials, (value) => $socials = value);
  if ($$props.inview === void 0 && $$bindings.inview && inview !== void 0)
    $$bindings.inview(inview);
  $$result.css.add(css$5);
  {
    if ($experience.length > 0) {
      start = new Date(firstExpJob($experience).year.split(" – ")[0]);
      end = extractEndYear($experience[0]);
    }
  }
  yearsElapsed = ((end - start) / (1e3 * 60 * 60 * 24 * 365)).toFixed(1);
  data = [
    `Hey there! 👋 Glad to see you checkout my portfolio.
        I'm an enthusiastic Python Developer with ${yearsElapsed} years of professional experience in developing various applications using the latest technologies and industry practices.
        I have worked on applications ranging from Satellite Communication systems to Cloud ECommerce websites to Payment Gateways.
        I also have a bit of Frontend and CI/CD experience from my hobby projects.`,
    `I'm actively looking for interesting projects to collaborate on.
        Let's build something amazing together!`
  ];
  {
    if (inview) {
      needToType = true;
      cleanContent = false;
    } else {
      cleanContent = true;
      showSkills = false;
    }
  }
  $$unsubscribe_experience();
  $$unsubscribe_socials();
  return `<h1 class="font-effect-anaglyph" data-svelte-h="svelte-pv4dt0">About</h1> <div class="about svelte-16f43dv">${validate_component(Header, "Header").$$render($$result, { socials: $socials }, {}, {})} <div class="content svelte-16f43dv"><div class="description svelte-16f43dv">${validate_component(Typewriter, "Typewriter").$$render(
    $$result,
    {
      data: data[0],
      needToType,
      callback: () => {
        needToType = false;
        showSkills = true;
        setTimeout(
          () => {
            typeNextPara = true;
          },
          2100
        );
      },
      cleaner: cleanContent
    },
    {},
    {}
  )} ${validate_component(SkillTable, "SkillTable").$$render($$result, { show: showSkills }, {}, {})} ${validate_component(Typewriter, "Typewriter").$$render(
    $$result,
    {
      data: data[1],
      needToType: typeNextPara,
      callback: () => {
        typeNextPara = false;
      },
      cleaner: cleanContent
    },
    {},
    {}
  )}</div></div> </div>`;
});
const Mobile_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: "svg.svelte-g91zfs{display:inline-block;position:absolute;animation:svelte-g91zfs-rotate90 1s linear infinite;transform-origin:center;transition:all 1s ease}@keyframes svelte-g91zfs-rotate90{0%,20%{transform:rotate(0deg)}40%,60%{transform:rotate(90deg)}80%,100%{scale:0}}",
  map: null
};
const Mobile = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$4);
  return `<svg version="1.1" id="mobileIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" width="30vw" height="30vw" class="svelte-g91zfs"><path style="fill:#2D2D33;" d="M267.36,22.649v466.702c0,12.432-10.146,22.649-22.577,22.649H22.577
            c-1.429,0-2.787-0.143-4.144-0.429c-9.074-1.643-16.29-8.931-18.005-18.005C0.143,492.209,0,490.78,0,489.351V22.649
            C0,10.217,10.146,0,22.577,0h222.205c1.572,0,3.072,0.143,4.572,0.5c8.717,1.786,15.719,8.788,17.505,17.505
            c0,0.072,0,0.072,0,0.072C267.217,19.577,267.36,21.077,267.36,22.649z"></path><path style="fill:#1E1F21;" d="M168.045,42.771H99.314c-2.843,0-5.169-2.326-5.169-5.169v0c0-2.843,2.326-5.169,5.169-5.169
            h68.731c2.843,0,5.169,2.326,5.169,5.169v0C173.214,40.445,170.888,42.771,168.045,42.771z"></path><path style="fill:#121313;" d="M173.031,35.559c-0.861-0.701-1.953-1.122-3.145-1.122H100.85c-2.755,0-5.018,2.254-5.018,5.018
            v0.301c0,0.671,0.14,1.312,0.391,1.903c-1.152-0.911-1.893-2.334-1.893-3.907v-0.3c0-2.765,2.264-5.019,5.018-5.019h69.036
            C170.477,32.433,172.28,33.726,173.031,35.559z"></path><circle style="fill:#1E1F21;" cx="133.68" cy="473.707" r="20.531"></circle><path style="fill:#121313;" d="M151.675,460.949c-3.416-2.674-7.713-4.267-12.381-4.267c-11.099,0-20.104,9.005-20.104,20.114
            c0,4.658,1.583,8.945,4.247,12.351c-4.718-3.676-7.753-9.416-7.753-15.857c0-11.109,9.005-20.114,20.114-20.114
            C142.249,453.176,147.999,456.221,151.675,460.949z"></path><polygon style="opacity:0.3;fill:#F4F4F5;" points="17.428,66.043 17.428,380.991 17.428,381.492 17.428,434.414 249.931,434.414
            249.931,381.492 249.931,380.991 249.931,66.043"></polygon><linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="133.6799" y1="434.414" x2="133.6799" y2="66.0431"><stop offset="0.1304" style="stop-color:#A9DBE5"></stop><stop offset="1" style="stop-color:#A9DBE5"></stop></linearGradient><rect x="17.428" y="66.043" style="fill:url(#SVGID_1_);" width="232.503" height="368.371"></rect><rect x="17.428" y="381.492" style="opacity:0.2;fill:#F4F4F5;" width="232.503" height="52.922"></rect><rect x="17.428" y="380.991" style="opacity:0.2;fill:#F4F4F5;" width="232.503" height="0.501"></rect><rect x="17.428" y="380.991" style="opacity:0.2;fill:#F4F4F5;" width="232.503" height="0.501"></rect><g style="opacity:0.4;"><rect x="49" y="127" style="fill:#F4F4F5;" width="172" height="79"></rect><polygon style="fill:#F4F4F5;" points="128.015,227 49,227 49,220 148.048,220"></polygon><polygon style="fill:#F4F4F5;" points="151.053,106 92,106 92,99 171.087,99"></polygon><polygon style="fill:#F4F4F5;" points="206.146,256 49,256 49,249 226.179,249"></polygon><polygon style="fill:#F4F4F5;" points="206.146,285 49,285 49,270 226.179,270"></polygon><polygon style="fill:#F4F4F5;" points="206.146,306 49,306 49,299 226.179,299"></polygon><polygon style="fill:#F4F4F5;" points="206.146,335 49,335 49,327 226.179,327"></polygon><polygon style="fill:#F4F4F5;" points="184.109,356 49,356 49,349 204.143,349"></polygon><path style="fill:#F4F4F5;" d="M63.166,84.618l14.521,13.476c0.866,0.804,0.866,2.175,0,2.979l-14.521,13.476
                    c-0.779,0.723-1.985,0.723-2.764,0l-14.521-13.476c-0.866-0.804-0.866-2.175,0-2.979l14.521-13.476
                    C61.181,83.894,62.387,83.894,63.166,84.618z"></path><polygon style="fill:#F4F4F5;" points="202.105,78.252 205.606,81.501 202.105,84.75 198.604,81.501"></polygon><polygon style="fill:#F4F4F5;" points="213.438,78.252 216.939,81.501 213.438,84.75 209.936,81.501"></polygon><polygon style="fill:#F4F4F5;" points="190.772,78.252 194.273,81.501 190.772,84.75 187.271,81.501"></polygon><path style="opacity:0.3;fill:#F4F4F5;" d="M47.16,427.903L47.16,427.903c-10.33,0-18.781-8.452-18.781-18.781l0,0
                    c0-10.33,8.452-18.782,18.781-18.782h0c10.33,0,18.781,8.452,18.781,18.782l0,0C65.941,419.451,57.49,427.903,47.16,427.903z"></path><path style="opacity:0.3;fill:#F4F4F5;" d="M104.84,427.903L104.84,427.903c-10.33,0-18.781-8.452-18.781-18.781l0,0
                    c0-10.33,8.452-18.782,18.781-18.782l0,0c10.33,0,18.782,8.452,18.782,18.782l0,0
                    C123.621,419.451,115.17,427.903,104.84,427.903z"></path><path style="opacity:0.3;fill:#F4F4F5;" d="M162.52,427.903L162.52,427.903c-10.33,0-18.782-8.452-18.782-18.781l0,0
                    c0-10.33,8.452-18.782,18.781-18.782h0c10.33,0,18.781,8.452,18.781,18.782l0,0C181.301,419.451,172.85,427.903,162.52,427.903z
                    "></path><path style="opacity:0.3;fill:#F4F4F5;" d="M220.2,427.903L220.2,427.903c-10.33,0-18.782-8.452-18.782-18.781l0,0
                    c0-10.33,8.452-18.782,18.782-18.782l0,0c10.33,0,18.781,8.452,18.781,18.782l0,0C238.981,419.451,230.53,427.903,220.2,427.903
                    z"></path><path style="opacity:0.1;fill:#F4F4F5;" d="M0.5,18.077c0,0,0,0,0-0.072C2.286,9.288,9.288,2.286,18.005,0.5
        c1.5-0.357,3.001-0.5,4.572-0.5H133.68v512H22.578C10.146,512,0,501.783,0,489.351V22.649C0,21.077,0.143,19.577,0.5,18.077z"></path></g></svg>`;
});
const Monitor_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: "svg.svelte-13hufpc{display:inline-block;position:absolute;animation:svelte-13hufpc-reveal 1s linear infinite;transition:all 1s ease;scale:0}@keyframes svelte-13hufpc-reveal{0%{scale:0;opacity:0}100%{scale:1;opacity:1}}",
  map: null
};
const Monitor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<svg width="30vw" height="30vw" viewBox="0 0 1024 1024" class="icon svelte-13hufpc" version="1.1" xmlns="http://www.w3.org/2000/svg" id="monitorIcon"><path d="M628.9 935.1L213.8 797.8l165-130 389.1 107.3z" fill="#A1BBC6"></path><path d="M767.9 775.1V788l-139 161.3v-14.2z" fill="#678289"></path><path d="M628.9 949.3v-14.2L213.8 797.8v13.9z" fill="#BACCD3"></path><path d="M600.1 729l157.2 43.3-117 13.4-39.5 19.1z" fill="#8EA8AF"></path><path d="M404.9 583.2l31.4 173.6 164.5 48-28.9-170.6z" fill="#7C99A3"></path><path d="M598.6 700l16.5 91-14.3 13.8L581.1 703z" fill="#678289"></path><path d="M884 792.4L114 584.9v-491l770 162.5z" fill="#37BBEF"></path><path d="M909 751.9l-25 40.5v-536l26-27.5z" fill="#678289"></path><path d="M910 228.9L151.4 74.7 114 93.9l770 162.5z" fill="#A1BBC6"></path><path d="M114 93.9v491l770 207.5v-536L114 93.9z m755.6 616.5l-746-192.5V106l746 161v443.4z" fill="#BACCD3"></path><path d="M850.8 724.5v17l-39.5-11V714z" fill="#FFFFFF"></path><path d="M846 727.3v8.9l-29.9-8.4v-8.5z" fill="#113B42"></path><path d="M787.6 708v17l-39.5-11v-16.5z" fill="#FFFFFF"></path><path d="M784.1 711.1v9.5l-32.5-9.1v-9z" fill="#113B42"></path><path d="M853.3 703.6l-213-485.8 229.1 49.3-0.1 441z" fill="#3ED6FF"></path><path d="M124.9 106v412.8" fill="#3ED6FF"></path></svg>`;
});
const MobileFallback_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: '.fallback.svelte-naef3w.svelte-naef3w{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:space-between;width:100%;height:100vh;background:linear-gradient(\n            180deg,\n            var(--theme-bg) 40%,\n            var(--theme-primary) 60%,\n            var(--theme-bg) 80%)\n        ;background-size:100% 50%;border:2px solid var(--theme-primary);padding:0.5em;margin-left:-0.5em;margin-top:-0.5em;margin-bottom:8%;animation:svelte-naef3w-gradient 15s ease infinite alternate}.fallback.svelte-naef3w p.svelte-naef3w{width:100%;font-size:10vw;font-family:monospace;white-space:pre-line}.morph.svelte-naef3w.svelte-naef3w{position:relative;width:30vw;height:30vw;margin:auto;transform:translateX(-40%)}.scroll-down.svelte-naef3w.svelte-naef3w{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-size:5vw;font-weight:500;cursor:pointer;margin-bottom:12vh}.scroll-down.svelte-naef3w .label.svelte-naef3w{--x-start:0;--x-end:0;--y-start:0;--y-end:4vh;animation:svelte-naef3w-moveDown 1s ease-in-out infinite}.scroll-down.svelte-naef3w .chevron.svelte-naef3w{--x-start:0;--x-end:0;--y-start:0;--y-end:4vh;position:relative;border-left:5vw solid transparent;border-right:5vw solid transparent;border-top:5vw solid white;animation:svelte-naef3w-moveDown 1s ease-in-out infinite}.scroll-down.svelte-naef3w .chevron.svelte-naef3w::after{--x-start:-5vw;--x-end:-5vw;--y-start:-3vw;--y-end:calc(4vh - 3vw);content:"";position:absolute;width:100%;height:100%;opacity:50%;transform:translate(-5vw, -3vw);border-left:5vw solid transparent;border-right:5vw solid transparent;border-top:5vw solid rgba(255, 255, 255, 0.5);animation:svelte-naef3w-moveDown 1s ease-in-out infinite}@keyframes svelte-naef3w-gradient{0%{background-position:100% 100%}50%{background-position:100% 0%}100%{background-position:100% 100%}}@keyframes svelte-naef3w-moveDown{0%,100%{transform:translate(var(--x-start), var(--y-start))}50%{transform:translate(var(--x-end), var(--y-end))}}',
  map: null
};
const MobileFallback = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<div class="fallback svelte-naef3w"><p class="svelte-naef3w" data-svelte-h="svelte-1wqim9d">PLEASE SWITCH TO A DESKTOP
        FOR AN ENHANCED USER EXPERIENCE.</p> <div class="morph svelte-naef3w">${validate_component(Mobile, "Mobile").$$render($$result, {}, {}, {})} ${validate_component(Monitor, "Monitor").$$render($$result, {}, {}, {})}</div> <div class="scroll-down svelte-naef3w" data-svelte-h="svelte-12scmkg"><div class="label svelte-naef3w">Scroll Down</div> <div class="chevron svelte-naef3w"></div></div> </div>`;
});
const DownloadResume_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: '.download-content.svelte-1wgke6j.svelte-1wgke6j{width:30vw;margin:0 auto;background:var(--theme-bg);padding:0.5em 0;border-radius:10px;--base-font-size:2vw}h2.svelte-1wgke6j.svelte-1wgke6j{font-size:var(--base-font-size);margin-bottom:20px}p.svelte-1wgke6j.svelte-1wgke6j{font-size:calc(var(--base-font-size) * 0.8);margin-bottom:30px}.resume-preview.svelte-1wgke6j.svelte-1wgke6j{width:25vw;height:25vw;margin:auto;margin-bottom:30px;border-radius:10px;overflow:hidden;filter:drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))}.resume-preview.svelte-1wgke6j.svelte-1wgke6j:not(.loader){cursor:pointer}.resume-preview.disabled.svelte-1wgke6j.svelte-1wgke6j{cursor:not-allowed;filter:grayscale(1)}.resume-preview.svelte-1wgke6j .loader.svelte-1wgke6j{height:25vw;background:transparent;animation:svelte-1wgke6j-pulse 1s infinite}@keyframes svelte-1wgke6j-pulse{0%,100%{background:transparent}50%{background:#272727}}.resume-preview.svelte-1wgke6j img.svelte-1wgke6j{max-width:100%;height:auto;position:relative}.resume-preview.svelte-1wgke6j.svelte-1wgke6j::after{content:"";position:absolute;top:0;left:0;right:0;bottom:0;border-radius:10px;border:2px solid #ffffff;pointer-events:none}.btn-download.svelte-1wgke6j.svelte-1wgke6j{display:flex;margin:auto;padding:10px 20px;align-items:center;font-size:calc(var(--base-font-size) * 0.8);color:#fff;background-color:#04879e;border:none;border-radius:5px;text-decoration:none;transition:background-color 0.3s ease;cursor:pointer}.btn-download.svelte-1wgke6j svg.svelte-1wgke6j{margin-right:10px;vertical-align:middle;fill:white}.btn-download.svelte-1wgke6j.svelte-1wgke6j:hover{background-color:#0b85cc}.btn-download.svelte-1wgke6j.svelte-1wgke6j:active{background-color:#04879e}.btn-download.svelte-1wgke6j.svelte-1wgke6j:disabled{background-color:#ccc;cursor:not-allowed}.btn-download.svelte-1wgke6j.svelte-1wgke6j:disabled:hover,.btn-download.svelte-1wgke6j.svelte-1wgke6j:disabled:active{background-color:#ccc}.btn-download.svelte-1wgke6j .loader.svelte-1wgke6j{height:20px;width:20px;margin-right:10px;border:2px solid rgba(255, 255, 255, 0.3);border-top-color:#fff;border-radius:50%;animation:svelte-1wgke6j-spin 1s linear infinite}@keyframes svelte-1wgke6j-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@media screen and (max-width: 1200px){.download-content.svelte-1wgke6j.svelte-1wgke6j{width:80vw;--base-font-size:4vw}.resume-preview.svelte-1wgke6j.svelte-1wgke6j{width:50vw;height:50vw}}',
  map: null
};
const DownloadResume = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $socials, $$unsubscribe_socials;
  let $achievements, $$unsubscribe_achievements;
  let $skills, $$unsubscribe_skills;
  let $projects, $$unsubscribe_projects;
  let $experience, $$unsubscribe_experience;
  let $education, $$unsubscribe_education;
  let hiddenDiv;
  let thumbnailSrc = "";
  let isDownloading = false;
  const fullSkillList = ["Python"].fill(100);
  const { experience, projects, skills, achievements, socials } = Object.fromEntries(getContext("api"));
  $$unsubscribe_experience = subscribe(experience, (value) => $experience = value);
  $$unsubscribe_projects = subscribe(projects, (value) => $projects = value);
  $$unsubscribe_skills = subscribe(skills, (value) => $skills = value);
  $$unsubscribe_achievements = subscribe(achievements, (value) => $achievements = value);
  $$unsubscribe_socials = subscribe(socials, (value) => $socials = value);
  const education = writable([]);
  $$unsubscribe_education = subscribe(education, (value) => $education = value);
  fetch("/api/education").then((res) => res.json()).then((data) => education.set(data));
  const getResumeText = async () => {
    const response = await fetch("/resume.html");
    return await response.text();
  };
  const createElement = (tag, { classes = [], text = "", children = [], attributes = {} } = {}) => {
    const element = document.createElement(tag);
    classes.forEach((className) => element.classList.add(className));
    if (text)
      element.textContent = text;
    children.forEach((child) => element.appendChild(child));
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  };
  const createTasks = (description, roleTask = false) => {
    const tasksUl = createElement("ul", {
      classes: ["tasks", ...roleTask ? ["role-tasks"] : []],
      children: description.split("\r\n").map((task) => createElement("li", {
        children: [createElement("span", { text: task.replace("• ", "") })]
      }))
    });
    return tasksUl;
  };
  const createProjectTags = (skills2) => {
    const projectTags = createElement("div", {
      classes: ["project-tags"],
      children: skills2.map((tag) => createElement("div", {
        classes: ["project-tag"],
        children: [createElement("span", { text: tag })]
      }))
    });
    return projectTags;
  };
  const modifySocials = (socialRoot, socials2) => {
    socials2.forEach((social) => {
      const socialAnchor = socialRoot.querySelector(`img[alt="${social.name}"]`)?.closest("span").querySelector("a");
      if (!socialAnchor)
        return;
      socialAnchor.href = social.href || social.url;
      socialAnchor.text = social.text || social.url;
      socialAnchor.target = "blank";
      socialAnchor.rel = "noopener noreferrer";
    });
  };
  const createExperience = (expRoot, exp) => {
    expRoot.innerHTML = "";
    exp.forEach((job) => {
      const jobLi = createElement("li", {
        classes: ["company"],
        children: [createElement("strong", { text: job.name })]
      });
      job.children.forEach((role) => {
        jobLi.appendChild(createElement("span", { classes: ["role"], text: role.name }));
        jobLi.appendChild(createElement("span", { classes: ["period"], text: job.year }));
        if (role.children && role.children.length > 0) {
          const roleUl = createElement("ul", {
            classes: ["exp_projects"],
            children: role.children.map((product) => {
              const productLi = createElement("li", {
                classes: ["project"],
                children: [createElement("strong", { text: product.name })]
              });
              if (product.description) {
                productLi.appendChild(createTasks(product.description));
              }
              productLi.appendChild(createProjectTags(product.skills));
              return productLi;
            })
          });
          jobLi.appendChild(roleUl);
        }
        if (role.description) {
          const taskHolder = createElement("div", {
            classes: ["task-holder"],
            children: [createTasks(role.description, true), createProjectTags(role.skills)]
          });
          jobLi.appendChild(taskHolder);
        }
      });
      expRoot.appendChild(jobLi);
    });
  };
  const createProjects = (projectsRoot, prjs) => {
    projectsRoot.innerHTML = "";
    prjs.forEach((project) => {
      const projectCard = createElement("div", {
        classes: ["project-card"],
        children: [
          createElement("div", {
            classes: ["project-title"],
            children: [
              createElement("a", {
                text: project.title,
                classes: [],
                attributes: {
                  href: project.htmlUrl || "#",
                  target: "_blank",
                  rel: "noopener noreferrer"
                }
              })
            ]
          })
        ]
      });
      const watcherCount = project.watcherCount || 0;
      const forkCount = project.forkCount || 0;
      const stargazerCount = project.stargazerCount || 0;
      if (watcherCount || forkCount || stargazerCount) {
        projectCard.appendChild(createElement("div", {
          classes: ["project-meta"],
          children: [
            createElement("span", {
              children: [
                createElement("div", {
                  classes: ["icon"],
                  children: [
                    createElement("img", {
                      attributes: {
                        src: "https://img.icons8.com/material-rounded/24/transparent/visible.png",
                        alt: "Watchers"
                      }
                    }),
                    createElement("span", { text: watcherCount.toLocaleString() })
                  ]
                })
              ]
            }),
            createElement("span", {
              children: [
                createElement("div", {
                  classes: ["icon"],
                  children: [
                    createElement("img", {
                      attributes: {
                        src: "https://img.icons8.com/material-outlined/24/transparent/code-fork.png",
                        alt: "Forks"
                      }
                    }),
                    createElement("span", { text: forkCount.toLocaleString() })
                  ]
                })
              ]
            }),
            createElement("span", {
              children: [
                createElement("div", {
                  classes: ["icon"],
                  children: [
                    createElement("img", {
                      attributes: {
                        src: "https://img.icons8.com/material-rounded/24/transparent/star.png",
                        alt: "Stars"
                      }
                    }),
                    createElement("span", { text: stargazerCount.toLocaleString() })
                  ]
                })
              ]
            })
          ]
        }));
      }
      projectCard.appendChild(createElement("div", {
        text: project.description,
        classes: ["project-description"]
      }));
      projectCard.appendChild(createProjectTags(project.tags));
      projectsRoot.appendChild(projectCard);
    });
  };
  const createSkills = (skillsRoot, skls) => {
    skillsRoot.innerHTML = "";
    skls.forEach((skill) => {
      const sklLi = createElement("li", {
        children: [
          createElement("img", {
            attributes: { src: skill.icon, alt: skill.name }
          }),
          createElement("span", { text: skill.name })
        ]
      });
      skillsRoot.appendChild(sklLi);
    });
  };
  const createEducation = (educationRoot, edu) => {
    educationRoot.innerHTML = "";
    edu.forEach((education2) => {
      const educationLi = createElement("li", {
        classes: ["specialization"],
        children: [
          createElement("strong", { text: education2.specialization }),
          createElement("span", {
            classes: ["institution"],
            text: education2.institution
          }),
          createElement("br"),
          createElement("span", {
            classes: ["period"],
            text: education2.period
          })
        ]
      });
      educationRoot.appendChild(educationLi);
    });
  };
  const createAchievements = (achievementsRoot, achv) => {
    achievementsRoot.innerHTML = "";
    achv.forEach((achievement) => {
      const achievementCard = createElement("div", {
        classes: ["achievement-card"],
        children: [
          createElement("img", {
            attributes: {
              src: achievement.from.icon,
              alt: achievement.name
            }
          }),
          createElement("div", {
            classes: ["achievement-info"],
            children: [
              createElement("strong", { text: achievement.name }),
              createElement("span", {
                text: `${achievement.from.name} (${achievement.year})`
              })
            ]
          })
        ]
      });
      achievementsRoot.appendChild(achievementCard);
    });
  };
  const modifyHiddenDiv = (hiddenDiv2) => {
    const socialRoot = hiddenDiv2.shadowRoot.querySelector(".contact-info");
    modifySocials(socialRoot, $socials || []);
    const expRoot = hiddenDiv2.shadowRoot.querySelector(".experience ul");
    createExperience(expRoot, $experience || []);
    const projectsRoot = hiddenDiv2.shadowRoot.querySelector(".section.projects .projects");
    createProjects(projectsRoot, $projects || []);
    const techSkillsRoot = hiddenDiv2.shadowRoot.querySelector(".technical-skills ul");
    createSkills(techSkillsRoot, ($skills["Technical Skills"] || []).toSorted((a, b) => b.confidence * fullSkillList.filter((x) => x === b.name).length - a.confidence * fullSkillList.filter((x) => x === a.name).length));
    const softSkillsRoot = hiddenDiv2.shadowRoot.querySelector(".soft-skills ul");
    createSkills(softSkillsRoot, ($skills["Soft Skills"] || []).toSorted((a, b) => b.confidence - a.confidence));
    const educationRoot = hiddenDiv2.shadowRoot.querySelector(".education ul");
    createEducation(educationRoot, $education || []);
    const achievementsRoot = hiddenDiv2.shadowRoot.querySelector(".section.achievements .content");
    createAchievements(achievementsRoot, $achievements || []);
    const footer = hiddenDiv2.shadowRoot.querySelector(".footer>span");
    footer.textContent = footer.textContent.replace(/\d{4}/, (/* @__PURE__ */ new Date()).getFullYear());
  };
  const replaceCssVariables = (shadowRoot) => {
    const themeIdx = window.matchMedia("(prefers-color-scheme: dark)").matches ? 0 : 1;
    const cssVarText = shadowRoot.querySelector("style").textContent;
    const themeBlock = [...cssVarText.match(/:host\s*\{[^}]+\}/g)][themeIdx];
    const varMap = new Map([...themeBlock.matchAll(/--[^:]+:\s*[^;]+/g)].map((match) => match[0].split(":").map((part) => part.trim())));
    const cleanedCss = cssVarText.replace(/var\([^)]+\)/g, (match) => {
      const varName = match.match(/--[^)]+/)[0];
      return varMap.get(varName) || match;
    });
    shadowRoot.querySelector("style").textContent = cleanedCss;
    shadowRoot.querySelectorAll(".icon>img").forEach((img) => {
      img.src = img.src.replace("transparent", varMap.get("--img-color").replace("#", ""));
    });
  };
  const getHiddenDiv = async (htmlContent) => {
    hiddenDiv = createElement("div", {
      classes: ["hidden-div"],
      attributes: {
        style: "position: absolute; left: -9999px; top: -9999px;"
      }
    });
    const shadowRoot = hiddenDiv.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = htmlContent;
    document.body.appendChild(hiddenDiv);
    modifyHiddenDiv(hiddenDiv);
    replaceCssVariables(shadowRoot);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { hiddenDiv, shadowRoot };
  };
  const createThumbnail = async () => {
    const resumeText = await getResumeText();
    try {
      const { shadowRoot } = await getHiddenDiv(resumeText);
      const canvas = await domtoimage.toCanvas(shadowRoot.host);
      thumbnailSrc = canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Error creating thumbnail:", error);
    }
  };
  $$result.css.add(css$1);
  {
    if ($experience.length && $projects.length && $skills["Technical Skills"]?.length && $skills["Soft Skills"]?.length && $achievements.length && $socials.length) {
      createThumbnail();
    }
  }
  $$unsubscribe_socials();
  $$unsubscribe_achievements();
  $$unsubscribe_skills();
  $$unsubscribe_projects();
  $$unsubscribe_experience();
  $$unsubscribe_education();
  return `<div class="download-content svelte-1wgke6j"><h2 class="svelte-1wgke6j" data-svelte-h="svelte-1ek6qln">Download My Resume</h2> <p class="svelte-1wgke6j" data-svelte-h="svelte-rgcgp4">Get a copy of my dynamically generated resume.</p> <div class="content"><div class="${["resume-preview svelte-1wgke6j", ""].join(" ").trim()}" role="button" tabindex="0" aria-label="Download resume as PDF">${thumbnailSrc ? `<img${add_attribute("src", thumbnailSrc, 0)} alt="Resume Preview" class="svelte-1wgke6j">` : `<div class="loader svelte-1wgke6j"></div>`}</div> <button class="btn-download svelte-1wgke6j" ${!thumbnailSrc || isDownloading ? "disabled" : ""}>${`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" class="svelte-1wgke6j"><path d="M5 20h14v-2H5v2zm7-18v10h3l-4 4-4-4h3V2z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>`} <span data-svelte-h="svelte-q9mf3e">Download</span></button></div> </div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "main.svelte-l01zqk{text-align:center;padding:1em;margin:0 auto}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let landing;
  const achievements = writable([]);
  const experience = writable([]);
  const projects = writable([]);
  const skills = writable([]);
  const socials = writable([]);
  const apiMap = new Map(Object.entries({
    achievements,
    experience,
    projects,
    skills,
    socials
  }));
  setContext("api", apiMap);
  $$result.css.add(css);
  return `<main class="svelte-l01zqk">${window.innerWidth > 800 && !("ontouchstart" in window) ? `<section id="landing"${add_attribute("this", landing, 0)}>${validate_component(Landing, "Landing").$$render($$result, {}, {}, {})}</section>` : `${validate_component(MobileFallback, "MobileFallback").$$render($$result, {}, {}, {})}`} <section id="about">${validate_component(IntersectionObserver_1, "IntersectionObserver").$$render($$result, {}, {}, {
    default: ({ intersecting }) => {
      return `${validate_component(About, "About").$$render($$result, { inview: intersecting }, {}, {})}`;
    }
  })}</section> <section id="experience">${validate_component(Experience, "Experience").$$render($$result, {}, {}, {})}</section> <section id="projects">${validate_component(IntersectionObserver_1, "IntersectionObserver").$$render($$result, {}, {}, {
    default: ({ intersecting }) => {
      return `${validate_component(Projects, "Project").$$render($$result, { inview: intersecting }, {}, {})}`;
    }
  })}</section> <section id="skills">${validate_component(IntersectionObserver_1, "IntersectionObserver").$$render($$result, {}, {}, {
    default: ({ intersecting }) => {
      return `${validate_component(Skills, "Skills").$$render($$result, { inview: intersecting }, {}, {})}`;
    }
  })}</section> <section id="achievements">${validate_component(Achievements, "Achievements").$$render($$result, {}, {}, {})}</section> <section id="downloadResume">${validate_component(DownloadResume, "DownloadResume").$$render($$result, {}, {}, {})}</section> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})} </main>`;
});
export {
  Page as default
};
