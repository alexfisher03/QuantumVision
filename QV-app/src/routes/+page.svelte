<script>
	import arrow from '$lib/vectors/getstartedarrow.svg';
	import linkedin from '$lib/vectors/linkedin.svg';
	import avatar from '$lib/vectors/Avatar.svg';
</script>

<svelte:head>
	<title>Quantum Vision</title>
	<meta name="description" content="Interactive Modern Physics Web Application" />
</svelte:head>

<section class="flex flex-col justify-center items-center translate-y-16">
	<h1 class="text-3xl sm:text-3xl lg:text-6xl">Quantum Vision</h1>
	<p class="text-base sm:text-2xl body-text pt-8 w-2/3 text-center">Explore modern physics and quantum mechanics interactively through this Python-based app</p>

	<div class="flex flex-row justify-center pt-8 space-x-6 translate-x-14">
		<a href="/simulations">
			<button class="bg-transparent border border-white flex flex-row justify-center items-center rounded-2xl py-2.5 px-3.5 hover:scale-105 hover:translate-y-0.5 transform transition duration-300 ease-in-out group">
				<span class="pr-2 group-hover:text-gray-200">Get Started</span>
				<img src={arrow} alt="Arrow" class="w-3 h-3 transform transition duration-300 ease-in-out group-hover:rotate-90" />
			</button>
		</a>

		<!-- TODO: Add hover effect to linkedin and avatar -->
		<div class="-translate-y-0.5 flex flex-row">
			<a class="translate-y-1 translate-x-3" target="_blank" href="https://alexfisher03.github.io/portfolio">
				<img src={avatar} alt="Avatar" class="w-10 h-10"/>
			</a>

			<a class="z-10 -translate-x-0.5" target="_blank" href="https://www.linkedin.com/in/fisheralexander03/">
				<img src={linkedin} alt="LinkedIn" class="w-12 h-12"/>
			</a>
			
			<p class="font-light text-xs w-1/2 text-center translate-y-1.5 body-text">Created by Alexander Fisher</p>
		</div>
	</div>

</section>
