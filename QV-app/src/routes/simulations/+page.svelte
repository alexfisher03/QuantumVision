<svelte:head>
	<title>Simulations</title>
	<meta name="description" content="Simulations Page For Quantum Vision" />
</svelte:head>

<script>
	import oneD from "$lib/images/1d_modal.png";
	import twoD from "$lib/images/2d_modal.png";
	import threeD from "$lib/images/3d_modal.png";
	import fission from "$lib/images/fission_modal.png";
	import fusion from "$lib/images/fusion_modal.png";

	import { onMount } from 'svelte';

	let isMobile = false;

	function checkViewport() {
		isMobile = window.innerWidth < 768;
	}

	onMount(() => {
		checkViewport();
		window.addEventListener('resize', checkViewport);

		return () => window.removeEventListener('resize', checkViewport);
	});
</script>

<section>

	{#if !isMobile}

	<!-- 1-3Dimensional Particle in a box modals -->
	<div class="flex sm:justify-center sm:flex-row sm:items-center space-x-28 xl:space-x-36 pt-12">
		<img src={oneD} alt="onedimension simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out w-1/4 xl:size-64 xxl:w-1/3" />
		<img src={twoD} alt="twodimension simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out w-1/4 xl:size-64 xxl:w-1/3" />
		<img src={threeD} alt="threedimension simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out w-1/4 xl:size-64 xxl:w-1/3" />
	</div>

	<!-- fission and fusion modals  -->
	<div class="flex sm:justify-center sm:flex-row sm:items-center space-x-44 pt-20 pb-3">
		<img src={fission} alt="fission simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out w-1/4 xl:size-64 xxl:w-1/3"/>
		<img src={fusion} alt="fusion simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out w-1/4 xl:size-64 xxl:w-1/3"/>
	</div>

	{:else}

	<!-- 1-3Dimensional Particle in a box modals -->
	<div class="flex justify-center sm:items-center pt-12">
		<div class="grid grid-cols-2 gap-3">
			<img src={oneD} alt="onedimension simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out" />
			<img src={twoD} alt="twodimension simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out" />
			<img src={threeD} alt="threedimension simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out" />

		<!-- fission and fusion modals  -->
			<img src={fission} alt="fission simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out"/>
			<img src={fusion} alt="fusion simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out"/>
		</div>
	</div>
	{/if}
</section>
