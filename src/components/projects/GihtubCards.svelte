<script>
	import repos from './data/projectMetadata.js';
    import Tiltable from "../Tiltable.svelte";
    import GhCard from './GhCard.svelte';

	let getProjectData = async () => {
		return await Promise.all(repos.map(async (data) => {
            let {is_on_github, ...project} = data;
            if (is_on_github) {
                let res = await fetch(`https://api.github.com/repos/hyperclaw79/${project.name}`)
                let data = await res.json();
                return {
                    ...project,
                    ...{
                        name: data.name || project.title,
                        description: data.description || project.description,
                        html_url: data.html_url,
                        stargazers_count: data.stargazers_count || 0,
                        watchers_count: data.watchers_count || 0,
                        forks_count: data.forks_count || 0
                    }
                }
            } else {
                return project;
            }
		}))
	};
</script>

<div class="githubCards">
    {#await getProjectData()}
        <p>Loading...</p>
    {:then repos}
        {#each repos as card, idx (card.id || card.name)}
            <Tiltable>
                <GhCard {...card} odd_or_even={idx}/>
            </Tiltable>
        {:else}
            <p>No projects found...</p>
        {/each}
    {/await}
</div>

<style>
    .githubCards {
		display: flex;
		gap: 1em;
		align-content: center;
		justify-content: center;
        flex-wrap: wrap;
        width: 80vw;
        margin-left: auto;
        margin-right: auto;
        user-select: none;
	}
</style>
