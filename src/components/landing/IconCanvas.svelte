<script>
    import icons from "./utils.js";
</script>

<div>
    {#each icons as icon}
        <img
            key={icon.icon}
            class="icon"
            src={icon.icon}
            alt="Technical Skill Icon"
            style={`
                transform: rotate(${icon.rotation}deg);
                top: ${icon.position.y}px;
                left: ${icon.position.x}px;
            `}
        />
    {/each}
</div>

<style>
    .icon {
        --size: 6vw;
        position: absolute;
        filter: grayscale(0.75);
        opacity: 25%;
        width: var(--size);
        height: var(--size);
    }
</style>