<script>
	import Project from "./components/projects/Projects.svelte";
	import Skills from "./components/skills/Skills.svelte";
    import Achievements from "./components/achievements/Achievements.svelte";
	import IntersectionObserver from "./components/IntersectionObserver.svelte";
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
	<!-- Dummy Section to prevent scroll snap to top for Achievements -->
	<section />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>
