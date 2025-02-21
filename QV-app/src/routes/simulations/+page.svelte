<svelte:head>
	<title>Select Simulation</title>
	<meta name="description" content="Simulations Page For Quantum Vision" />
</svelte:head>

<script lang="ts">
	import { goto } from "$app/navigation";
	import oneD from "$lib/images/1d_modal.png";
	import twoD from "$lib/images/2d_modal.png";
	import threeD from "$lib/images/3d_modal.png";
	import fission from "$lib/images/fission_modal.png";
	import fusion from "$lib/images/fusion_modal.png";
	import { checkViewport } from "$lib/scripts/checkViewport.js";

	import { onMount } from 'svelte';

	import { Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

	let isMobile = $state(checkViewport());
	let clickedModal = $state(false);

	onMount(() => {
		const updateViewport = () => {
			isMobile = checkViewport();
		};

		window.addEventListener('resize', updateViewport);
		return () => window.removeEventListener('resize', updateViewport);
	});

	function navigateTo(url: string) {
		let path = '/simulations' + url;
		goto(path);
	}

	function toggleModal() {
		clickedModal = !clickedModal;
	}

</script>

<section>

	{#if !isMobile}

	<!-- 1-3Dimensional Particle in a box modals -->
	<div class="flex sm:justify-center sm:flex-row sm:items-center space-x-28 xl:space-x-36 pt-12">
		<img on:click={() => navigateTo('/onedimension')} src={oneD} alt="onedimension simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out w-1/4 xl:size-64 xxl:w-1/3 xxl:h-1/3" />
		<img on:click={() => navigateTo('/twodimension')} src={twoD} alt="twodimension simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out w-1/4 xl:size-64 xxl:w-1/3 xxl:h-1/3" />
		<img on:click={() => navigateTo('/threedimension')} src={threeD} alt="threedimension simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out w-1/4 xl:size-64 xxl:w-1/3 xxl:h-1/3" />
	</div>

	<!-- fission and fusion modals  -->
	<div class="flex sm:justify-center sm:flex-row sm:items-center space-x-44 pt-20 pb-3">
		<img on:click={() => navigateTo('/fission')} src={fission} alt="fission simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out w-1/4 xl:size-64 xxl:w-1/3 xxl:h-1/3"/>
		<img on:click={() => navigateTo('/fusion')} src={fusion} alt="fusion simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out w-1/4 xl:size-64 xxl:w-1/3 xxl:h-1/3"/>
	</div>

	{:else}

	<!-- 1-3Dimensional Particle in a box modals -->
	<div class="flex justify-center sm:items-center pt-12">
		<div class="grid grid-cols-2 gap-3">
			<img on:click={toggleModal} src={oneD} alt="onedimension simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out" />
			<img on:click={toggleModal} src={twoD} alt="twodimension simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out" />
			<img on:click={toggleModal} src={threeD} alt="threedimension simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out" />

		<!-- fission and fusion modals  -->
			<img on:click={toggleModal} src={fission} alt="fission simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out"/>
			<img on:click={toggleModal} src={fusion} alt="fusion simulation" class="hover:translate-y-3 hover:scale-105 transform transition duration-500 ease-in-out"/>
		</div>
	</div>
		{#if clickedModal}
		<div class="top-1/3" on:click={toggleModal}>
			<Alert border color="red">
				<InfoCircleSolid slot="icon" class="w-5 h-5" />
				<span class="font-bold italic">Sorry!</span>
				This app is not optimized for mobile devices. Please use a larger device for the best experience.
			</Alert>
		</div>
		{/if}
	{/if}
</section>
