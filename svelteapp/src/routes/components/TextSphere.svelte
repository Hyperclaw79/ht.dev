<script>
    import TagCloud from "TagCloud";

    export let tags;
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

    $: if (tags?.length > 0 && binder) {
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
</script>

<span class="holder" bind:this={binder} />

<style>
    .holder {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-size: 1vw;
    }

    :global(.tagcloud) {
        width: 30vw !important;
        height: 30vw !important;
    }

    @media screen and (max-width: 600px) {
        .holder {
            font-size: 2.5vw;
        }

        :global(.tagcloud) {
            width: 50vw !important;
            height: 50vw !important;
        }
    }
</style>
