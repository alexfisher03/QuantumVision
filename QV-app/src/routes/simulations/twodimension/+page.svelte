<svelte:head>
    <title>2D Particle In A Box</title>
    <meta name="description" content="2-dimensional particle in a box informational page" />
</svelte:head>

<script lang="ts">
    import arrowdown from '$lib/vectors/transitionarrow_down.svg';
    import figure2 from '$lib/images/2d_figure.png';
    import eq1 from '$lib/vectors/2d_equation1.svg';
    import eq2 from '$lib/vectors/2d_equation2.svg';
	import { goto } from '$app/navigation';
</script>

<section>
    <div class="flex justify-center">
        <h1 class="gradient-text text-transparent -translate-y-20 font-semibold animate-gradient w-fit">Particle in a 2-Dimensional Box</h1>
    </div>
    <div class="grid grid-cols-[1.6fr_1.2fr] gap-32 md:gap-44 xxl:gap-52 py-4">
        <!-- column 1 content -->
        <div class="flex flex-col justify-start -translate-x-0 sm:-translate-x-12 w-full min-w-[450px]">
            <div class="-translate-x-10">
                <h2 class="text-2xl font-bold ">Beyond 1 Dimensions</h2>
                <p class="text-base body-text pt-4">Let’s now consider the Shrödinger Equation for a particle confined to a two dimensional box. This is a natural extension of the one-dimensional case, but with two spatial variables (x,y).</p>
            </div>
            <div>
                <h2 class="text-xl font-semibold pt-5 -translate-x-5">1. What’s different here?</h2>
                <p class="text-base body-text pt-3">Mostly, this system is the same as the <span class="underline cursor-pointer hover:text-gray-300 duration-300" onclick={goto('/simulations/onedimension')}>one-dimensional system</span>, except that we extend the equation into a two variable (x, y) system.</p>
                <p class="text-base body-text pt-3">This creates a 2D wave pattern, with quantized energy levels determined by two quantum numbers (<span class="font-bold text-gray-300">nₓ</span> and <span class="font-bold text-gray-300">nᵧ</span>). This ultimately leads to more complex behavior at different energy states, dictated by the two quantum numbers.</p>
            </div>
            <div>
                <h2 class="text-xl font-semibold pt-5 -translate-x-5">2. Solving the Shrödinger Equation </h2>
                <p class="text-base body-text pt-3">Through some computation, we find that, under the boundary conditions where ( V(x,y) = ∞ ),at the edges, the general solution within the boundary is : </p>
                <img src={eq1} alt="Equation 1" class="translate-y-3"/>
                <p class="text-base body-text pt-3 translate-y-4">The final solution can found by using separation of variables, and then applying the boundary conditions, all while ensuring the wavefunction goes to zero at the boundaries. Solving for each variable leads to sine wave solutions, with quantized energy states defined by the integers nₓ and nᵧ​. Combining these results gives:</p>
                <img src={eq2} alt="Equation 2" class="translate-y-8 translate-x-4"/>
            </div>
        </div>

        <!-- column 2content -->
        <div class="flex flex-col items-center">
            <img src={figure2} alt="2D Figure" class="scale-[105%] -translate-x-7 translate-y-10"/>
            <div>
                <h2 class="text-xl font-semibold pt-10 -translate-x-16 translate-y-16">Interpreting the Results</h2>
            </div>
            <div class="text-center translate-y-16 -translate-x-20 w-[500px]">
                <p class="text-base body-text pt-3 ml-6">By solving the Schrödinger Equation for a 2D box, we discover that the particle’s behavior is defined by quantized energy levels. These energy levels can be calculated directly from the dimensions of the box and the quantum numbers, giving us a clear picture of the system's total energy. </p>
                <p class="text-base body-text pt-3 ml-6">Each energy level corresponds to a distinct wave pattern, or wavefunction, describing the probability of finding the particle in specific regions within the box. This highlights how confinement in two dimensions leads to more complex behavior and interactions between spatial variables compared to the 1D case</p>
            </div>
        </div>
    </div>

    <div class="flex justify-center">
        <a href="/simulations/twodimension/simulation" class="absolute bottom-0 transform pb-3">
            <img src={arrowdown} alt="Move To Simulation" class="hover:-translate-y-2 transform transition ease-in-out duration-200"/>
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