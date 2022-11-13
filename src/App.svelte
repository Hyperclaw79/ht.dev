<script>
	import Project from "./components/projects/Projects.svelte";
	import Skills from "./components/skills/Skills.svelte";
	import IntersectionObserver from "./components/IntersectionObserver.svelte";
</script>

<main>
	<section id="projects">
		<Project />
	</section>
	<section id="skills">
		<IntersectionObserver let:intersecting>
			<Skills inview={intersecting}/>
		</IntersectionObserver>
	</section>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>
