<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import { onMount, tick } from 'svelte';

	let nucleiGroup: any;
	let cubeWireframe: any;

	onMount(async () => {
		// Create a group to hold multiple layered nuclei
		nucleiGroup = new THREE.Group();
		const numNuclei = 30;

		for (let i = 0; i < numNuclei; i++) {
			// Create a group for each nucleus (core + halo)
			const nucleus = new THREE.Group();

			// Core sphere for the nucleus interior
			const coreGeometry = new THREE.SphereGeometry(0.07, 16, 16);
			const coreMaterial = new THREE.MeshStandardMaterial({
				color: 0xff0000,
				roughness: 0.7,
				metalness: 0.3
			});
			const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
			coreSphere.position.set(0, 0, 0);
			nucleus.add(coreSphere);

			// Halo sphere for the glow effect
			const haloGeometry = new THREE.SphereGeometry(0.12, 16, 16);
			const haloMaterial = new THREE.MeshStandardMaterial({
				color: 0xff5555,
				opacity: 0.4,
				transparent: true,
				roughness: 1.0,
				metalness: 0
			});
			const haloSphere = new THREE.Mesh(haloGeometry, haloMaterial);
			haloSphere.position.set(0, 0, 0);
			nucleus.add(haloSphere);

			// Position each nucleus randomly within a cube of side length 3
			nucleus.position.set(
				(Math.random() - 0.5) * 1,
				(Math.random() - 0.5) * 1,
				(Math.random() - 0.5) * 1
			);

			nucleiGroup.add(nucleus);
		}

		// Create a transparent cube for simulation boundaries
		const L = 3;
		const cubeGeometry = new THREE.BoxGeometry(L, L, L);
		const edges = new THREE.EdgesGeometry(cubeGeometry);
		const cubeMaterial = new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.2
		});
		cubeWireframe = new THREE.LineSegments(edges, cubeMaterial);

		// Ensure full resolution rendering
		await tick();
		window.dispatchEvent(new Event('resize'));
	});

	function dummyLaunch() {
		// placeholder for launch logic
		return;
	}
</script>

<div>
	<h2 class="-translate-y-24">Fission Chain Reaction</h2>
	<SC.Canvas antialias background={new THREE.Color('#000000')} shadows>
		<SC.Primitive object={cubeWireframe} />
		<SC.Primitive object={nucleiGroup} />
		<SC.PerspectiveCamera position={[1.5, 1.5, 1.5]} />
		<SC.OrbitControls enableZoom={true} minDistance={0.5} maxDistance={3} />
		<SC.AmbientLight intensity={0.5} />
		<SC.DirectionalLight intensity={0.6} position={[2, 2, 2]} />
	</SC.Canvas>
	<button 
		class="bg-transparent border border-white justify-center items-center rounded-xl py-3 px-5 hover:scale-105 hover:text-[#9f3edc] hover:border-[#9f3edc] transform transition duration-300 ease-in-out group text-white text-sm mr-3 mt-3 -translate-y-20 translate-x-64"
		onclick={dummyLaunch}>
		Fire Neutron
	</button>
</div>
