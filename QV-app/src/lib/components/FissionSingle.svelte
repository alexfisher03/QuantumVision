<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import { onMount, tick } from 'svelte';

	// Group for the nucleus (layered geometry)
	let nucleusGroup;
	// Cube boundaries
	let cubeWireframe;
	// Group to hold the neutron during its flight
	let neutronGroup = new THREE.Group();
	
	// Reference to the current neutron (if any)
	let neutron = null;
	// Duration (in milliseconds) for the neutron to travel from start to nucleus
	const travelDuration = 3000;
	
	// Starting and target positions for the neutron animation
	const startPosition = new THREE.Vector3(3, 0, 0);
	const targetPosition = new THREE.Vector3(0, 0, 0);
	
	// To keep track of animation start time
	let animationStartTime = null;
	
	onMount(async () => {
		// Create the layered nucleus
		nucleusGroup = new THREE.Group();
		// Core sphere
		const coreGeometry = new THREE.SphereGeometry(0.15, 32, 32);
		const coreMaterial = new THREE.MeshStandardMaterial({
			color: 0xff0000,
			roughness: 0.8,
			metalness: 0.2
		});
		const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
		coreSphere.position.set(0, 0, 0);
		nucleusGroup.add(coreSphere);
		
		// Halo sphere
		const haloGeometry = new THREE.SphereGeometry(0.25, 32, 32);
		const haloMaterial = new THREE.MeshStandardMaterial({
			color: 0xff5555,
			opacity: 0.2,
			transparent: true,
			roughness: 1.0,
			metalness: 0.3
		});
		const haloSphere = new THREE.Mesh(haloGeometry, haloMaterial);
		haloSphere.position.set(0, 0, 0);
		nucleusGroup.add(haloSphere);
		
		// Create a transparent cube to indicate simulation boundaries
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
	
	// Function to reset and animate the neutron
	function neutronBombardment() {
		// If there's an existing neutron, remove it and reset animation start time
		if (neutron) {
			neutronGroup.remove(neutron);
			neutron = null;
			animationStartTime = null;
		}
		
		// Create the neutron: a small gray sphere
		const neutronGeometry = new THREE.SphereGeometry(0.025, 16, 16);
		const neutronMaterial = new THREE.MeshStandardMaterial({
			color: 0x808080,
			emissive: 0xffffff,
			emissiveIntensity: 3,
			roughness: 0.9,
			metalness: 0.1
		});
		neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
		// Start offscreen to the right
		neutron.position.copy(startPosition);
		neutronGroup.add(neutron);
		animationStartTime = performance.now();
	}
	
	// Called on every frame via our custom loop
	function animateFrame() {
		// Update neutron position if active
		if (neutron && animationStartTime !== null) {
			const elapsed = performance.now() - animationStartTime;
			const t = Math.min(elapsed / travelDuration, 1); // normalized time [0,1]
			neutron.position.lerpVectors(startPosition, targetPosition, t);
			if (t >= 1) {
				neutronGroup.remove(neutron);
				neutron = null;
				animationStartTime = null;
			}
		}
		
		// Apply a very small, continuous rotation to the nucleus group to force scene updates.
		if (nucleusGroup) {
			nucleusGroup.rotation.y += 0.001; // very slow rotation
		}
	}
	
	// Custom animation loop using requestAnimationFrame
	function loop() {
		animateFrame();
		requestAnimationFrame(loop);
	}
	loop();
</script>

<div>
	<h2 class="-translate-y-24">Singular Fission Reaction</h2>
	<SC.Canvas antialias background={new THREE.Color('#000000')} shadows frameloop="always">
		<SC.Primitive object={cubeWireframe} />
		<SC.Primitive object={nucleusGroup} />
		<SC.Primitive object={neutronGroup} />
		<SC.PerspectiveCamera position={[1.5, 1.5, 1.5]} />
		<SC.OrbitControls enableZoom={true} minDistance={0.5} maxDistance={3} />
		<SC.AmbientLight intensity={0.5} />
		<SC.DirectionalLight intensity={0.6} position={[2, 2, 2]} />
	</SC.Canvas>
	<button 
		class="bg-transparent border border-white justify-center items-center rounded-xl py-3 px-5 hover:scale-105 hover:text-[#9f3edc] hover:border-[#9f3edc] transform transition duration-300 ease-in-out group text-white text-sm mr-3 mt-3 -translate-y-20 translate-x-64"
		onclick={neutronBombardment}>
		Fire Neutron
	</button>
</div>
