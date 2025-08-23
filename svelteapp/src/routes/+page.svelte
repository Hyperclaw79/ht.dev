<script>
    import { onMount, setContext } from "svelte";
    import { writable } from "svelte/store";
    import Landing from "./components/landing/Landing.svelte";
    import Experience from "./components/experience/Experience.svelte";
    import Project from "./components/projects/Projects.svelte";
    import Skills from "./components/skills/Skills.svelte";
    import Achievements from "./components/achievements/Achievements.svelte";
    import IntersectionObserver from "./components/IntersectionObserver.svelte";
    import Footer from "./components/Footer.svelte";
    import About from "./components/about/About.svelte";
    import MobileFallback from "./components/landing/MobileFallback.svelte";
    import DownloadResume from "./components/DownloadResume.svelte";

    let landing;
    const achievements = writable([]);
    const experience = writable([]);
    const projects = writable([]);
    const skills = writable([]);
    const socials = writable([]);
    const apiMap = new Map(Object.entries({
        achievements,
        experience,
        projects,
        skills,
        socials
    }));
    setContext("api", apiMap);

    const launch = () => {
        document.querySelector("body").style.overflow = "auto";
        landing.style.marginBottom = "0px";
    };

    onMount(async () => {
        document.querySelectorAll("h1").forEach((h1) => {
            const text = h1.innerText;
            h1.innerHTML = "";
            text.split("").forEach((char) => {
                const span = document.createElement("span");
                span.innerText = char;
                h1.appendChild(span);
            });
        });
        history.scrollRestoration = "manual";
        location.href = "#landing";
        for (const [key, value] of apiMap) {
            await fetch(`/api/${key}`).then(
                async (res) => value.set(await res.json())
            );
        }
    });
</script>

<main>
    {#if window.innerWidth > 800 && !("ontouchstart" in window)}
        <section id="landing" bind:this={landing}>
            <Landing on:shrunkEvent={launch} />
        </section>
    {:else}
        <MobileFallback />
    {/if}
    <section id="about">
        <IntersectionObserver let:intersecting >
            <About inview={intersecting} />
        </IntersectionObserver>
    </section>
    <section id="experience">
        <Experience />
    </section>
    <section id="projects">
        <IntersectionObserver let:intersecting >
            <Project inview={intersecting} />
        </IntersectionObserver>
    </section>
    <section id="skills">
        <IntersectionObserver let:intersecting >
            <Skills inview={intersecting} />
        </IntersectionObserver>
    </section>
    <section id="achievements">
        <Achievements />
    </section>
    <section id="downloadResume">
        <DownloadResume />
    </section>
    <Footer />
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }
</style>
