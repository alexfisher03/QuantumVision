<svelte:head>
    <title>Nuclear Fission</title>
    <meta name="description" content="Nuclear fission informational page" />
</svelte:head>

<script lang="ts">
    import { base } from '$app/paths';
    import arrowdown from '$lib/vectors/transitionarrow_down.svg';
    import fissionfigure from '$lib/images/fission_figure.png';
    import eq1 from '$lib/vectors/fission_eq1.svg';
    import eq2 from '$lib/vectors/fission_eq2.svg';
    import eq3 from '$lib/vectors/fission_eq3.svg';
    import eq4 from '$lib/vectors/fission_eq4.svg';
    import { Badge } from "flowbite-svelte";
    import { FlaskOutline } from "flowbite-svelte-icons";
</script>

<section>
    <div class="flex justify-center">
        <h1 class="gradient-text text-transparent -translate-y-20 font-semibold animate-gradient w-fit">Nuclear Fission</h1>
    </div>
    <div class="flex justify-center">
        <a href="/simulations/fission/simulation" class="text-white hover:scale-110 transform transition ease-in-out duration-200 cursor-pointer">
            <Badge border rounded color="gray">
                <FlaskOutline class="w-4 h-4 mr-2" />
                Try The Simulation
            </Badge>
        </a>
    </div>
    <div class="grid grid-cols-[1.6fr_1.2fr] gap-32 md:gap-44 xxl:gap-52 py-4">
        <!-- column 1 content -->
        <div class="flex flex-col justify-start -translate-x-0 sm:-translate-x-12 w-full min-w-[450px]">
            <div class="-translate-x-10">
                <h2 class="text-2xl font-semibold">The Energy Within</h2>
                <p class="text-base body-text pt-4">One of the most groundbreaking discoveries in modern physics was the realization that <span class="font-bold text-gray-300"> mass</span> and <span class="font-bold text-gray-300">energy</span> are interchangeable. Using a combination of the equations for relativistic momentum and relativistic energy, Einstein derived the following equation:</p>
                <img src={eq1} alt="Equation 1" class="translate-y-3 translate-x-16 pt-4 pb-4"/>
                <p class="text-base body-text pt-4">When we consider an object with mass at rest, where the momentum <span class="font-bold italic text-gray-300">p</span> is zero, this equation simplifies to the most iconic form: </p>
                <img src={eq2} alt="Equation 2" class="translate-y-3 translate-x-16 pb-4"/>
            </div>
            <div class="-translate-x-10 pt-6">
                <h2 class="text-2xl font-semibold">The Key To Atomic Power</h2>
                <p class="text-base body-text pt-4">At the core of nuclear processes lies the concept of <span class="font-bold text-gray-300">mass defect</span>. The mass of an atomic nucleus is slightly less than the combined mass of it’s individual protons and neutrons. This <span class="font-bold italic text-gray-300">“missing"</span> mass, known as the <span class="font-bold text-gray-300">mass defect</span> (Δm), represents the energy required to bind the nucleus together.</p>
                <img src={eq3} alt="Equation 3" class="scale-[125%] translate-y-3 translate-x-16 pt-4 pb-4"/>
                <p class="text-base body-text pt-6">This mass defect can be converted directly to energy using : </p>
                <img src={eq4} alt="Equation 4" class="translate-y-3 translate-x-6 pt-4 pb-4"/>
                <p class="text-base body-text pt-6">This reveals that even a small amount of <span class="font-bold text-gray-300">mass</span> contains an immense amount of energy, which serves as the foundation of nuclear reactions.</p>
                
            </div>
            
        </div> 

        <!-- column 2content -->
        <div class="flex flex-col justify-start w-full min-w-[450px]">
            <div class="-translate-x-10">
                <h2 class="text-2xl font-semibold">Splitting The Atom</h2>
                <p class="body-text pt-4">For heavier nuclei like <span class="font-bold text-gray-300">uranium-235</span>, the binding energy per nucleon is relatively low. When a heavy nucleus splits into smaller, more stable fragments, the binding energy per nucleon increases. The difference in binding energy is released as energy, making nuclear fission an incredibly potent source of energy</p>
            </div>
            
            <div>
                <h2 class="text-xl font-semibold pt-6 -translate-x-5">Neutron Bombardment</h2>
                <p class="text-base body-text pt-4 -translate-x-5">Fission may occur when a neutron strikes a heavy nucleus such as <span class="font-bold text-gray-300">uranium-235</span>. The nucleus absorbs the neutron, forming an unstable isotope, <span class="font-bold text-gray-300">uranium-236</span>, which likely splits very rapidly into two smaller nuclei. This process also releases 2–3 additional neutrons and a large amount of <span class="font-bold text-gray-300">energy.</span></p>
            </div>
            <div>
                <h2 class="text-xl font-semibold pt-6 -translate-x-5">The Domino Effect</h2>
                <p class="text-base body-text pt-4 -translate-x-5">The neutrons released during fission can collide with neighboring uranium-235 nuclei, triggering additional fission events in a cascading process called a chain reaction. When this process is controlled, it powers nuclear reactors; when uncontrolled, it results in the explosive energy of a nuclear bomb.</p>
                
            </div>
            <div class="-translate-x-16 pt-6">
                <img src={fissionfigure} alt="Fission Figure" class="scale-[105%] translate-x-7 translate-y-10"/>
            </div>
        </div> 
    </div>

    <div class="flex justify-center">
        <a href="/simulations/fission/simulation" class="hover:translate-y-2 transform transition ease-in-out duration-200">
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