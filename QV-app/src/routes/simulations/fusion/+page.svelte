<svelte:head>
    <title>Nuclear Fusion</title>
    <meta name="description" content="Nuclear fusion informational page" />
</svelte:head>

<script lang="ts">
    import arrowdown from '$lib/vectors/transitionarrow_down.svg';
    import fusionfigure from '$lib/images/fusion_figure.png';
    import eq1 from '$lib/vectors/fusion_eq1.svg';
    import eq2 from '$lib/vectors/fusion_eq2.svg';
    
</script>

<section>
    <div class="flex justify-center">
        <h1 class="gradient-text text-transparent -translate-y-20 font-semibold animate-gradient w-fit">Nuclear Fusion</h1>
    </div>
    <div class="grid grid-cols-[1.6fr_1.2fr] gap-32 md:gap-44 xxl:gap-52 py-4">
        <!-- column 1 content -->
        <div class="flex flex-col justify-start -translate-x-0 sm:-translate-x-12 w-full min-w-[450px]">
            <div class="-translate-x-10">
                <h2 class="text-2xl font-semibold">The Power of Fusion</h2>
                <p class="text-base body-text pt-4">Fusion is the process of combining light atomic nuclei to create heavier ones. Unlike fission, fusion requires overcoming the repulsive magnetic force, also known as the <span class="font-bold text-gray-300">Coulomb force</span>. This is achieved by providing the nuclei with enough kinetic energy, allowing the <span class="font-bold text-gray-300">Strong Force</span> to bind them together once they are close enough.</p>
            </div>
            <div class="-translate-x-10 pt-24">
                <h2 class="text-2xl font-semibold">The Mass Defect In Action</h2>
                <p class="text-base body-text pt-4">A helium nucleus has a mass which is slightly less than the mass of four hydrogen nuclei. This lost <span class="font-bold text-gray-300">mass</span>, similar to fission, is not actually lost or destroyed but converted to <span class="font-bold text-gray-300">energy</span>:</p>
                <img src={eq1} alt="Equation 3" class="translate-y-3 translate-x-16 pt-4 pb-4"/>
                <p class="text-base body-text pt-6">This process releases significantly more energy than nuclear fission. For example, the fusion process involving hydrogen nuclei to form helium releases approximately <span class="font-bold italic text-gray-300">3.6 x 10¹¹ kJ</span> , which is nearly <span class="font-bold text-gray-300">20 times the energy</span> released by one mole of uranium-235 undergoing fission.</p>
                <p class="text-base body-text pt-6">To put this even further into perspective, fusion produces <span class="font-bold text-gray-300">3-million times more energy</span> than a typical chemical combustion reaction...</p>
                
            </div>
            
        </div> 

        <!-- column 2content -->
        <div class="flex flex-col justify-start w-full min-w-[450px]">
            <div class="-translate-x-10">
                <h2 class="text-2xl font-semibold">The Power of The Sun</h2>
                <p class="body-text pt-4">Fusion is the primary energy source for stars. In our Sun, hydrogen nuclei (<span class="font-bold text-gray-300">protons</span>) fuse to form helium through a series of reactions collectively know as the <span class="font-bold italic text-gray-300">proton-proton chain</span>. This process occurs under extreme conditions in the Sun’s core, where temperatures reach approximately 14 Million K.</p>
                <p class="body-text pt-6">At such high temperatures, protons have sufficient kinetic energy to overcome their Coulomb repulsion, allowing them to collide and fuse. The immense pressure near the Sun’s center also plays a critical role in sustaining these reactions.</p>
                <p class="body-text pt-6">The net result of this fusion process is the transformation of four protons into one helium nucleus, releasing energy in the form of light and heat, along with two positrons and two neutrinos:</p>
                <img src={eq2} alt="Equation 4" class="scale-[125%] translate-y-3 pt-4 pb-4"/>
            </div>
            <div class="-translate-x-16 pt-6">
                <img src={fusionfigure} alt="Fusion Figure" class="scale-150 translate-y-24"/>
            </div>
        </div> 
    </div>

    <div class="flex justify-center translate-y-24 pb-3 pt-3">
        <a href="/simulations/fusion/simulation" class="hover:translate-y-2 transform transition ease-in-out duration-200">
            <img src={arrowdown} alt="Move To Simulation"/>
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