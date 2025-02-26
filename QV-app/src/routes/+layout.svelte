<script lang="ts">
	import { base } from '$app/paths';
	import Header from '$lib/components/Header.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import '../app.css';
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	// Pass in the content from +page.svelte at this scope 
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

	// Store the current url in a state variable
	let pageUrl = $state(page);

	// Function to update the body class background image based on page state
	function updateBodyClass() {
		if (!browser) return;

		document.body.classList.remove('body-image-default', 'body-image-grey', 'body-image-purple');

		if (
			pageUrl.url.pathname.startsWith('/simulations/onedimension') ||
			pageUrl.url.pathname.startsWith('/simulations/twodimension') ||
			pageUrl.url.pathname.startsWith('/simulations/threedimension')
		) {
			document.body.classList.add('body-image-grey');
		} else if (
			pageUrl.url.pathname.startsWith('/simulations/fission') ||
			pageUrl.url.pathname.startsWith('/simulations/fusion') 
		) {
			document.body.classList.add('body-image-purple');
		} else {
			document.body.classList.add('body-image-default');
		}
	}

	if (browser){$effect(updateBodyClass);} 

	onDestroy(() => {
		if (!browser) return;
		document.body.classList.remove("body-image-grey", "body-image-purple");
		document.body.classList.add("body-image-default");
	});
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
