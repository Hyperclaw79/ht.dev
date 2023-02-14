<script>
    import { writable } from "svelte/store";
    import Tiltable from "../Tiltable.svelte";
    import GhCard from "./GhCard.svelte";

    const projects = writable([]);

    export let inview = false;

    const getProjectData = async () => {
        if ($projects.length > 0) { return $projects; }
        const response = await fetch("/api/projects");
        const data = await response.json();
        $projects = data;
        return $projects;
    };
</script>

<div class="githubCards">
    {#await getProjectData()}
        <p>Loading...</p>
    {:then repos}
        {#each repos as card, idx (card.id || card.name)}
            <Tiltable>
                <GhCard {...card} oddOrEven={idx} {inview}/>
            </Tiltable>
        {:else}
            <p>No projects found...</p>
        {/each}
    {/await}
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
