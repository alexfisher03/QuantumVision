<script lang="ts">
	import Header from './components/Header.svelte';
	import Nav from './components/Nav.svelte';
	import '../app.css';
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';


	let { children } = $props();
	
	// For view transition
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let pageUrl = $state(page);

</script>

<div class="app">
	<Header />
	{#if pageUrl.url.pathname === '/'}
		<Nav />
	{:else if pageUrl.url.pathname === '/simulations'}
		<Nav />
	{/if}

	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
	
</style>
