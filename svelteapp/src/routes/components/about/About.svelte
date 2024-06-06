<script>
    import { getContext } from "svelte";
    import Typewriter from "../Typewriter.svelte";
    import Header from "./Header.svelte";
    import SkillTable from "./SkillTable.svelte";
    import { extractEndYear, firstExpJob } from "../../../utils";

    export let inview;
    
    const { experience } = Object.fromEntries(getContext("api"));

    let start = new Date(2019, 0, 2);
    let end = new Date();
    
    $: yearsElapsed = ((end - start) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

    $: if ($experience.length > 0) {
        start = new Date(firstExpJob($experience).year.split(" – ")[0]);
        end = extractEndYear($experience[0]);
    }
    
    $: data = [
        `Hey there! 👋 Glad to see you checkout my portfolio.
        I'm an enthusiastic Python Developer with ${yearsElapsed} years of professional experience in developing various applications using the latest technologies and industry practices.
        I have worked on applications ranging from Satellite Communication systems to Cloud ECommerce websites to Payment Gateways.
        I also have a bit of Frontend and CI/CD experience from my hobby projects.`,
        `I'm actively looking for interesting projects to collaborate on.
        Let's build something amazing together!`
    ];

    let needToType = false;
    let typeNextPara = false;
    let cleanContent = false;
    let showSkills = false;

    const { socials } = Object.fromEntries(getContext("api"));
    
    $: if (inview) {
        needToType = true;
        cleanContent = false;
    } else {
        cleanContent = true;
        showSkills = false;
    }
</script>

<h1 class="font-effect-anaglyph">
    About
</h1>
<div class="about">
    <Header socials={$socials} />
    <div class="content">
        <div class="description">
            <Typewriter
                data={data[0]}
                needToType={needToType}
                callback={() => {
                    needToType = false;
                    showSkills = true;
                    setTimeout(() => { typeNextPara = true; }, 2100);
                }}
                cleaner={cleanContent}
            />
            <SkillTable show={showSkills} />
            <Typewriter
                data={data[1]}
                needToType={typeNextPara}
                callback={() => { typeNextPara = false; }}
                cleaner={cleanContent}
            />
        </div>
    </div>
</div>

<style>
    .about {
        --grey: rgba(24, 24, 24, 1);
        display: flex;
        flex-direction: column;
        align-items: center;
        background-image: radial-gradient(circle, rgba(24,24,24,0.5) 60%, rgba(0,0,0,1) 120%);
        color: #fff;
        width: 80vw;
        height: 100%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 1em;
        min-height: 80vh;
        padding: 1.5rem 0;
        border: 10px solid var(--theme-primary);
        box-shadow:
            2px 2px 2px 2px black,
            -2px -2px 2px 2px black;
        user-select: none;
    }

    .content {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 80vw;
        height: 100%;
    }

    .description {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 100%;
        gap: 1rem;
        font-size: 1.5vw;
        text-align: start;
        color: #ccc;
        font-family: monospace;
        white-space: pre-line;
        padding: 0 1.5rem;
        margin-bottom: auto;
    }

    @media screen and (max-width: 640px) {
        .about {
            width: 80vw;
            border: 5px solid var(--theme-primary);
            margin-left: auto;
            margin-right: auto;
        }

        .description {
            font-size: 3.5vw;
            width: 88vw;
            padding: 0 2vw;
        }

        .description::after {
            display: none;
        }
    }
</style>
