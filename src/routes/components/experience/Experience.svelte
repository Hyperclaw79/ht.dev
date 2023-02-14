<script>
    import Recursor from "./Recursor.svelte";
    import { writable } from "svelte/store";

    const experience = writable({});

    const getExperience = async () => {
        if ($experience.length > 0) { return $experience; }
        const response = await fetch("/api/experience");
        const data = await response.json();
        $experience = data;
        return $experience;
    };
</script>

{#await getExperience() then experience}
    {#if experience}
        <div class="container">
            <h1 class="font-effect-anaglyph">
                Experience
            </h1>
            <div class="contents">
                <Recursor node={experience} />
            </div>
        </div>
    {/if}
{/await}

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
        /* To allow breathing room before next scroll snap
        padding-bottom: 10vw; */
    }

    .contents {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        width: 70vw;
        margin-top: 1em;
        gap: 2vw;
    }

    .contents::before {
        position: absolute;
        right: -8%;
        top: -5%;
        bottom: -5%;
        content: " ";
        display: block;
        width: 8px;
        background: linear-gradient(
            to bottom,
            rgba(80,80,80,0) 0%,
            rgb(167 63 63) 4%,
            rgb(70 21 21) 96%,
            rgba(80,80,80,0) 100%
        );
    }

    /* Remove Timeline for Small Screens */
    @media screen and (max-width: 1200px) {
        .container {
            padding-bottom: 2rem;
        }

        .contents::before {
            display: none;
        }
    }

    @media screen and (max-width: 640px) {
        .contents {
            width: 80vw;
        }
    }
</style>