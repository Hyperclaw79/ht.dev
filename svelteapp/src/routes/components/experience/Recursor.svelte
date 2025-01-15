<script>
    import { onMount } from "svelte";

    export let node, nodeIdx;
    const headingMap = {
        Job: "h2",
        Role: "h3",
        Product: "h4"
    };
    $: headTag = headingMap[node.type];
    onMount(() => {
        if (window.innerWidth < 641) {
            document.querySelectorAll("details").forEach((el) => {
                el.open = true;
            });
        }
    });
    $: console.log(node);
</script>

{#if Array.isArray(node)}
    {#each node as child, idx}
        <svelte:self node={child} nodeIdx={idx} />
    {/each}
{:else}
    <div class={`node ${node.type}`} data-year={node.year?.split(" – ").reverse().join("\n↑\n")}>
        <svelte:element this={headTag} class="heading">
            {node.name}
            {#if node.year}
                <span class="mobile-only"> ({node.year})</span>
            {/if}
        </svelte:element>
        <div class="contents">
            {#if node.caption}
                <blockquote class="caption">
                    {node.caption}
                </blockquote>
            {/if}
            {#if node.description}
                <pre class="description">{node.description}</pre>
            {/if}
            {#if node.skills}
                <p class="skills">
                    Technologies Used: {node.skills.join(", ")}
                </p>
            {/if}
            {#if node.children?.length > 0}
                <details on:toggle={
                    (e) => {
                        e.target.querySelector("summary").innerHTML = e.target.open
                            ? "Click to Close"
                            : "Click for details";
                    }
                } open={nodeIdx === 0}>
                    <summary>Click for Details</summary>
                    <div class="children">
                        {#each node.children as child, idx}
                            <div>
                                <svelte:self node={child} nodeIdx={idx} />
                            </div>
                        {/each}
                    </div>
                </details>
            {/if}
        </div>
    </div>
{/if}

<style>
    :root {
        --base-font-size: 1vw;
    }

    h2 {
        font-size: calc(var(--base-font-size) * 1.75);
    }

    h3 {
        font-size: calc(var(--base-font-size) * 1.5);
    }

    h4 {
        font-size: calc(var(--base-font-size) * 1.25);
    }

    .node {
        --node-color: var(--theme-primary);
        --shadow-size: 12px;
        --outer-shadow-size: 1px;
        background: var(--theme-bg);
        padding: 2vw;
        padding-top: 0;
        margin-left: 1vw;
        border: 2px solid var(--node-color);
        box-shadow:
            inset var(--shadow-size) 0px 2px 0px black,
            inset calc(var(--shadow-size) * -1) 0px 2px 0px black,
            inset 0px calc(var(--shadow-size) * -1) 2px 0px black,
            var(--outer-shadow-size) var(--outer-shadow-size) 1px 1px black;
    }

    
    .node .heading {
        background: var(--node-color);
        width: calc(100% + 2vw);
        margin-left: -2vw;
        margin-top: 0;
        padding: 1vw;
        box-shadow: 0px var(--shadow-size) 2px 0px black;
    }
    
    .Job {
        --shadow-size: 12px;
        position: relative;
        transition: transform 0.25s ease-in-out;
    }

    .Job:hover,
    .Job:active,
    .Job:focus {
        --outer-shadow-size: 2px;
        transform: scale(1.1);
        z-index: 10;
    }

    .Job::before {
        content: " ";
        position: absolute;
        top: 50%;
        left: 100%;
        right: 0;
        display: block;
        height: 8px;
        width: 5%;
        background: var(--theme-primary);
        z-index: 3;
    }

    .Job::after {
        content: attr(data-year);
        position: absolute;
        top: calc(50% - 34px);
        left: 103%;
        right: 0;
        display: block;
        height: 60px;
        width: 8%;
        padding: 8px;
        background: var(--theme-bg);
        z-index: 5;
        white-space: pre-line;
    }

    .Role {
        --shadow-size: 8px;
        --node-color: #3b3bf4;
    }

    .Product {
        --shadow-size: 4px;
        --node-color: #cc8006;
    }

    .mobile-only {
        display: none;
    }

    details {
        cursor: pointer;
        user-select: none;
    }

    summary {
        font-size: var(--base-font-size);
        filter: brightness(0.8);
    }

    .children {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        gap: 2vw;
    }

    .caption {
        font-size: calc(var(--base-font-size) * 1.25);
        font-style: italic;
        margin: 0;
        padding: 0;
    }

    .description {
        font-weight: bold;
        white-space: pre-line;
        font-size: calc(var(--base-font-size) * 1.25);
        text-align: start;
        margin: 0;
    }

    .skills {
        font-weight: bold;
        color: rgb(171, 171, 171);
        font-size: calc(var(--base-font-size) * 1);
        font-family: "M PLUS 1 Code", sans-serif;
        text-align: start;
    }

    @media screen and (max-width: 1200px) {
        .Job::after,
        .Job::before {
            display: none;
        }

        .mobile-only {
            display: initial;
        }
    }

    @media screen and (max-width: 640px) {
        :root {
            --base-font-size: 2vw;
        }
    }
</style>