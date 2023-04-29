<script>
    import Mobile from "./Mobile.svelte";
    import Monitor from "./Monitor.svelte";
</script>

<div class="fallback">
    <p>
        PLEASE SWITCH TO A DESKTOP
        FOR AN ENHANCED USER EXPERIENCE.
    </p>
    <div class="morph">
        <Mobile />
        <Monitor />
    </div>
    <div class="scroll-down">
        <div class="label">Scroll Down</div>
        <div class="chevron" />
    </div>
</div>

<style>
    .fallback {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100vh;
        background: linear-gradient(
            180deg,
            var(--theme-bg) 40%,
            var(--theme-primary) 60%,
            var(--theme-bg) 80%)
        ;
        background-size: 100% 50%;
        border: 2px solid var(--theme-primary);
        padding: 0.5em;
        margin-left: -0.5em;
        margin-top: -0.5em;
        margin-bottom: 8%;
        animation: gradient 15s ease infinite alternate;
    }

    .fallback p {
        width: 100%;
        font-size: 10vw;
        font-family: monospace;
        white-space: pre-line;
    }

    .morph {
        position: relative;
        width: 30vw;
        height: 30vw;
        margin: auto;
        transform: translateX(-40%);
    }

    .scroll-down {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 5vw;
        font-weight: 500;
        cursor: pointer;
        margin-bottom: 12vh;
    }

    .scroll-down .label {
        --x-start: 0;
        --x-end: 0;
        --y-start: 0;
        --y-end: 4vh;
        animation: moveDown 1s ease-in-out infinite;
    }
    
    .scroll-down .chevron {
        --x-start: 0;
        --x-end: 0;
        --y-start: 0;
        --y-end: 4vh;
        position: relative;
        border-left: 5vw solid transparent;
        border-right: 5vw solid transparent;
        border-top: 5vw solid white;
        animation: moveDown 1s ease-in-out infinite;
    }
    
    .scroll-down .chevron::after {
        --x-start: -5vw;
        --x-end: -5vw;
        --y-start: -3vw;
        --y-end: calc(4vh - 3vw);
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 50%;
        transform: translate(-5vw, -3vw);
        border-left: 5vw solid transparent;
        border-right: 5vw solid transparent;
        border-top: 5vw solid rgba(255, 255, 255, 0.5);
        animation: moveDown 1s ease-in-out infinite;
    }

    @keyframes gradient {
        0% {
            background-position: 100% 100%;
        }
        50% {
            background-position: 100% 0%;
        }
        100% {
            background-position: 100% 100%;
        }
    }

    @keyframes moveDown {
        0%, 100% {
            transform: translate(var(--x-start), var(--y-start));
        }
        50% {
            transform: translate(var(--x-end), var(--y-end));
        }
    }
</style>
