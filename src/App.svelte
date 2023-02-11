<script>
	import Landing from './components/landing/Landing.svelte';
	import Experience from './components/experience/Experience.svelte';
	import Project from "./components/projects/Projects.svelte";
	import Skills from "./components/skills/Skills.svelte";
    import Achievements from "./components/achievements/Achievements.svelte";
	import IntersectionObserver from "./components/IntersectionObserver.svelte";
    import Footer from "./components/Footer.svelte";
    import { onMount } from 'svelte';

	let landing;

	const launch = () => {
		document.querySelector('body').style.overflow = "auto";
		landing.style.marginBottom = "0px";
	}

	onMount(() => {
		history.scrollRestoration = 'manual';
		location.href = "#landing";
	})
</script>

<main>
	{#if window.innerWidth > 800 && !('ontouchstart' in window)}
		<section id="landing" bind:this={landing}>
			<Landing on:shrunkEvent={launch} />
		</section>
	{/if}
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
	<Footer />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>
