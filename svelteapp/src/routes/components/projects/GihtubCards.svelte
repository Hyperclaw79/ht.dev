<script>
    import { getContext } from "svelte";
    import Tiltable from "../Tiltable.svelte";
    import GhCard from "./GhCard.svelte";

    export let inview = false;

    const { projects } = Object.fromEntries(getContext("api"));
</script>

<div class="githubCards">
    {#each $projects as card, idx (card.id || card.name)}
        <Tiltable>
            <GhCard {...card} oddOrEven={idx} {inview}/>
        </Tiltable>
    {:else}
        <p>No projects found...</p>
    {/each}
</div>

<style>
    .githubCards {
        display: flex;
        gap: 1em;
        align-content: center;
        justify-content: center;
        flex-wrap: wrap;
        width: 80vw;
        margin-left: auto;
        margin-right: auto;
        user-select: none;
        /* To allow breathing room before next scroll snap
        padding-bottom: 10rem;
        */
    }

    @media screen and (max-width: 800px) {
        /* Scroll Snapping is disabled for smaller screens */
        .githubCards {
            padding-bottom: 0;
        }
    }
</style>
