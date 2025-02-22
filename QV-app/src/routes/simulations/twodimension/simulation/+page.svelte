<svelte:head>
    <title>2D Simulation</title>
    <meta name="description" content="2-dimensional particle in a box simulation page" />
</svelte:head>

<script>
    import arrowup from "$lib/vectors/transitionarrow_up.svg";
    import x from "$lib/vectors/x.svg";
    import { WidgetPlaceholder } from 'flowbite-svelte';
    import { onMount } from "svelte";

    let WavefunctionGraph2D = $state();
    let loadingGraph = $state(true);

    onMount(async () => {
		const module = await import('$lib/components/WavefunctionGraph2D.svelte');
		WavefunctionGraph2D = module.default;
		loadingGraph = false;
	});

    let showDescription = $state(false);

    function toggleDescription() {
        showDescription = !showDescription;
    }
</script>

<section>
    <div class="flex justify-center">
        <h1 class="gradient-text text-transparent -translate-y-20 font-semibold animate-gradient w-fit">Particle in a 2-Dimensional Box</h1>
    </div>
    
    {#if !showDescription}
    <!-- SIMULATION -->
    <div class={loadingGraph ? "flex flex-col justify-start" : "flex flex-col justify-start lg:w-[400px] lg:h-[300px] xl:w-[500px] xl:h-[400px] md:pt-16 xl:pt-24 xxl:pt-48 lg:translate-y-12 lg:-translate-x-18 xl:-translate-x-24 xxl:mt-24"}>
        {#if loadingGraph}
            <div class="-translate-y-12 lg:w-[400px] lg:h-[300px] xl:w-[500px] xl:h-[400px]">
                <WidgetPlaceholder />
            </div>
        {:else}
        <h2 class="-translate-y-28">|ψ(x)|² : 2D Infinite Potential Well</h2>
            <WavefunctionGraph2D/>
        {/if}
    </div>
    {/if}

    
    <div class="flex flex-col items-center justify-center absolute right-10 top-1/2 transform -translate-y-1/2 pt-36 xl:pt-0 xxl:pt-0">
        {#if !showDescription}
            <h2 class="text-2xl font-semibold pt-10 -translate-x-16">2D Quantum States Simulation</h2>
            <p class="text-base text-gray-300 mt-2 w-[460px]">Observe and explore the quantum behavior of a particle confined in a 2-dimensional box. Adjust the energy levels to see how the particle’s wavefunction and probability distribution change in real time.</p>
            <div class="pt-3 -translate-x-40">
                <button onclick={toggleDescription} class="bg-transparent border border-white flex flex-row justify-center items-center rounded-3xl py-3 px-5 hover:scale-105 hover:translate-y-1 hover:underline transform transition duration-300 ease-in-out group text-white text-sm">See Instructions</button>
            </div>
        {:else}
            <div class="border border-white flex flex-col justify-start items-start rounded-3xl p-8 w-5/6 relative shadow-lg text-left space-y-4 mb-6">
            
                <span onclick={toggleDescription} class="absolute top-4 right-4 scale-90 hover:scale-110 transition ease-in-out duration-300 cursor-pointer">
                    <img src={x} alt="Close Simulation Instructions" />
                </span>
        
                <h3 class="text-lg font-semibold text-white">How to Use This Simulation</h3>
                <p class="text-sm text-gray-300">
                Use the dropdown menus to change the quantum numbers <b>nₓ</b> and <b>nᵧ</b>. These values determine the energy state of the particle confined in the 2D box. When you select new quantum numbers, the probability distribution (|ψ(x)|²) updates to reflect the new state.
                </p>

                <h3 class="text-lg font-semibold text-white">Understanding the Heatmap and Graph</h3>
                <p class="text-sm text-gray-300">
                The heatmap on the right displays the probability density of the particle. The gradient shows how likely the particle is to be found at a given point: blue indicates low probability, transitioning through purple and pink to yellow at the highest probability peaks.
                </p>
                <ul class="list-disc pl-4 text-sm text-gray-400">
                <li><b>X-axis:</b> Horizontal position within the box.</li>
                <li><b>Y-axis:</b> Depth position within the box.</li>
                <li><b>Z-axis:</b> Vertical position (reflecting probability density) within the box.</li>
                <li><b>Heatmap Colors:</b> Represent probability density from 0% (low) to high values (peaks).</li>
                <li><b>Boundaries:</b> The edges of the plot represent infinite potential energy walls, where the wavefunction goes to zero.</li>
                </ul>

                <h3 class="text-lg font-semibold text-white">Energy Levels</h3>
                <p class="text-sm text-gray-300">
                Higher quantum numbers lead to more oscillations and nodes in the wavefunction. Experiment with different combinations of <b>nₓ</b> and <b>nᵧ</b> to explore how the particle's behavior changes.
                </p>
                <p class="text-sm text-gray-400 italic">
                Try different energy states to see how the probability distribution and heatmap vary across the 2D box.
                </p>
            </div>
        {/if}
    </div>

    {#if !showDescription}
    <div class="flex justify-center">
        <a href="/simulations/twodimension" class="pt-40 bottom-4 transform pb-3">
            <img src={arrowup} alt="Move Back To 2D Info Page" class="hover:-translate-y-2 transform transition ease-in-out duration-200"/>
        </a>
    </div>
    {/if}
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

    .controls {
		position: absolute;
		left: 1em;
		top: 1em;
	}

	label {
		display: flex;
		width: 60px;
		gap: 0.5em;
		align-items: center;
	}

	input {
		width: 80px;
		margin: 0;
	}
</style>