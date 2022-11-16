<script>
    import metadata from '../data/socialMetadata';

</script>

<footer>
    <div class="content">
        <div class="socials">
            {#each metadata as social (social.name)}
                <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="social"
                >
                    <img
                        class="icon"
                        src={social.icon}
                        alt={social.name}
                        title={social.name}
                    />
                    <span class="social-name">{social.name}</span>
                </a>
            {/each}
        </div>
        <div class="copyright">
            <span>© Harshith Thota </span>
            <span>2022</span>
        </div>
    </div>
</footer>

<style>
    footer {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 1rem;
		background: var(--theme-bg);
		user-select: none;
		box-shadow: 0px -2px 4px 1px black;
	}

    .content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }

    .socials {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1vw;
    }
    
    .social,
    .social:visited,
    .social:active {
        text-decoration: none;
        color: #eee;
    }

    .social {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1vw;
        padding: 0.5rem 0.75rem;
        border: 2px solid black;
        box-shadow: 0px 3px 2px 0px black;
        transition: all 0.25s ease-in-out;
    }

    .social::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: inherit;
        backdrop-filter: brightness(0.5);
        z-index: 0;
        transform-origin: left;
        transition: transform 0.25s ease-in-out;
    }

    .social>* {
        z-index: 2;
    }

    .social:hover {
        transform: scale(1.1);
    }

    .social:hover::after {
        transform: scaleX(0);
    }

    .social:active {
        box-shadow: none;
    }

    .social .icon {
        width: 2vw;
        height: 2vw;
        cursor: pointer;
    }

    .social .social-name {
        --base-font-size: 1.5vw;
        font-size: var(--base-font-size);
    }

    .copyright {
        --base-font-size: 2vw;
        font-size: var(--base-font-size);
    }

    .copyright span:last-child {
        font-size: calc(var(--base-font-size) * 0.8);
        filter: brightness(0.5);
    }

    @media screen and (max-width: 640px) {
        footer {
            padding: 2vw;
        }

        .socials {
            flex-direction: column;
            align-items: stretch;
        }

        .social .icon {
            width: 4vw;
            height: 4vw;
        }

        .social .social-name {
            --base-font-size: 3vw;
            font-size: var(--base-font-size);
        }

        .copyright {
            --base-font-size: 5vw;
        }
    }

</style>