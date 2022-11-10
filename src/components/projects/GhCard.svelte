<script>
    import { fly, slide } from 'svelte/transition';

    export let name, title, description, image_url, tags;
    export let html_url = undefined;
    export let watchers_count = undefined;
    export let stargazers_count = undefined;
    export let forks_count = undefined;
    export let odd_or_even = undefined;
    $: card = {
        name,
        title,
        description,
        html_url,
        image_url,
        tags,
        watchers_count,
        stargazers_count,
        forks_count
    }
    let stats = {
        watchers: {
            count: watchers_count,
            icon: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
                    <path fill-rule="evenodd" d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"></path>
                </svg>`
        },
        stars: {
            count: stargazers_count,
            icon: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
                    <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
                </svg>`
        },
        forks: {
            count: forks_count,
            icon: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16">
                    <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                </svg>`
        }
    };
    $: all_stats_present = Object.values(stats).every(stat => stat.count !== undefined);
    $: non_zero_stats = Object.values(stats).reduce((a, b) => a + b.count, 0) > 0;
    $: display_stats = all_stats_present && non_zero_stats;
</script>

<div class="ghCard" transition:fly="{{ x: 100 * Math.pow(-1, odd_or_even)}}">
    <div class="titleHolder">
        <h2 class="title">
            <a
                href={card.html_url}
                target="_blank"
                rel="noopener noreferrer"
            >
                {card.title}
            </a>
        </h2>
    </div>
    <div class="cardBody" transition:slide="{{delay: 250, duration: 300}}">
        {#if card.image_url}
            <img
                src={card.image_url}
                alt={card.name}
            />
        {:else}
            <div class="fallback">
                <span>
                    No Image for this one...
                </span>
            </div>
        {/if}
        <pre class="description">{card.description}</pre>
        <p class="tags">
            Technologies Used: {card.tags.join(', ')}
        </p>
        {#if display_stats}
            <div class="statsHolder">
                <div>
                    <span>STATS</span>
                    <img src="/icons/github.png" alt="github icon" />
                </div>
                <p class="stats">
                    {#each Object.entries(stats) as [key, value]}
                        <span class="stat {key}">
                            <span class="statKey">
                                <span>{@html value.icon}</span>
                                <span>{key.toUpperCase()}</span>
                            </span>
                            <span class="statValue">{value.count}</span>
                        </span>
                    {/each}
                </p>
            </div>
        {/if}
    </div>
</div>

<style>
    .ghCard {
        --card-header-bg: var(--theme-primary);
        --card-bg: var(--theme-bg);
        --card-color: #eee;
        --tags-color: rgb(171, 171, 171);
        --stats-header-color: rgb(192, 192, 192);

        position: relative;
		background: var(--card-bg);
		color: var(--card-color);
		padding: 1em;
		margin: 1em 0;
		border-radius: 4px;
		width: 37vw;
        display: flex;
        flex-direction: column;
        filter: drop-shadow(2px 4px 6px black);
	}

    .ghCard .titleHolder {
        width: calc(100% + 2em);
        background: var(--card-header-bg);
        position: relative;
        margin-left: -1em;
        margin-top: -1em;
        margin-bottom: 1em;
        box-shadow: 0px 6px 4px 0px rgba(0,0,0,0.75);
    }

    .ghCard .title {
        text-decoration: none;
        text-transform: uppercase;
    }

    .ghCard .title a,
    .ghCard .title a:hover,
    .ghCard .title a:active,
    .ghCard .title a:visited {
        color: var(--card-color);
        text-decoration: none;
        cursor: pointer;
    }

    .ghCard .title a[href] {
        border-bottom: dashed;
    }

    .ghCard .cardBody {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .ghCard img,
    .ghCard .fallback {
        position: relative;
        width: 100%;
        height: calc(37vw / 2);
        pointer-events: none;
    }

    .ghCard .fallback {
        background: repeating-linear-gradient(
            45deg,
            #babbbf,
            #c3c3c3 10px,
            #929292 10px,
            #e1e1e1 20px
        );
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 5vw;
        color: rgba(255, 255, 255, 0.25);
    }

    .ghCard .description {
        --font-size: 1.25vw;
        font-weight: bold;
        white-space: pre-wrap;
        font-size: calc(var(--font-size) * 1);
        text-align: start;
    }

    .ghCard .tags {
        --font-size: 1vw;
        font-weight: bold;
        font-size: small;
        color: var(--tags-color);
        font-size: calc(var(--font-size) * 1);
        font-family: 'M PLUS 1 Code', sans-serif;
    }

    .ghCard .statsHolder {
        position: relative;
        display: flex;
        align-items: center;
        margin-top: auto;
        backdrop-filter: contrast(0.75);
        border: 1px dashed black;
        filter: drop-shadow(0px 2px 3px black);
    }

    .ghCard .statsHolder>div {
        display: flex;
        flex-direction: column;
        margin-left: auto;
        margin-right: auto;
        height: 100%;
        justify-content: space-evenly;
        align-items: center;
    }

    .ghCard .statsHolder>div>span {
        position: relative;
        font-weight: bold;
        font-size: larger;
        color: var(--stats-header-color);
    }

    .ghCard .statsHolder img {
        width: 3vw;
        height: 3vw;
    }

    .ghCard .stats {
        display: flex;
        width: 20vw;
        margin-left: auto;
        margin-right: auto;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 1em;
    }

    .ghCard .stat {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .ghCard .statKey>span:first-child {
        fill: var(--card-color);
        margin-right: 10px;
    }

    .ghCard .statValue {
        font-weight: bold;
    }

    @media screen and (max-width: 1200px) {
        .ghCard .description {
            font-size: calc(var(--font-size) * 1.5);
        }

        .ghCard .tags {
            font-size: calc(var(--font-size) * 1.5);
        }

        .ghCard .statsHolder>div img {
            width: 5vw;
            height: 5vw;
        }

    }

    @media screen and (max-width: 640px) {
        .ghCard {
            width: 100%;
        }

        .ghCard img {
            height: unset;
        }

        .ghCard .description {
            font-size: calc(var(--font-size) * 3);
        }

        .ghCard .tags {
            font-size: calc(var(--font-size) * 3);
        }

        .ghCard .statsHolder>div {
            margin-left: 4vw;
            margin-right: 4vw;
            gap: 1vw;
        }

        .ghCard .statsHolder>div img {
            width: 10vw;
            height: 10vw;
        }

        .ghCard .stats {
            width: 30vw;
        }
    }

    @media screen and (max-width: 480px) {
        .ghCard .stats {
            width: 40vw;
        }
    }

    @media screen and (max-width: 720px) and (min-width: 640px) {
        .ghCard .stats {
            font-size: 2vw;
        }
    }

</style>
