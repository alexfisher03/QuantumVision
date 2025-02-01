<svelte:head>
    <title>Fusion Simulation</title>
    <meta name="description" content="Nuclear fusion simulation page" />
</svelte:head>

<script lang="ts">
    import arrowup from "$lib/vectors/transitionarrow_up.svg";
    import x from "$lib/vectors/x.svg";

    let showDescription = $state(false);

    function toggleDescription() {
        showDescription = !showDescription;
    }
</script>

<section>
    <div class="flex justify-center">
        <h1 class="gradient-text text-transparent -translate-y-20 font-semibold animate-gradient w-fit">Nuclear Fusion</h1>
    </div>

    <!-- SIMULATION GOES HERE -->

    
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

    <div class="flex justify-center">
        <a href="/simulations/fusion" class="absolute bottom-4 transform pb-3">
            <img src={arrowup} alt="Move Back To Info Page" class="hover:-translate-y-2 transform transition ease-in-out duration-200"/>
        </a>
    </div>
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