<svelte:head>
	<title>1D Simulation</title>
	<meta name="description" content="1-dimensional particle in a box simulation page" />
</svelte:head>

<script>
    import arrowup from "$lib/vectors/transitionarrow_up.svg";
    import x from "$lib/vectors/x.svg";
    import { writable } from "svelte/store";

    import '@carbon/charts-svelte/styles.css'
	import { LineChart, ScaleTypes } from "@carbon/charts-svelte";

    import { computeWaveFunction } from "$lib/scripts/wavefunction.js";

    let selectedEnergyLevel = writable(1);
    let data = $state(computeWaveFunction(1));

    $effect(() => {
    selectedEnergyLevel.subscribe(n => {
        data = computeWaveFunction(n);
        });
    });

    let energyLevels = [1, 2, 3, 4];

    let options = {
        title: "|ψ(x)|² : 1D Infinite Potential Well",
        axes: {
            bottom: { title: "Position (x)", mapsTo: "key", scaleType: ScaleTypes.LINEAR },
            left: { title: "Potential Energy (V)", mapsTo: "value", scaleType: ScaleTypes.LINEAR, ticks: { formatter: () => "" } }, 
        },
        height: "400px",
        width: "550px",
        curve: "curveMonotoneX",
        theme: "g90",
        legend: { enabled: false }, 
        tooltip: { enabled: false }, 
        grid: { x: { enabled: false }, y: { enabled: false } },
        toolbar: { enabled: false },
        points: { enabled: false },
        
    };

    /**
     * Sets the selected energy level.
     * @param {number} level - The selected energy level.
    */
    function selectEnergyLevel(level) {
        selectedEnergyLevel.set(level);
    }

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

    <div class="flex flex-col justify-start max-w-[500px] md:pt-16 xl:pt-24 xxl:pt-36 -translate-x-24">
        <div class="flex justify-center w-full">
            <LineChart {data} {options} />
        </div> 
        <div class="relative w-full pt-6 flex justify-center -translate-x-6">
            <svg class="w-[300px] md:w-[400px] lg:w-[500px] h-[120px]" viewBox="0 0 300 120">
                {#each energyLevels as level, i}                    
                <rect x="15" y="{110 - level * 20 - 5}" width="270" height="10"
                fill="transparent" class="cursor-pointer"
                onclick={() => selectEnergyLevel(level)}
                />
            
                <line x1="20" x2="280" y1="{110 - level * 20}" y2="{110 - level * 20}" 
                    stroke={ $selectedEnergyLevel === level ? 'red' : 'white' } 
                    stroke-width="2"
                    class="cursor-pointer hover:stroke-purple-500 hover:stroke-[4px] transition duration-300 ease-in-out"
                    onclick={() => selectEnergyLevel(level)}
                />        
                
                <text x="285" y="{110 - level * 20 + 6}" 
                    fill={ $selectedEnergyLevel === level ? 'red' : 'white' } 
                    font-size="14px"
                    font-weight="bold"
                    class="cursor-pointer hover:fill-purple-500 transition duration-300 ease-in-out"
                    onclick={() => selectEnergyLevel(level)}
                >
                    E{level}
                </text>
                {/each}
            </svg>
            <div class="text-white text-left pt-6">
                {#if $selectedEnergyLevel}
                    Selected Energy Level: <span class="text-red-500 font-bold italic text-lg ml-3">E{$selectedEnergyLevel}</span>
                {:else}
                    Click an energy level to select one.
                {/if}
            </div>
        </div>
    </div>

    
    <div class="flex flex-col items-center justify-center absolute right-10 top-1/2 transform -translate-y-1/2">
        {#if !showDescription}
            <h2 class="text-2xl font-semibold pt-10 -translate-x-16">1D Quantum States Simulation</h2>
            <p class="text-base text-gray-300 mt-2 w-[460px]">Observe and explore the quantum behavior of a particle confined in a 1-dimensional box. Adjust the energy levels to see how the particle’s wavefunction and probability distribution change in real time.</p>
            <div class="pt-3 -translate-x-40">
                <button onclick={toggleDescription} class="bg-transparent border border-white flex flex-row justify-center items-center rounded-3xl py-3 px-5 hover:scale-105 hover:translate-y-1 hover:underline transform transition duration-300 ease-in-out group text-white text-sm">See Instructions</button>
            </div>
        {:else}
            <div class="border border-white flex flex-col justify-start items-start rounded-3xl p-8 w-5/6 relative shadow-lg text-left space-y-4 translate-x-6">
            
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