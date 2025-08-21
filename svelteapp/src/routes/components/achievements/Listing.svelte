<script>
    export let name, type, from, year, idx;
    export let image = null;
    export let assetZoomable = true;
    export let inview = false;
    let zoomed = false;
    let zoomable;
    let mustClick = true;

    const zoomIn = () => {
        if (!assetZoomable) return;
        mustClick = false;
        zoomed = true;
        zoomable.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
            window.addEventListener("click", (e) => {
                if (e.target !== zoomable) {
                    zoomed = false;
                }
            },
            { once: true });
        }, 500);
    };
</script>
<div
    class="listing"
    data-year={year}
    style={(!inview && idx > 0) ? `transform: translateY(calc((100% + 2vw) * -${idx})` : ""}
>
    <div class:backdrop={zoomed} />
    <div class="titleHolder">
        <h2 class="title">
            {type === "Achievement" ? "🏆" : "📜"} {name}
        </h2>
    </div>
    <div class="content">
        {#if image}
            <div class="assetHolder">
                {#if assetZoomable}
                    <button
                        class="image-button"
                        on:click={zoomIn}
                        title="Click to zoom"
                        style="border: none; background: none; padding: 0; cursor: pointer;"
                    >
                        <img
                            src={image}
                            alt={name}
                            class="asset"
                            class:zoom={zoomed}
                            class:glow={mustClick}
                            bind:this={zoomable}
                        />
                    </button>
                {:else}
                    <img
                        src={image}
                        alt={name}
                        class="asset"
                        class:zoom={zoomed}
                        bind:this={zoomable}
                    />
                {/if}
            </div>
        {:else}
            <div class="fallback">
                <span>
                    No Image for this one...
                </span>
            </div>
        {/if}
        <div class="details">
            <div class="from">
                <img src={from.icon} alt={from.name} class="icon" />
                <span>{from.name}</span>
            </div>
            <span class="mobile-only">{year}</span>
        </div>
    </div>
</div>
<style>
    .listing {
        position: relative;
        display: flex;
        flex-direction: column;
        max-width: 80vw;
        box-shadow: 2px 2px 2px 1px black;
        transition: transform 1s ease-in-out;
    }

    .listing::before {
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

    .listing::after {
        content: attr(data-year);
        position: absolute;
        top: calc(43%);
        left: 103%;
        right: 0;
        display: block;
        height: 20px;
        width: 8%;
        padding: 8px;
        background: var(--theme-bg);
        z-index: 5;
    }

    .titleHolder {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1vw 1vw;
        background-color: var(--theme-primary);
        box-shadow: 0px 2px 4px black;
        z-index: 1;
    }

    .title {
        font-size: 2.25vw;
        margin: 0;
    }

    .content {
        display: flex;
        align-items: stretch;
        background-color: var(--theme-bg);
        padding: 0.5vw;
    }

    .details {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 1vw 2vw;
        width: 100%;
        font-size: 2vw;
    }

    .from {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1vw;
        white-space: nowrap;
    }

    .icon {
        width: 2vw;
        height: 2vw;
    }

    .assetHolder {
        position: relative;
        width: 20vw;
        height: auto;
    }

    .asset {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.5s ease-in-out;
    }

    .fallback {
        background: repeating-linear-gradient(
            45deg,
            #babbbf,
            #c3c3c3 10px,
            #929292 10px,
            #e1e1e1 20px
        );
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20vw;
        height: auto;
        font-size: 2vw;
        color: rgba(255, 255, 255, 0.25);
        user-select: none;
    }

    .fallback>span {
        padding: 2vw;
    }

    .mobile-only {
        display: none;
    }

    .zoom {
        position: absolute;
        top: 250%;
        bottom: 0;
        left: 150%;
        right: 0;
        width: 16vw;
        height: 12vw;
        transform: scale(3);
        border: 2px solid var(--theme-primary);
        box-shadow:
            2px 2px 4px 0px rgba(0,0,0,0.75),
            -2px 2px 4px 0px rgba(0,0,0,0.75),
            2px -2px 4px 0px rgba(0,0,0,0.75),
            -2px -2px 4px 0px rgba(0,0,0,0.75);
        z-index: 99;
    }

    .glow {
        animation: glow 1s ease-in-out infinite alternate;
    }

    @keyframes glow {
        from {
            box-shadow:
                2px 2px 4px 0px rgba(0,0,0,0.75),
                -2px 2px 4px 0px rgba(0,0,0,0.75),
                2px -2px 4px 0px rgba(0,0,0,0.75),
                -2px -2px 4px 0px rgba(0,0,0,0.75);
        }
        to {
            box-shadow:
                2px 2px 4px 0px rgba(0,0,0,0.75),
                -2px 2px 4px 0px rgba(0,0,0,0.75),
                2px -2px 4px 0px rgba(0,0,0,0.75),
                -2px -2px 4px 0px rgba(0,0,0,0.75),
                0px 0px 20px 0px rgba(255,255,255,0.75);
        }
    }

    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 98;
    }

    @media screen and (max-width: 640px) {
        .listing::before,
        .listing::after {
            display: none;
        }

        .title {
            font-size: 5vw;
        }

        .details {
            font-size: 4vw;
        }

        .icon {
            width: 4vw;
            height: 4vw;
        }

        .assetHolder,
        .fallback {
            width: 30vw;
        }

        .fallback>span {
            padding: 5vw;
        }

        .mobile-only {
            display: block;
            color: #888;
        }

        .zoom {
            width: 28vw;
            height: 21vw;
            left: 125%;
        }
    }
</style>
