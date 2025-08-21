<script>
    export let socials;
</script>

<div class="header">
    <div class="headerLeft">
        <div class="nameHolder">
            <div class="name firstname">
                <span class="cap">H</span>
                <span>ARSHITH</span>
            </div>
            <div class="name lastname">
                <span class="cap">T</span>
                <span>HOTA</span>
            </div>
        </div>
        <code>
            <div class="codeChild" data-switched="🐍&nbsp;" style="--align: right;">PYTHON</div>
            <div class="codeChild" data-switched="👨‍💻" style="--align: left;">DEVELOPER</div>
        </code>
    </div>
    <div class="headerRight">
        <img src="https://avatars.githubusercontent.com/u/29298411?v=4" alt="Avatar" />
        <div class="socials">
            {#if socials}
                {#each socials as social (social.name)}
                    {#if social.url && social.icon}
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
                        </a>
                    {/if}
                {/each}
            {/if}
        </div>
    </div>
</div>

<style>
    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        text-align: center;
        justify-content: space-around;
    }

    .header > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .nameHolder {
        position: relative;
        overflow: hidden;
        width: 20ch;
        font-size: 2.25vw;
    }

    .name {
        display: inline;
        position: relative;
        transition: all 1s ease;
    }

    .name > * {
        overflow: hidden;
        display: inline-block;
        vertical-align: middle;
    }

    .cap {
        font-size: 3.5vw;
        color: var(--theme-primary);
        font-family: "Exo", monospace;
        text-shadow:
            0px 0px 0 rgb(137,-14,0),
            1px 1px 0 rgb(115,-36,0),
            2px 2px 0 rgb(92,-59,0),
            3px 3px 0 rgb(70,-81,0),
            4px 4px 0 rgb(48,-103,0),
            5px 5px  0 rgb(26,-125,0),
            6px 6px 5px rgba(0,0,0,1),
            6px 6px 1px rgba(0,0,0,0.5),
            0px 0px 5px rgba(0,0,0,.2);
        animation: none;
    }

    .name.firstname > span:not(.cap) {
        animation: slide 3s ease infinite;
    }

    .name.lastname > span:not(.cap) {
        display: inline-block;
        animation: squeeze 3s ease infinite;
        transform-origin: left;
    }

    .name > span.cap {
        display: inline;
    }

    code {
        font-size: 1.5vw;
        color: grey;
        animation: recenter 3s ease infinite;
    }

    .codeChild {
        display: inline-block;
        position: relative;
        background: #151515;
        transform-style: preserve-3d;
        animation: flipper 3s ease infinite;
    }

    .codeChild::after {
        content: attr(data-switched);
        text-align: var(--align);
        display: inline-block;
        position: absolute;
        left: 1vw;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: #151515;
        transform-style: preserve-3d;
        transform: rotateX(270deg) translateZ(1em);
    }

    @keyframes slide {
        0% {
            width: 0%;
            opacity: 0;
        }
        50% {
            width: 7ch;
            opacity: 1;
        }
        100% {
            width: 0%;
            opacity: 0;
        }
    }

    @keyframes squeeze {
        0% {
            transform: scaleX(0);
            opacity: 0;
        }
        50% {
            transform: scaleX(1);
            opacity: 1;
        }
        100% {
            transform: scaleX(0);
            opacity: 0;
        }
    }

    @keyframes recenter {
        0% {
            transform: translateX(-3.5ch);
        }
        50% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-3.5ch);
        }
    }

    @keyframes flipper {
        0%, 100% {
            transform: rotateX(90deg);
            color: var(--theme-bg);
        }
        50% {
            transform: rotateX(0);
            color: currentColor;
        }
    }

    .headerRight {
        gap: 1rem;
    }

    img {
        width: 8vw;
        height: 8vw;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
        transition: all 0.25s ease-in-out;
    }

    .social>* {
        z-index: 2;
    }

    .social:hover {
        transform: scale(1.1);
    }

    .social:active {
        box-shadow: none;
    }

    .social .icon {
        width: 2vw;
        height: 2vw;
        cursor: pointer;
    }

    @media screen and (max-width: 640px) {
        code,
        .nameHolder * {
            animation: none !important;
        }

        .nameHolder {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            font-size: 4vw;
            line-height: 1;
        }

        .cap {
            font-size: 6vw;
        }

        code {
            font-size: 3vw;
        }

        .headerRight {
            gap: 2rem;
        }

        img {
            width: 16vw;
            height: 16vw;
        }

        .socials {
            gap: 2vw;
        }

        .social .icon {
            width: 4vw;
            height: 4vw;
        }
    }
</style>
