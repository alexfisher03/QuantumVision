<script>
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import { onMount, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { computeWaveFunction3D } from '$lib/scripts/wavefunction3D.js';

	const L = 1;
	// transparent cube wireframe 
	let cubeGeometry = new THREE.BoxGeometry(L, L, L);
	const edges = new THREE.EdgesGeometry(cubeGeometry);
	const cubeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
	let cubeWireframe = new THREE.LineSegments(edges, cubeMaterial);

	// material definition for point cloud
	const pointsMaterial = new THREE.PointsMaterial({
		size: 0.01,
		vertexColors: true,
		transparent: true,
		opacity: 0.8
	});

	// placeholder point cloud for initial render
	let initialGeometry = new THREE.BufferGeometry();
	initialGeometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
	initialGeometry.setAttribute('color', new THREE.Float32BufferAttribute([], 3));
	let pointCloud = new THREE.Points(initialGeometry, pointsMaterial);

	// quantum numbers for the wavefunction
	let n_x = 1, n_y = 1, n_z = 1;
	let geometryStore = writable(null);

	function updatePointCloud() {
		const resolution = 40;
		const positions = [];
		const densities = [];
		// generate grid points and compute densities
		for (let i = 0; i < resolution; i++) {
			const x = (i / (resolution - 1)) * L;
			for (let j = 0; j < resolution; j++) {
			const y = (j / (resolution - 1)) * L;
			for (let k = 0; k < resolution; k++) {
				const z = (k / (resolution - 1)) * L;
				// compute density using the wavefunction
				const d = computeWaveFunction3D(n_x, n_y, n_z, x, y, z, L);
				densities.push(d);
				// convert grid coordinates (0 to L) to centered positions (-L/2 to L/2)
				positions.push(x - L / 2, y - L / 2, z - L / 2);
			}
			}
		}
		// determine min and max densities.
		const minD = Math.min(...densities);
		const maxD = Math.max(...densities);

		// only render points wih density above a certain threshold
		const threshold = 0.3;
		const filteredPositions = [];
		const filteredColors = [];
		
		for (let i = 0; i < densities.length; i++) {
			const d = densities[i];
			const t = (maxD - minD) > 0 ? (d - minD) / (maxD - minD) : 0;
			// only include points that are above the threshold
			if (t >= threshold) {
			// use the existing position for this point
			filteredPositions.push(
				positions[i * 3],
				positions[i * 3 + 1],
				positions[i * 3 + 2]
			);
			// map t to a color: low density (just above threshold) = darker; high density = brighter red
			const color = new THREE.Color().setHSL(0.7 * (1 - t), 1, 0.5);
			filteredColors.push(color.r, color.g, color.b);
			}
		}
		
		const newGeometry = new THREE.BufferGeometry();
		newGeometry.setAttribute('position', new THREE.Float32BufferAttribute(filteredPositions, 3));
		newGeometry.setAttribute('color', new THREE.Float32BufferAttribute(filteredColors, 3));
		newGeometry.attributes.position.needsUpdate = true;
		newGeometry.attributes.color.needsUpdate = true;
		geometryStore.set(newGeometry);
		}

	onMount(async () => {
		await tick();
		window.dispatchEvent(new Event('resize'));
		updatePointCloud();
	});

	// subscribe to geometryStore updates 
	geometryStore.subscribe(value => {
		if (value) {
		pointCloud.geometry = value;
		}
	});

</script>

<div>
	<SC.Canvas antialias background={new THREE.Color('#000000')} shadows fog={new THREE.FogExp2('black', 0.1)}>
		<SC.Primitive object={cubeWireframe} />
		<SC.Primitive object={pointCloud} />
		<SC.PerspectiveCamera position={[1.5, 1.5, 1.5]} />
		<SC.OrbitControls enableZoom={true} minDistance={0.25} maxDistance={3} maxPolarAngle={Math.PI * 0.45} />
		<SC.AmbientLight intensity={0.5} /> 
		<SC.DirectionalLight intensity={0.6} position={[2, 2, 2]} shadow={{ mapSize: [1024, 1024] }} />
	</SC.Canvas>
	<div class="absolute right-2 top-0 bottom-0 flex flex-col items-center pointer-events-none h-4/5 translate-y-8">
		<div class="w-4 h-full border border-white" style="background: linear-gradient(to top, #4B00FF 0%, #00FF00 50%, #FF0000 100%);"></div>
		<div class="absolute right-8 top-0 bottom-0 flex flex-col justify-between text-xs text-white pr-2">
		  <span>100%</span>
		  <span>75%</span>
		  <span>50%</span>
		  <span>25%</span>
		  <span>0%</span>
		</div>
	  </div>

	<div class="mb-4 translate-y-56 flex justify-center -translate-x-6">
		<label class="text-white text-lg mr-4">
			n<sub>x</sub>:
			<select bind:value={n_x} on:change={updatePointCloud} class="rounded-lg text-black bg-slate-300 ml-1 p-1">
				{#each [1, 2, 3, 4] as num}
					<option value={num}>{num}</option>
				{/each}
			</select>
		</label>
		<label class="text-white text-lg mr-4">
			n<sub>y</sub>:
			<select bind:value={n_y} on:change={updatePointCloud} class="rounded-lg text-black bg-slate-300 ml-1 p-1">
				{#each [1, 2, 3, 4] as num}
					<option value={num}>{num}</option>
				{/each}
			</select>
		</label>
		<label class="text-white text-lg">
			n<sub>z</sub>:
			<select bind:value={n_z} on:change={updatePointCloud} class="rounded-lg text-black bg-slate-300 ml-1 p-1">
				{#each [1, 2, 3, 4] as num}
					<option value={num}>{num}</option>
				{/each}
			</select>
		</label>
	</div>
</div>
