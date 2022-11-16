<script>
	import Project from "./components/projects/Projects.svelte";
	import Skills from "./components/skills/Skills.svelte";
    import Achievements from "./components/achievements/Achievements.svelte";
	import IntersectionObserver from "./components/IntersectionObserver.svelte";
    import Footer from "./components/Footer.svelte";
</script>

<main>
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
