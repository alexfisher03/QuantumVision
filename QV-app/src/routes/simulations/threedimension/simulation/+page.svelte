<svelte:head>
    <title>3D Simulation</title>
    <meta name="description" content="3-dimensional particle in a box simulation page" />
</svelte:head>

<script lang="ts">
    import arrowup from "$lib/vectors/transitionarrow_up.svg";
    import x from "$lib/vectors/x.svg";
    import { WidgetPlaceholder } from 'flowbite-svelte';
    import { onMount } from "svelte";

    let WavefunctionGraph3D = $state();
    let loadingGraph = $state(true);

    onMount(async () => {
      const module = await import('$lib/components/WavefunctionGraph3D.svelte');
      WavefunctionGraph3D = module.default;
      loadingGraph = false;
    });

    let showDescription = $state(false);

    function toggleDescription() {
        showDescription = !showDescription;
    }
</script>

<section>
    <div class="flex justify-center">
        <h1 class="gradient-text text-transparent -translate-y-20 font-semibold animate-gradient w-fit">Particle in a 3-Dimensional Box</h1>
    </div>

    {#if !showDescription}
    <!-- SIMULATION GOES HERE -->
    <div class={loadingGraph ? "flex flex-col justify-start" : "flex flex-col justify-start lg:w-[400px] lg:h-[300px] xl:w-[500px] xl:h-[400px] md:pt-16 xl:pt-24 xxl:pt-48 lg:translate-y-12 lg:-translate-x-18 xl:-translate-x-24 xxl:mt-24"}>
        {#if loadingGraph}
            <div class="-translate-y-12 lg:w-[400px] lg:h-[300px] xl:w-[500px] xl:h-[400px]">
                <WidgetPlaceholder />
            </div>
        {:else}
        <h2 class="-translate-y-24 xl:-translate-y-32 xxl:-translate-y-56 font-bold">|ψ(x)|² : 3D Infinite Potential Well</h2>
            <WavefunctionGraph3D/>
        {/if}
    </div>
    {/if}
 
    <div class="flex flex-col items-center justify-center absolute right-10 top-1/2 transform -translate-y-1/2 pt-36">
        {#if !showDescription}
          <h2 class="text-2xl font-semibold pt-10 -translate-x-16">3D Quantum States Simulation</h2>
          <p class="text-base text-gray-300 mt-2 w-[460px]">
            Explore the quantum behavior of a particle confined in a 3-dimensional box. Adjust the energy levels 
            <b>n<sub>x</sub></b>, <b>n<sub>y</sub></b>, and <b>n<sub>z</sub></b> to see how the probability density distribution changes.
          </p>
          <div class="pt-3 -translate-x-40">
            <button onclick={toggleDescription} 
                    class="bg-transparent border border-white flex flex-row justify-center items-center rounded-3xl py-3 px-5 hover:scale-105 hover:translate-y-1 hover:underline transition duration-300 ease-in-out group text-white text-sm">
              See Instructions
            </button>
          </div>
        {:else}
          <div class="border border-white flex flex-col justify-start items-start rounded-3xl p-8 w-5/6 relative shadow-lg text-left space-y-4 mb-6">
            <span onclick={toggleDescription} class="absolute top-4 right-4 scale-90 hover:scale-110 transition duration-300 cursor-pointer">
              <img src={x} alt="Close Simulation Instructions" />
            </span>
    
            <h3 class="text-lg font-semibold text-white">How to Use This Simulation</h3>
            <p class="text-sm text-gray-300">
              Use the dropdown menus to change the quantum numbers <b>n<sub>x</sub></b>, <b>n<sub>y</sub></b>, and <b>n<sub>z</sub></b>. These values determine the energy state of the particle confined in the 3D box. When you select new values, the point cloud updates to show the corresponding probability density distribution.
            </p>
    
            <h3 class="text-lg font-semibold text-white">Understanding the Visualization</h3>
            <p class="text-sm text-gray-300">
              The simulation displays a 3D point cloud representing the orbital probability density of the particle. The axes are defined as:
            </p>
            <ul class="list-disc pl-4 text-sm text-gray-400">
              <li><b>X-axis:</b> Horizontal position within the box.</li>
              <li><b>Y-axis:</b> Vertical position within the box.</li>
              <li><b>Z-axis:</b> Depth (or forward-backward) position within the box.</li>
            </ul>
            <p class="text-sm text-gray-300">
              The colors of the points indicate the local probability density – points with higher density are rendered with brighter colors, while those outside the orbital region appear dimmer.
            </p>
    
            <h3 class="text-lg font-semibold text-white">Zoom and Navigation</h3>
            <p class="text-sm text-gray-300">
              Use your mouse or touch controls to rotate, pan, and zoom the scene. Zoom is restricted to maintain a clear view of the orbital details.
            </p>
            <p class="text-sm text-gray-400 italic">
              Experiment with various quantum states to observe how the nodal surfaces and orbital lobes change.
            </p>
          </div>
        {/if}
      </div>

      {#if !showDescription}
      <div class="flex justify-center">
          <a href="/simulations/threedimension" class="pt-40 bottom-4 transform pb-3">
              <img src={arrowup} alt="Move Back To 3D Info Page" class="hover:-translate-y-2 transform transition ease-in-out duration-200"/>
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
</style>