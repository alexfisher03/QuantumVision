<svelte:head>
	<title>1D Particle In A Box</title>
	<meta name="description" content="1-dimensional particle in a box informational page" />
</svelte:head>

<script lang="ts">
    import figure1 from '$lib/images/1d_figure.png';
    import arrowdown from '$lib/vectors/transitionarrow_down.svg';
</script>

<section>
    <div class="flex justify-center">
        <h1 class="gradient-text text-transparent -translate-y-20 font-semibold animate-gradient w-fit">Particle in a 1-Dimensional Box</h1>
    </div>

    <div class="grid grid-cols-[1.6fr_1.2fr] gap-32 md:gap-44 xxl:gap-52 py-4">
        <!-- column 1 content -->
        <div class="flex flex-col justify-start w-full -translate-x-0 sm:-translate-x-12 max-w-[650px]">
            <div class="-translate-x-10">
                <h2 class="text-2xl font-bold ">The Basics</h2>
                <p class="text-base body-text pt-4">Before jumping right in, lets discuss first a few points which might clear up some tricky concepts that are introduced when dealing with Quantum Mechanics</p>
            </div>
            <div>
                <h2 class="text-xl font-semibold pt-5 -translate-x-5">1. What is it?</h2>
                <p class="text-base body-text pt-3">The “Particle in a Box” is a simple yet effective way to understand how particles behave when confined in a limited space. Imagine you have a particle, say an electron, trapped between two impenetrable walls. </p>
                <p class="text-base body-text pt-3">This seemingly trivial thought exercise turns out to be the gateway into the principles of Quantum Mechanics.</p>
            </div>
            <div>
                <h2 class="text-xl font-semibold pt-5 -translate-x-5">2. Why this matters in Quantum Mechanics</h2>
                <p class="text-base body-text pt-3">Instead of being tiny dots moving predictably, the electrons in this scenario act as waves, governed by probability rather than certainty. In other words, we can never truly know exactly <span class="font-semibold text-gray-300">where</span> the particle is or <span class="font-semibold text-gray-300">where it’s going</span> while it remains inside this inescapable box.</p>
                <p class="text-base body-text pt-3">This uncertainty is why we describe the particle using something called a <span class="font-semibold text-gray-300">wavefunction</span>. This function, which appears as a parabola in this context, captures the probability of finding the particle at different locations when squared. It’s the cornerstone of how we represent the particle’s lack of a definite <span class="font-semibold text-gray-300">position</span> and <span class="font-semibold text-gray-300">momentum</span>.</p>
                <p class="text-base body-text pt-3">All of this lays the foundation for explaining phenomena like the behavior of electrons in atoms, the design of semiconductors, and even quantum technologies like lasers and quantum computing. By studying this simple model, we can unlock insights into the strange but fundamental nature of the quantum world.</p>
            </div>
        </div>

        <!-- column 2 content -->
        <div class="flex flex-col items-center">
            <img src={figure1} alt="1D Figure" class="scale-[135%] translate-y-10"/>
            <p class="text-xxs body-text pt-6 text-center translate-y-20 -translate-x-24 ml-20 w-full">To simplify our analysis, we assume the walls of the box have <span class="font-semibold text-gray-300">infinite potential energy</span>. This ensures the particle has zero probability of being at the walls or outside the box. These constraints, called <span class="font-semibold text-gray-300">boundary conditions</span>, are crucial for solving the Schrödinger Equation and determining the particle’s behavior within the box.</p>
            <div>
                <h2 class="text-xl font-semibold pt-10 -translate-x-16 translate-y-16">Beyond The Basics</h2>
            </div>
            <div class="text-center translate-y-16 -translate-x-20">
                <p class="text-base body-text pt-3 ml-6 w-full">In quantum mechanics, the particle inside the box cannot have just any energy—it can only exist at specific energy levels. This is what we call <span class="font-semibold text-gray-300">energy quantization</span>.</p>
                <p class="text-base body-text pt-3 ml-6 w-full">This happens because the wavefunction, which describes the particle’s behavior, must satisfy the boundary conditions—it must fit perfectly inside the box, with zero values at the walls. Think of it like a vibrating string fixed at both ends: only certain wave patterns, or modes, are possible, and each pattern corresponds to a specific energy level.</p>
            </div>
        </div>
    </div>

    <div class="flex justify-center">
        <a href="/simulations/onedimension/simulation" class="hover:translate-y-2 transform transition ease-in-out duration-200">
            <img src={arrowdown} alt="Move To Simulation"/>
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