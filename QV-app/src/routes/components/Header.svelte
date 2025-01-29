<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/images/atom-logo.png';
	import verticalLine from '$lib/images/vertical-line.png';
</script>

<header>
	{#if $page.url.pathname !== "/"}
	<a href="/" class="flex flex-row justify-start pt-8 pl-8 w-[90px] h-[80px]">
		<img src={logo} alt="QuantumVisionLogo" />
		<img class="pl-2" src={verticalLine} alt="VerticalLine" />
		<p class="text-white font-light pl-2">QUANTUM VISION</p>
	</a>
	{:else}	
	<div class="flex flex-row justify-start pt-8 pl-8 w-[90px] h-[80px]">
		<img src={logo} alt="QuantumVisionLogo" />
		<img class="pl-2" src={verticalLine} alt="VerticalLine" />
		<p class="text-white font-light pl-2">QUANTUM VISION</p>
	</div>
	{/if}
</header>

<style>
</style>