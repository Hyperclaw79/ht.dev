<script>
    import { writable } from "svelte/store";

    export let data;
    export let needToType = false;
    export let callback;
    export let cleaner;
    
    let content = "";
    let textHolder;
    let rafId;
    let counter = 0;
    const throttler = 10;
    const firstRender = writable(true);

    const type = () => {
        if (content.length === data.length) {
            cancelAnimationFrame(rafId);
            $firstRender = false;
            if (callback) {
                callback();
            } else {
                needToType = true;
            }
            return;
        }
        if (counter++ % throttler === 0) {
            content = data.slice(0, content.length + 1);
            if (textHolder) {
                textHolder.innerText = content;
            }
        }
        rafId = requestAnimationFrame(type);
    };

    $: if (needToType) {
        if ($firstRender) {
            needToType = false;
            content = "";
            rafId = requestAnimationFrame(type);
        } else {
            const sleeper = new Promise(resolve => setTimeout(resolve, 100));
            sleeper.then(() => {
                needToType = false;
                content = "";
                rafId = requestAnimationFrame(type);
            });
        }
    }

    $: if (cleaner) {
        content = "";
        if (textHolder) { textHolder.innerText = content; }
    }
</script>

<p><span bind:this={textHolder} /><span class:cursor={content.length > 0 && content.length !== data.length} /></p>

<style>
    p {
        margin: 0;
    }

    .cursor {
        animation: blink 0.5s infinite ease-in-out;
    }

    @keyframes blink {
        0%, 100% {
            border-right: 6px solid #ffffff2c;
        }
        50% {
            border-right: 6px solid #ffffffa5;
        }
    }
</style>
