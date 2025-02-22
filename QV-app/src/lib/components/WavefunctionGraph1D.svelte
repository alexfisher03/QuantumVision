<script>
    import { writable } from "svelte/store";
    import '@carbon/charts-svelte/styles.css';
    import { LineChart, ScaleTypes } from "@carbon/charts-svelte";
    import { computeWaveFunction } from "$lib/scripts/wavefunction1D.js";
    
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
</script>
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
                n = {level}
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