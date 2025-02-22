<svelte:head>
	<title>1D Simulation</title>
	<meta name="description" content="1-dimensional particle in a box simulation page" />
</svelte:head>

<script>
    import arrowup from "$lib/vectors/transitionarrow_up.svg";
    import x from "$lib/vectors/x.svg";
    import { onMount } from "svelte";
    import { WidgetPlaceholder } from 'flowbite-svelte';

    let WavefunctionGraph = $state();
    let loadingGraph = $state(true);

    onMount(async () => {
		const module = await import('$lib/components/WavefunctionGraph1D.svelte');
		WavefunctionGraph = module.default;
		loadingGraph = false;
	});

    // Description Logic
    let showDescription = $state(false);

    function toggleDescription() {
        showDescription = !showDescription;
    }


</script>

<section>
    <div class="flex justify-center">
        <h1 class="gradient-text text-transparent -translate-y-20 font-semibold animate-gradient w-fit">Particle in a 1-Dimensional Box</h1>
    </div>

    <div class="flex flex-col justify-start max-w-[500px] md:pt-16 xl:pt-24 xxl:pt-36">
        {#if loadingGraph}
            <WidgetPlaceholder />
		{:else}
        <div class="lg:-translate-x-16 xl:-translate-x-24">
            <WavefunctionGraph/>
        </div>
        {/if}
    </div>

    
    <div class="flex flex-col items-center justify-center absolute right-10 top-1/2 transform -translate-y-1/2 pt-36 xl:pt-0 xxl:pt-0">
        {#if !showDescription}
            <h2 class="text-2xl font-semibold pt-10 -translate-x-16">1D Quantum States Simulation</h2>
            <p class="text-base text-gray-300 mt-2 w-[460px]">Observe and explore the quantum behavior of a particle confined in a 1-dimensional box. Adjust the energy levels to see how the particle’s wavefunction and probability distribution change in real time.</p>
            <div class="pt-3 -translate-x-40">
                <button onclick={toggleDescription} class="bg-transparent border border-white flex flex-row justify-center items-center rounded-3xl py-3 px-5 hover:scale-105 hover:translate-y-1 hover:underline transform transition duration-300 ease-in-out group text-white text-sm">See Instructions</button>
            </div>
        {:else}
            <div class="border border-white flex flex-col justify-start items-start rounded-3xl p-8 w-5/6 relative shadow-lg text-left space-y-4 lg:translate-y-12 lg:translate-x-12 xl:translate-x-6">
            
                <span onclick={toggleDescription} class="absolute top-4 right-4 scale-90 hover:scale-110 transition ease-in-out duration-300 cursor-pointer">
                    <img src={x} alt="Close Simulation Instructions" />
                </span>
        
                <h3 class="text-lg font-semibold text-white">How to Use This Simulation</h3>
                <p class="text-sm text-gray-300">
                    Click an <b>energy level (E₁, E₂, ...)</b> to observe how the wavefunction and probability distribution change.
                </p>
        
                <h3 class="text-lg font-semibold text-white">Understanding the Graph</h3>
                <p class="text-sm text-gray-300">
                    The graph displays <b>|ψ(x)|²</b>, showing where the particle is most likely to be found.
                </p>
                <ul class="list-disc pl-4 text-sm text-gray-400">
                    <li><b>X-axis:</b> Position inside the box.</li>
                    <li><b>Y-axis:</b> Probability density.</li>
                    <li><b>Higher energy levels:</b> More oscillations.</li>
                </ul>

                <h3 class="text-lg font-semibold text-white">Energy Levels</h3>
                <p class="text-sm text-gray-300">
                    Higher quantum states result in more peaks and nodes in the wavefunction.
                </p>

                <p class="text-sm text-gray-400 italic">
                    Try selecting different energy levels and observe the differences!
                </p>
            </div>
        {/if}
    </div>

    <div class="flex justify-center pt-6 mt-auto">
        <a href="/simulations/onedimension" class="relative">
            <img src={arrowup} alt="Move Back To 1D Info Page" class="hover:-translate-y-2 transform transition ease-in-out duration-200"/>
        </a>
    </div>
</section>

<style>
    .gradient-text {
        background: linear-gradient(
            to right,
            #393939,
            #5c5c5c,
            #999999,
            #FFFFFF,
            #999999,
            #5c5c5c,
            #393939,
            #5c5c5c,
            #999999,
            #FFFFFF
        );
        background-size: 300% 300%;
        background-clip: text;
    }
</style>