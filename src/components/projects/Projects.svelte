<script>
	import GihtubCards from './GihtubCards.svelte';
</script>

<h1 class="font-effect-anaglyph">MY PROJECTS</h1>
<GihtubCards />

<style>
	h1 {
		--font-size: 3vw;
        margin: 0;
        font-size: var(--font-size);
	}

	@media screen and (max-width: 800px) {
		h1 {
			--font-size: 5vw;
		}
	}

	@media screen and (max-width: 640px) {
		h1 {
			--font-size: 8vw;
		}
	}
</style>