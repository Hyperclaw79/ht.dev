<script>
    import IntersectionObserver from "../IntersectionObserver.svelte";
    import Listing from "./Listing.svelte";
    import { getContext } from "svelte";

    const { achievements } = Object.fromEntries(getContext("api"));
</script>
<IntersectionObserver let:intersecting>
    <div class="container">
        <h1 class="font-effect-anaglyph">
            Achievements & Certificates
        </h1>
        <div class="contents">
            {#if $achievements}
                {#each $achievements as data, idx (data.name)}
                    <Listing {...data} {idx} inview={intersecting} />
                {/each}
            {/if}
        </div>
    </div>
</IntersectionObserver>
<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
    }

    .contents {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
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

    /* Remove Timeline for Mobiles */
    @media screen and (max-width: 640px) {
        .contents::before {
            display: none;
        }
    }
</style>
