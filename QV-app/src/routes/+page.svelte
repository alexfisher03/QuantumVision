<script>
	import arrow from '$lib/vectors/getstartedarrow.svg';
	import linkedin from '$lib/vectors/linkedin.svg';
	import avatar from '$lib/vectors/Avatar.svg';

	import { onMount } from 'svelte';

	// To check if the user is on a mobile device
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

<svelte:head>
	<title>Home – Quantum Vision </title>
	<meta name="description" content="Interactive Modern Physics Web Application" />
</svelte:head>

<section class="flex flex-col justify-center items-center absolute top-1/3">
	<h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl gradient-text animate-gradient text-transparent">Quantum Vision</h1>
	<p class="text-base sm:text-2xl body-text pt-8 w-2/3 text-center">Explore modern physics and quantum mechanics interactively through this Python-based app</p>

	<div class="flex flex-row justify-center pt-8 space-x-6 translate-x-14">
		<a href="/simulations">
			<button class="bg-transparent border border-white flex flex-row justify-center items-center rounded-2xl py-2.5 px-3.5 hover:scale-105 hover:translate-y-0.5 transform transition duration-300 ease-in-out group">
				<span class="pr-2 group-hover:text-gray-200">Get Started</span>
				<img src={arrow} alt="Arrow" class="w-3 h-3 transform transition duration-300 ease-in-out group-hover:rotate-90" />
			</button>
		</a>

		<div class="-translate-y-0.5 flex flex-row">
			<a class="translate-y-1 translate-x-5 hover:translate-y-2 hover:scale-y-95 transform transition duration-200 ease-in-out" target="_blank" href="https://alexfisher03.github.io/portfolio">
				<img src={avatar} alt="Avatar" class="w-10 h-10"/>
			</a>

			<a class="z-10 translate-x-2 hover:translate-y-2 hover:scale-y-95 transform transition duration-200 ease-in-out" target="_blank" href="https://www.linkedin.com/in/fisheralexander03/">
				<img src={linkedin} alt="LinkedIn" class="w-12 h-12"/>
			</a>
			
			<p class="font-light text-xs sm:text-sm w-1/2 text-center translate-y-1.5 body-text">Created by Alexander Fisher</p>
		</div>
	</div>

	<!-- mobile warning -->
	{#if isMobile}
		<div class="flex justify-center pt-12 items-center text-center">
			<p class="text-xl text-red-300"> For the best experience, please interact with this app on a larger device </p>
		</div>
	{/if}

</section>

<style>
	.gradient-text {
        background: linear-gradient(
            to right,
            #2e557e,
            #999999,
            #FFFFFF,
            #999999,
            #2e557e,
            #999999,
            #FFFFFF
        );
        background-size: 300% 300%;
        background-clip: text;
    }
</style>