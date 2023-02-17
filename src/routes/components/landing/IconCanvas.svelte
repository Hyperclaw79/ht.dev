<script>
    import { getContext } from "svelte";
    import { getIconData } from "./utils.js";

    const { skills } = Object.fromEntries(getContext("api"));

    const icons = (skillObj) => {
        return getIconData(skillObj["Technical Skills"].sort(
            () => Math.random() - 0.5).map((skill) => skill.icon
        ));
    };
</script>

<div>
    {#if $skills && $skills["Technical Skills"] && $skills["Soft Skills"]}
        {#each icons($skills) as icon}
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
    {/if}
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
