<script lang="ts">
	import logo from '$lib/images/atom-logo.png';
	import verticalLine from '$lib/images/vertical-line.png';

	import { page } from "$app/state";

	let pageUrl = $state(page);
</script>

<header class="group">
	<a href="/" class="flex flex-row justify-start pt-8 pl-8 w-[90px] h-[80px]">
		<img src={logo} alt="QuantumVisionLogo" 
			class="group-hover:rotate-12 transform transition ease-in-out duration-200 hover:shadow-purple-950" />
		<img class="pl-2" src={verticalLine} alt="VerticalLine" />
		<p class="text-white font-light pl-2">QUANTUM VISION</p>
	</a>
	{#if pageUrl.url.pathname.startsWith('/simulations/') && pageUrl.url.pathname !== '/simulations'}
		<a href="/simulations" class="flex justify-end pr-16 -translate-y-4 font-bold hover:underline">BACK TO SIMULATIONS</a>
	{/if}
	</header>

<style>
	header {
		view-transition-name: header;
	}
</style>