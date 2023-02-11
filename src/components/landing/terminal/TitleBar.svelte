<script>
    export let data;
</script>

<div class="titleBar">
    <span class="titleBarText">{data.user}:{data.cwd}</span>
    <div class="titleBarButtons">
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="titleBtn"
        >
            <rect x="3" y="19" width="18" height="2" />
        </svg>
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="titleBtn"
        >
            <rect x="3" y="3" width="18" height="2" />
            <rect x="3" y="19" width="18" height="2" />
            <rect x="3" y="11" width="2" height="8" />
            <rect x="19" y="11" width="2" height="8" />
        </svg>
        <svg class="titleBtn" viewBox="0 0 24 24">
            <path
                d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"
            />
        </svg>
    </div>
</div>

<style>
    .titleBar {
        position: relative;
        display: flex;
        align-items: center;
        width: 80vw;
        height: 1.5em;
        background: black;
        z-index: 99;
        border: 5px solid var(--theme-primary);
        user-select: none;
    }
    .titleBar .titleBarText {
        color: #ccc;
        font-family: monospace;
        font-size: 1vw;
        padding-left: 0.5em;
        padding-right: 0.5em;
        margin-left: auto;
        margin-left: auto;
    }
    .titleBar .titleBarButtons {
        --icon-size: 1.25em;
        display: flex;
        margin-left: auto;
        padding-right: var(--icon-size);
        align-items: center;
        gap: calc(var(--icon-size) / 2);
    }
    .titleBar .titleBtn {
        display: inline-block;
        width: var(--icon-size);
        height: var(--icon-size);
        fill: #ccc;
        cursor: pointer;
    }
    .titleBar .titleBtn:hover {
        fill: #fff;
    }
</style>
