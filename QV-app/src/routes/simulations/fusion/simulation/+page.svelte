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
            <h2 class="text-2xl font-semibold pt-10 -translate-x-20">Nuclear Fusion Simulation</h2>
            <p class="text-base text-gray-300 mt-2 w-[460px]">Description will go here</p>
            <div class="pt-3 -translate-x-40">
                <button onclick={toggleDescription} class="bg-transparent border border-white flex flex-row justify-center items-center rounded-3xl py-3 px-5 hover:scale-105 hover:translate-y-1 hover:underline transform transition duration-300 ease-in-out group text-white text-sm">See Instructions</button>
            </div>
        {:else}
            <button class="bg-transparent border border-white flex justify-center items-center rounded-3xl py-16 px-20 pointer-events-none">
                <span onclick={toggleDescription} class="absolute right-10 -translate-y-10 translate-x-3 scale-90 hover:scale-110 transform transition ease-in-out duration-300 pointer-events-auto"><img src={x} alt="Close Simulation Instructions"/></span>
                <p class="text-white">Instructions Here, Configure Once Simulation is Written</p>
            </button>
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