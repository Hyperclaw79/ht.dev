<script>
    import IntersectionObserver from './components/IntersectionObserver.svelte';
	import Project from './components/projects/Projects.svelte';
    import Skills from './components/skills/Skills.svelte';
</script>

<main>
	<section id="projects">
		<Project />
	</section>
	<IntersectionObserver let:intersecting>
		<section id="skills">
			{#if intersecting}
				<Skills />
			{/if}
		</section>
	</IntersectionObserver>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>