<svelte:head>
    <title>3D Simulation</title>
    <meta name="description" content="3-dimensional particle in a box simulation page" />
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
        <h1 class="gradient-text text-transparent -translate-y-20 font-semibold animate-gradient w-fit">Particle in a 3-Dimensional Box</h1>
    </div>

    <!-- SIMULATION GOES HERE -->

    
    <div class="flex flex-col items-center justify-center absolute right-10 top-1/2 transform -translate-y-1/2">
        {#if !showDescription}
            <h2 class="text-2xl font-semibold pt-10 -translate-x-16">3D Quantum States Simulation</h2>
            <p class="text-base text-gray-300 mt-2 w-[460px]">Observe and explore the quantum behavior of a particle confined in a 3-dimensional box. Adjust the energy levels to see how the particle’s wavefunction and probability distribution change in real time.</p>
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
        <a href="/simulations/threedimension" class="absolute bottom-0 transform pb-3">
            <img src={arrowup} alt="Move Back To 3D Info Page" class="hover:-translate-y-2 transform transition ease-in-out duration-200"/>
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