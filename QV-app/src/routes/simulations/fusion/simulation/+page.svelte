<svelte:head>
    <title>Fusion Simulation</title>
    <meta name="description" content="Nuclear fusion simulation page" />
</svelte:head>

<script lang="ts">
    import arrowup from "$lib/vectors/transitionarrow_up.svg";
    import x from "$lib/vectors/x.svg";
    import { onMount } from "svelte";
    import { WidgetPlaceholder } from 'flowbite-svelte';

    let FusionComponent: any = $state();
    let loadingGraph: boolean = $state(true);

    onMount(async () => {
      const module = await import('$lib/components/Fusion.svelte');
      FusionComponent = module.default;
      
      loadingGraph = false;
    });

    let showDescription = $state(false);

    function toggleDescription() {
        showDescription = !showDescription;
    }
</script>

<section>
    <div class="flex justify-center">
        <h1 class="gradient-text text-transparent -translate-y-20 font-semibold animate-gradient w-fit">Nuclear Fusion</h1>
    </div>

    {#if !showDescription}
    <div class={loadingGraph ? "flex flex-col justify-start" : "flex flex-col justify-start lg:w-[400px] lg:h-[300px] xl:w-[500px] xl:h-[400px] md:pt-16 xl:pt-24 xxl:pt-48 lg:translate-y-0 lg:-translate-x-18 xl:-translate-x-24 xxl:mt-24"}>
        {#if loadingGraph}
            <div class="-translate-y-12 lg:w-[400px] lg:h-[200px] xl:w-[300px] xl:h-[300px]">
                <WidgetPlaceholder />
            </div>
        {:else}
            <FusionComponent />
        {/if}
    </div>
    {/if}

    
    <div class="flex flex-col items-center justify-center absolute right-10 top-1/2 transform -translate-y-1/2">
        {#if !showDescription}
            <h2 class="text-2xl font-semibold pt-10 -translate-x-[85px] text-start">Nuclear Fusion Simulation</h2>
            <p class="text-base text-gray-300 mt-2 w-[460px]">
                Watch the nuclear fusion event simulating the proton–proton (PP) chain reaction that powers the Sun. In the core of the Sun, extreme temperatures and pressures allow protons to overcome their mutual electrostatic repulsion and fuse. 
              </p>
              
            <div class="pt-3 -translate-x-40">
                <button onclick={toggleDescription} class="bg-transparent border border-white flex flex-row justify-center items-center rounded-3xl py-3 px-5 hover:scale-105 hover:translate-y-1 hover:underline transform transition duration-300 ease-in-out group text-white text-sm">See Instructions</button>
            </div>
        {:else}
        <div class="border border-white flex flex-col justify-start items-start rounded-3xl p-8 w-4/5 relative shadow-lg text-left space-y-4 mb-6 translate-y-24 xl:translate-y-8">
            <span onclick={toggleDescription} class="absolute top-4 right-4 scale-90 hover:scale-110 transition duration-300 cursor-pointer">
              <img src={x} alt="Close Simulation Instructions" />
            </span>
      
            <h3 class="text-lg font-semibold text-white">How to Run the Simulation</h3>
            <p class="text-sm text-gray-300">
            Click the <b>Begin Simulation</b> button to start the nuclear fusion event. The simulation resets to demonstrate the proton–proton chain reaction, where solar forces (represented by blue arrows) push protons together under extreme conditions.
            </p>

            <h3 class="text-lg font-semibold text-white">Understanding the Visualization</h3>
            <p class="text-sm text-gray-300">
            This 3D scene simulates the fusion process that powers the Sun:
            </p>
            <ul class="list-disc pl-4 text-sm text-gray-400">
            <li><b>Solar Force (Blue Arrows):</b> Represent the gravitational and pressure effects in the Sun's core that force protons together.</li>
            <li><b>Initial Protons:</b> Two protons that, when forced together by this pressure, eventually overcome their electrostatic repulsion.</li>
            <li><b>Fusion Reaction:</b> The protons fuse to form a deuteron. In this process, one proton converts via beta plus decay, emitting a positron (blue) and an electron neutrino (green).</li>
            <li><b>Positron Annihilation:</b> The emitted positron quickly meets an electron causing the two particles to annihilate, resulting in the production of gamma rays.</li>
            <li><b>Subsequent Reactions:</b> The deuteron fuses with another proton to form helium‑3, and later two helium‑3 nuclei fuse to form helium‑4—releasing additional protons to perpetuate the cycle.</li>
            </ul>
            <i class="text-sm text-gray-400">The core of the Sun is incredibly active—on the order of 10^38 proton–proton fusion reactions occur every second. This enormous number is a consequence of the vast number of protons in the Sun’s core, even though each individual proton may wait billions of years before fusing.</i>
            <p class="text-sm text-gray-300">
            Energy released during each reaction is shown in mega–electronvolts (MeV), highlighting the immense energy changes occurring at the nuclear level.
            </p>

            <h3 class="text-lg font-semibold text-white">Navigation and Controls</h3>
            <p class="text-sm text-gray-300">
            Use your mouse or touch controls to rotate, zoom, and pan the scene. The simulation can be paused with the pause button so you can examine individual moments in the reaction in detail.
            </p>
            <p class="text-sm text-gray-400 italic">
            Explore the simulation to see how these reactions combine to produce sustained nuclear fusion.
            </p>
        </div>
        {/if}
    </div>

    {#if !showDescription}
      <div class="flex justify-center">
          <a href="/simulations/fusion" class="pt-40 bottom-4 transform pb-3">
              <img src={arrowup} alt="Move Back To Fusion Info Page" class="hover:-translate-y-2 transform transition ease-in-out duration-200"/>
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