<script>
    import { getContext } from "svelte";
    import Progressbar from "../Progressbar.svelte";

    const { skills } = Object.fromEntries(getContext("api"));

    export let inview = false;
</script>

{#if $skills && $skills["Technical Skills"] && $skills["Soft Skills"]}
    <div class="container">
        <h1 class="font-effect-anaglyph">SKILLS</h1>
        <div class="skill-set">
            <div class="skill-category" class:clearTX={inview}>
                <div class="title-holder">
                    <img src="/icons/technical.png" alt="technical icon" />
                    <h2>Technical Skills</h2>
                </div>
                {#each $skills["Technical Skills"] as skill}
                    <div class="skill">
                        <div>
                            {#if skill.icon}
                                <img src={skill.icon} alt={skill.name} />
                            {/if}
                            <h3>{skill.name}</h3>
                        </div>
                        <Progressbar width={100} value={skill.confidence} />
                    </div>
                {/each}
            </div>
            <div class="skill-category" class:clearTX={inview}>
                <div class="title-holder">
                    <img src="/icons/soft-skills.png" alt="soft-skills icon" />
                    <h2>Soft Skills</h2>
                </div>
                {#each $skills["Soft Skills"] as skill}
                    <div class="skill">
                        <div>
                            {#if skill.icon}
                                <img src={skill.icon} alt={skill.name} />
                            {/if}
                            <h3>{skill.name}</h3>
                        </div>
                        <Progressbar width={100} value={skill.confidence} />
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/if}

<style>
    .skill-set {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        gap: 1em;
        background: var(--theme-bg);
        width: 80vw;
        margin-left: auto;
        margin-right: auto;
        margin-top: 1em;
        text-transform: uppercase;
        box-shadow:
            2px 4px 6px black,
            -2px 4px 6px black;
        user-select: none;
    }

    .skill-category {
        --icon-gap: 1vw;
        display: flex;
        flex-direction: column;
        gap: 1em;
        position: relative;
        width: 100%;
        backdrop-filter: contrast(1.25);
        padding: 2rem;
    }

    .skill-category:nth-child(1) {
        box-shadow: 1px 2px 3px black;
        transform: translateX(calc(100% + 1em));
        transition: transform 400ms ease-in-out;
    }

    .skill-category:nth-child(2) {
        box-shadow: -1px 2px 3px black;
        transform: translateX(calc((100% + 1em) * -1));
        transition: transform 400ms ease-in-out;
    }

    .clearTX {
        transform: none !important;
    }

    .skill-category .title-holder {
        position: relative;
        width: 100%;
        padding-left: 2rem;
        padding-right: 2rem;
        margin-left: -2rem;
        margin-top: -2rem;
        background: var(--theme-primary);
        box-shadow: 0px 2px 4px black;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: var(--icon-gap);
    }

    .skill-category .title-holder>* {
        filter: drop-shadow(2px 4px 6px black);
    }

    .skill {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
    }

    .skill>div {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: var(--icon-gap);
        filter: drop-shadow(2px 4px 6px black);
    }

    .skill-category img {
        width: 2vw;
        height: 2vw;
    }

    @media screen and (max-width: 640px) {
        .skill-set {
            flex-direction: column;
        }

        .skill-category {
            --icon-gap: 2vw;
            padding-left: 4vw;
            padding-right: 4vw;
            width: auto;
        }

        .skill-category .title-holder {
            width: auto;
            margin-left: -4vw;
            margin-right: -4vw;
        }

        .skill-category:nth-child(1) {
            box-shadow: 1px 2px 3px black;
            transform: none;
        }

        .skill-category:nth-child(2) {
            box-shadow: 1px -2px 3px black;
            transform: translateY(calc((100% + 1em) * -1));
            transition-duration: 3s;
        }

        .skill>div {
            margin-left: auto;
            margin-right: auto;
        }

        .skill-category img {
            width: 8vw;
            height: 8vw;
        }
    }
</style>
