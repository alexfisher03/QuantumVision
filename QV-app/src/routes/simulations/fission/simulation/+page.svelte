<svelte:head>
    <title>Fission Simulation</title>
    <meta name="description" content="Nuclear fission simulation page" />
</svelte:head>

<script lang="ts">
    import arrowup from "$lib/vectors/transitionarrow_up.svg";
    import x from "$lib/vectors/x.svg";
    import { onMount } from "svelte";
    let FissionChain = $state();
    let FissionSingle = $state();

    let showDescription = $state(false);
    function toggleDescription() {
        showDescription = !showDescription;
    }

    import { WidgetPlaceholder } from 'flowbite-svelte';
    let loadingGraph = $state(true);
    onMount(async () => {
      const module1 = await import('$lib/components/FissionChain.svelte');
      const module2 = await import('$lib/components/FissionSingle.svelte');
      FissionChain = module1.default;
      FissionSingle = module2.default;
      loadingGraph = false;
    });

    let selectedSimulation = $state("single");

    function selectSimulation(type : string) {
        selectedSimulation = type;
    }

</script>

<section>
    <div class="flex justify-center">
        <h1 class="gradient-text text-transparent -translate-y-20 font-semibold animate-gradient w-fit">Nuclear Fission</h1>
    </div>

    <!-- SIMULATION GOES HERE -->
    {#if !showDescription}
    <div class={loadingGraph ? "flex flex-col justify-start" : "flex flex-col justify-start lg:w-[400px] lg:h-[300px] xl:w-[500px] xl:h-[400px] md:pt-16 xl:pt-24 xxl:pt-48 lg:translate-y-0 lg:-translate-x-18 xl:-translate-x-24 xxl:mt-24"}>
        {#if loadingGraph}
            <div class="-translate-y-12 lg:w-[400px] lg:h-[200px] xl:w-[300px] xl:h-[300px]">
                <WidgetPlaceholder />
            </div>
        {:else}
            {#if selectedSimulation === 'single'}
                <FissionSingle />
            {:else if selectedSimulation === 'chain'}
                <FissionChain />
            {/if}
        {/if}
    </div>
    <div>
    <button 
      class={selectedSimulation === 'single' ? 'bg-[#2a093f] border border-white justify-center items-center rounded-3xl py-3 px-5 hover:scale-105 hover:translate-y-1 hover:underline transform transition duration-300 ease-in-out group text-white text-sm mr-3 mt-3' : 'bg-transparent border border-white justify-center items-center rounded-3xl py-3 px-5 hover:scale-105 hover:translate-y-1 hover:underline transform transition duration-300 ease-in-out group text-white text-sm mr-3 mt-3'}
      onclick={() => selectSimulation('single')}>
      Single Fission Reaction
    </button>
    <button 
      class={selectedSimulation === 'chain' ? 'bg-[#2a093f] border border-white justify-center items-center rounded-3xl py-3 px-5 hover:scale-105 hover:translate-y-1 hover:underline transform transition duration-300 ease-in-out group text-white text-sm mt-3' : 'bg-transparent border border-white justify-center items-center rounded-3xl py-3 px-5 hover:scale-105 hover:translate-y-1 hover:underline transform transition duration-300 ease-in-out group text-white text-sm mt-3'}
      onclick={() => selectSimulation('chain')}>
      Chain Reaction
    </button>
    </div>
    {/if}
    

    <div class="flex flex-col items-center justify-center absolute right-10 top-1/2 transform -translate-y-1/2 pt-36">
        {#if !showDescription}
          <h2 class="text-2xl font-semibold pt-10 -translate-x-[85px] text-start">Nuclear Fission Simulation</h2>
          <p class="text-base text-gray-300 mt-2 w-[460px]">
            Watch a single fission event or an event which cascades into a chain reaction. The simulation shows an incoming neutron striking a fissile nucleus (U-235),
            which upon reaction releases additional neutrons and generates an expanding energy wave.
          </p>
          <div class="pt-3 -translate-x-40">
            <button onclick={toggleDescription} 
                    class="bg-transparent border border-white flex flex-row justify-center items-center rounded-3xl py-3 px-5 hover:scale-105 hover:translate-y-1 hover:underline transition duration-300 ease-in-out group text-white text-sm">
              See Instructions
            </button>
          </div>
        {:else}
        <div class="flex justify-center translate-x-3">
          <div class="border border-white flex flex-col justify-start items-start rounded-3xl p-8 w-4/5 relative shadow-lg text-left space-y-4 mb-6">
            <span onclick={toggleDescription} class="absolute top-4 right-4 scale-90 hover:scale-110 transition duration-300 cursor-pointer">
              <img src={x} alt="Close Simulation Instructions" />
            </span>
      
            <h3 class="text-lg font-semibold text-white">How to Run the Simulation</h3>
            <p class="text-sm text-gray-300">
              Click the <b>Fire Neutron</b> button to start a fission event. The simulation resets to show either a single nuclei or a new collection of uranium nuclei and launches an incoming neutron.
            </p>
      
            <h3 class="text-lg font-semibold text-white">Understanding the Visualization</h3>
            <p class="text-sm text-gray-300">
              The 3D scene illustrates a nuclear fission process:
            </p>
            <ul class="list-disc pl-4 text-sm text-gray-400">
              <li><b>Incoming Neutron:</b> A fast-moving particle that initiates the fission reaction.</li>
              <li><b>Fissile Nuclei:</b> A collection of uranium nuclei; one is fixed at the center.</li>
              <li><b>Fragments & Energy Wave:</b> When a nucleus splits, it emits fragments and an expanding wave representing released energy.</li>
            </ul>
            <p class="text-sm text-gray-300">
              Additional neutrons produced during the split may trigger further fission events, forming a chain reaction.
            </p>
      
            <h3 class="text-lg font-semibold text-white">Adjusting Uranium Density</h3>
            <p class="text-sm text-gray-300">
              Use the dropdown menu to select the density of uranium nuclei. Lower density results in fewer random nuclei (e.g. 40), while higher density (e.g. 80) simulates a more critical mass. 
            </p>
            <p class="text-sm text-gray-400 italic">
              For reference, a typical nuclear bomb contains on the order of 1.28×10^24 uranium nuclei—an astonishingly large number that highlights the atomic scale of these reactions. Energy released in these reactions is measured in mega–electronvolts (MeV), a unit that conveniently describes the enormous energy changes occurring at the nuclear level.
            </p>
      
            <h3 class="text-lg font-semibold text-white">Navigation and Controls</h3>
            <p class="text-sm text-gray-300">
              Rotate, zoom, and pan the scene using your mouse or touch controls. The simulation pauses if you toggle the pause button, allowing you to study specific moments in the reaction.
            </p>
            <p class="text-sm text-gray-400 italic">
              Experiment with different uranium densities and observe how the chain reaction evolves.
            </p>
          </div>
        </div>
        {/if}
    </div>

    {#if !showDescription}
      <div class="flex justify-center">
          <a href="/simulations/fission" class="pt-40 bottom-4 transform pb-3">
              <img src={arrowup} alt="Move Back To Fission Info Page" class="hover:-translate-y-2 transform transition ease-in-out duration-200"/>
          </a>
      </div>
      {/if}
</section>

<style>
    .gradient-text {
        background: linear-gradient(
            to right,
            #3F2669,
            #653dab,
            #a777fa,
            #FFFFFF,
            #a777fa,
            #653dab,
            #3F2669,
            #653dab,
            #a777fa,
            #FFFFFF
        );
        background-size: 300% 300%;
        background-clip: text;
    }
</style>