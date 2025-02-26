<svelte:head>
    <title>3D Particle In A Box</title>
    <meta name="description" content="3-dimensional particle in a box informational page" />
</svelte:head>

<script lang="ts">
    import { base } from '$app/paths';
    import arrowdown from '$lib/vectors/transitionarrow_down.svg';
    import figure3 from '$lib/images/3d_figure.png';
    import eq1 from '$lib/vectors/3d_equation1.svg';
    import eq2 from '$lib/vectors/3d_equation2.svg';
    import eq3 from '$lib/vectors/3d_equation3.svg';
    import eq4 from '$lib/vectors/3d_equation4.svg';
</script>

<section>
    <div class="flex justify-center">
        <h1 class="gradient-text text-transparent -translate-y-20 font-semibold animate-gradient w-fit">Particle in a 3-Dimensional Box</h1>
    </div>
    <div class="grid grid-cols-[1.6fr_1.2fr] gap-32 md:gap-44 xxl:gap-52 py-4">
        <!-- column 1 content -->
        <div class="flex flex-col justify-start -translate-x-0 sm:-translate-x-12 w-full min-w-[450px]">
            <div class="-translate-x-10">
                <h2 class="text-2xl font-bold">3-Dimensional Confinement</h2>
                <p class="text-base body-text pt-4">Finally, consider the Schrödinger Equation for a particle confined within a three-dimensional box. This is a natural extension of the one-dimensional and two-dimensional cases, but now the particle is constrained along three spatial dimensions: <span class="font-bold italic text-gray-300"> ( x, y, z ) </span></p>
                <p class="text-base body-text pt-4">Just like before, the boundaries are impenetrable, with infinite potential energy at the edges, while the particle experiences zero potential energy inside the box.</p>
            </div>
            <div>
                <h2 class="text-xl font-semibold pt-5 -translate-x-5">1. What’s different here?</h2>
                <p class="text-base body-text pt-3">As previously mentioned, all we really have to consider here is another variable, <span class="font-bold text-gray-300 italic">z</span>.  This creates <span class="font-bold text-gray-300">3D wave patterns</span> that are combinations of sine functions along each axis, with each unique set of quantum numbers producing a distinct energy level and wavefunction.</p>
            </div>
            <div>
                <h2 class="text-xl font-semibold pt-5 -translate-x-5">2. Solving the Shrödinger Equation </h2>
                <p class="text-base body-text pt-3">Let r be the vector containing the three components of the 3-D box. Thus, we get the following: </p>
                <img src={eq1} alt="Equation 1" class="translate-y-3"/>
                <p class="text-base body-text pt-3 translate-y-4">Like the 2D setup, we need to perform a separation of variables in order to solve the Partial Differential Equations:</p>
                <img src={eq2} alt="Equation 2" class="translate-y-8 translate-x-4"/>
            </div>
            <div>
                <p class="text-base body-text pt-12">Each component is a sine function that satisfies the boundary conditions, ensuring the wavefunction is zero at the edges. Combining these gives the full solution:</p>
                <img src={eq3} alt="Equation 3" class="translate-y-4 -translate-x-2 scale-110"/>
            </div>
        </div> 

        <!-- column 2content -->
        <div class="flex flex-col items-center">
            <img src={figure3} alt="3D Figure" class="scale-90 -translate-x-16 xl:-translate-x-7 translate-y-10 xxl:scale-[105%]"/>
            <div>
                <h2 class="text-xl font-semibold pt-10 -translate-x-10 translate-y-16">Energy Levels in 3D</h2>
            </div>
            <div class="text-center translate-y-16 -translate-x-12 w-[500px]">
                <p class="text-base body-text pt-3 ml-6">Finally, the total energy of the particle is given by:</p>
                <img src={eq4} alt="3D Equation 4" class="pt-3 translate-x-24"/>
                <p class="text-base body-text pt-3 ml-6 translate-x-3">Each quantum number contributes independently to the total energy. For a cubical box, the energy levels depend only on the sum of the squares of the quantum numbers, leading to <span class="font-bold text-gray-300">degeneracies</span>—multiple quantum states with the same energy.</p>
            </div>
        </div>
    </div>

    <div class="flex justify-center">
        <a href="/simulations/threedimension/simulation" class="hover:translate-y-2 transform transition ease-in-out duration-200">
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