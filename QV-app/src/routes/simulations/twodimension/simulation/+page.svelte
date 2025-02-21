<svelte:head>
    <title>2D Simulation</title>
    <meta name="description" content="2-dimensional particle in a box simulation page" />
</svelte:head>

<script>
    import arrowup from "$lib/vectors/transitionarrow_up.svg";
    import x from "$lib/vectors/x.svg";
    import * as THREE from 'three';
    import * as SC from 'svelte-cubed';

    let showDescription = $state(false);

    function toggleDescription() {
        showDescription = !showDescription;
    }

    let width = $state(1);
	let height = $state(1);
	let depth = $state(1);

	let spin = $state(0);

	SC.onFrame(() => {
		spin += 0.006;
	});
</script>

<section>
    <div class="flex justify-center">
        <h1 class="gradient-text text-transparent -translate-y-20 font-semibold animate-gradient w-fit">Particle in a 2-Dimensional Box</h1>
    </div>

    <!-- SIMULATION GOES HERE -->
     <div class="flex flex-col justify-start max-w-[500px] min-h-[400px] md:pt-16 xl:pt-24 xxl:pt-36 -translate-x-24">
        <SC.Canvas
            antialias
            background={new THREE.Color('papayawhip')}
            fog={new THREE.FogExp2('papayawhip', 0.1)}
            shadows
        >
            <SC.Group position={[0, -height / 2, 0]}>
                <SC.Mesh
                    geometry={new THREE.PlaneGeometry(50, 50)}
                    material={new THREE.MeshStandardMaterial({ color: 'burlywood' })}
                    rotation={[-Math.PI / 2, 0, 0]}
                    receiveShadow
                />
                <SC.Primitive
                    object={new THREE.GridHelper(50, 50, 'papayawhip', 'papayawhip')}
                    position={[0, 0.001, 0]}
                />
            </SC.Group>

            <SC.Mesh
                geometry={new THREE.BoxGeometry()}
                material={new THREE.MeshStandardMaterial({ color: 0xff0000 })}
                scale={[width, height, depth]}
                rotation={[0, spin, 0]}
                castShadow
            />

            <SC.PerspectiveCamera position={[1, 1, 3]} />
            <SC.OrbitControls enableZoom={false} maxPolarAngle={Math.PI * 0.51} />
            <SC.AmbientLight intensity={0.6} />
            <SC.DirectionalLight intensity={0.6} position={[-2, 3, 2]} shadow={{ mapSize: [2048, 2048] }} />
        </SC.Canvas>
        <div class="controls">
            <label><input type="range" bind:value={width} min={0.1} max={3} step={0.1} /> width</label>
            <label><input type="range" bind:value={height} min={0.1} max={3} step={0.1} /> height</label>
            <label><input type="range" bind:value={depth} min={0.1} max={3} step={0.1} /> depth</label>
        </div>
     </div>

    
    <div class="flex flex-col items-center justify-center absolute right-10 top-1/2 transform -translate-y-1/2 pt-36 xl:pt-0 xxl:pt-0">
        {#if !showDescription}
            <h2 class="text-2xl font-semibold pt-10 -translate-x-16">2D Quantum States Simulation</h2>
            <p class="text-base text-gray-300 mt-2 w-[460px]">Observe and explore the quantum behavior of a particle confined in a 2-dimensional box. Adjust the energy levels to see how the particle’s wavefunction and probability distribution change in real time.</p>
            <div class="pt-3 -translate-x-40">
                <button onclick={toggleDescription} class="bg-transparent border border-white flex flex-row justify-center items-center rounded-3xl py-3 px-5 hover:scale-105 hover:translate-y-1 hover:underline transform transition duration-300 ease-in-out group text-white text-sm">See Instructions</button>
            </div>
        {:else}
            <div class="border border-white flex flex-col justify-start items-start rounded-3xl p-8 w-5/6 relative shadow-lg text-left space-y-4 translate-x-6">
            
                <span onclick={toggleDescription} class="absolute top-4 right-4 scale-90 hover:scale-110 transition ease-in-out duration-300 cursor-pointer">
                    <img src={x} alt="Close Simulation Instructions" />
                </span>
        
                <h3 class="text-lg font-semibold text-white">How to Use This Simulation</h3>
                <p class="text-sm text-gray-300">
                    Click an <b>energy level (E₁, E₂, ...)</b> to observe how the wavefunction and probability distribution change.
                </p>
        
                <h3 class="text-lg font-semibold text-white">Understanding the Graph</h3>
                <p class="text-sm text-gray-300">
                    The graph displays <b>|ψ(x)|²</b>, showing where the particle is most likely to be found.
                </p>
                <ul class="list-disc pl-4 text-sm text-gray-400">
                    <li><b>X-axis:</b> Position inside the plane with respect to x.</li>
                    <li><b>Y-axis:</b> Position inside the box with respect to y.</li>
                    <li><b>Z-axis:</b> Probabilty of finding the particle in a given point.</li>
                    <li><b>Higher energy levels:</b> More oscillations.</li>
                </ul>

                <h3 class="text-lg font-semibold text-white">Energy Levels</h3>
                <p class="text-sm text-gray-300">
                    Higher quantum states result in more peaks and nodes in the wavefunction.
                </p>

                <p class="text-sm text-gray-400 italic">
                    Try selecting different energy levels and observe the differences!
                </p>
            </div>
        {/if}
    </div>

    <div class="flex justify-center">
        <a href="/simulations/twodimension" class="absolute bottom-4 transform pb-3">
            <img src={arrowup} alt="Move Back To 2D Info Page" class="hover:-translate-y-2 transform transition ease-in-out duration-200"/>
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

    .controls {
		position: absolute;
		left: 1em;
		top: 1em;
	}

	label {
		display: flex;
		width: 60px;
		gap: 0.5em;
		align-items: center;
	}

	input {
		width: 80px;
		margin: 0;
	}
</style>