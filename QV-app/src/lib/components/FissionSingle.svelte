<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import { onMount, tick } from 'svelte';

	// Fission state variables
	let fissionStarted = false;   // becomes true when the incoming neutron collides
	let hasSplit = false;         // becomes true once the nucleus has split
	let fissionStartTime: any = null;  // time when fissionStarted was set true
	const splitDelay = 700;       // delay (ms) between collision and splitting

	// Groups and objects for our simulation
	let nucleusGroup: any;            // original nucleus (layered)
	let cubeWireframe: any;           // simulation boundary
	let neutronGroup = new THREE.Group();  // group holding the incoming neutron
	let fragmentsGroup: any = null;   // will hold the fission fragments
	let productNeutronsGroup = new THREE.Group(); // group for product neutrons
	let energyWave: any = null;       // energy visualization

	// Reference to the current incoming neutron (if any)
	let neutron: any = null;
	// Duration for the incoming neutron to travel (ms)
	const travelDuration = 3000;
	// Starting and target positions for the incoming neutron
	const startPosition = new THREE.Vector3(3, 0, 0);
	const targetPosition = new THREE.Vector3(0, 0, 0);
	// For tracking the incoming neutron animation start time
	let animationStartTime: any = null;

	// Speeds
	const baseSpeed = 0.005;
	const fragmentSpeed = baseSpeed * 1.5;
	const productNeutronSpeed = baseSpeed * 6;

	// Global paused state (declared only once)
	let paused = false;

	// Helper to create the original nucleus (layered: core + halo)
	function createNucleus() {
		let group = new THREE.Group();
		// Core sphere
		const coreGeometry = new THREE.SphereGeometry(0.15, 32, 32);
		const coreMaterial = new THREE.MeshStandardMaterial({
			color: 0xff0000,
			roughness: 0.8,
			metalness: 0.2
		});
		const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
		coreSphere.position.set(0, 0, 0);
		group.add(coreSphere);
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
		group.add(haloSphere);
		return group;
	}

	onMount(async () => {
		// Create the original nucleus.
		nucleusGroup = createNucleus();

		// Create the simulation boundary (a transparent cube).
		const L = 3;
		const cubeGeometry = new THREE.BoxGeometry(L, L, L);
		const edges = new THREE.EdgesGeometry(cubeGeometry);
		const cubeMaterial = new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.2
		});
		cubeWireframe = new THREE.LineSegments(edges, cubeMaterial);

		await tick();
		window.dispatchEvent(new Event('resize'));
	});

	// Called when the "Fire Neutron" button is clicked.
	function neutronBombardment() {
		// Remove any existing incoming neutron and reset fission state.
		if (neutron) {
			neutronGroup.remove(neutron);
			neutron = null;
			animationStartTime = null;
		}
		// Clear previous fission state (fragments, product neutrons, energyWave, etc.)
		fissionStarted = false;
		hasSplit = false;
		fissionStartTime = null;
		fragmentsGroup = null;
		energyWave = null;
		productNeutronsGroup = new THREE.Group();
		// If the original nucleus is missing (from a previous reaction), recreate it.
		if (!nucleusGroup) {
			nucleusGroup = createNucleus();
		}

		// Create the incoming neutron: a small, glowing sphere.
		const neutronGeometry = new THREE.SphereGeometry(0.025, 16, 16);
		const neutronMaterial = new THREE.MeshStandardMaterial({
			color: 0x808080,
			emissive: 0xffffff,
			emissiveIntensity: 3,
			roughness: 0.9,
			metalness: 0.1
		});
		neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
		neutron.position.copy(startPosition);
		neutronGroup.add(neutron);
		animationStartTime = performance.now();
	}

	// Function to spawn product neutrons.
	function spawnProductNeutrons() {
		for (let i = 0; i < 3; i++) {
			const pNeutronGeom = new THREE.SphereGeometry(0.02, 12, 12);
			const pNeutronMat = new THREE.MeshStandardMaterial({
				color: 0x808080,
				emissive: 0xffffff,
				emissiveIntensity: 3,
				roughness: 0.9,
				metalness: 0.1
			});
			const pNeutron = new THREE.Mesh(pNeutronGeom, pNeutronMat);
			pNeutron.position.set(0, 0, 0);
			const randomDir = new THREE.Vector3(
				Math.random() - 0.5,
				Math.random() - 0.5,
				Math.random() - 0.5
			).normalize().multiplyScalar(productNeutronSpeed);
			pNeutron.userData.velocity = randomDir;
			productNeutronsGroup.add(pNeutron);
		}
	}

	// Function to split the nucleus into fragments, spawn product neutrons, and create an energy wave.
	function splitNucleus() {
		nucleusGroup = null;
		hasSplit = true;

		// Create a group for the two fragments.
		fragmentsGroup = new THREE.Group();
		function createFragment(color: any) {
			let fragGroup = new THREE.Group();
			const fragCoreGeom = new THREE.SphereGeometry(0.1, 32, 32);
			const fragCoreMat = new THREE.MeshStandardMaterial({
				color: color,
				roughness: 0.8,
				metalness: 0.2
			});
			const fragCore = new THREE.Mesh(fragCoreGeom, fragCoreMat);
			fragCore.position.set(0, 0, 0);
			fragGroup.add(fragCore);
			const fragHaloGeom = new THREE.SphereGeometry(0.17, 32, 32);
			const fragHaloMat = new THREE.MeshStandardMaterial({
				color: color,
				opacity: 0.2,
				transparent: true,
				roughness: 1.0,
				metalness: 0.3
			});
			const fragHalo = new THREE.Mesh(fragHaloGeom, fragHaloMat);
			fragHalo.position.set(0, 0, 0);
			fragGroup.add(fragHalo);
			return fragGroup;
		}

		const frag1 = createFragment(0xff6666);
		const frag2 = createFragment(0xff3333);
		frag1.position.set(0, 0, 0);
		frag2.position.set(0, 0, 0);
		fragmentsGroup.add(frag1);
		fragmentsGroup.add(frag2);
		// Generate one random "base" direction.
		const baseDir = new THREE.Vector3(
			Math.random() - 0.5,
			Math.random() - 0.5,
			Math.random() - 0.5
		).normalize();
		// Generate a small variation vector.
		const variation = new THREE.Vector3(
			(Math.random() - 0.5) * 0.2,
			(Math.random() - 0.5) * 0.2,
			(Math.random() - 0.5) * 0.2
		);
		// Fragment 1: exactly the base direction.
		const frag1Dir = baseDir.clone();
		// Fragment 2: nearly opposite to base direction with slight variation.
		const frag2Dir = baseDir.clone().negate().add(variation).normalize();
		frag1.userData.velocity = frag1Dir.multiplyScalar(fragmentSpeed);
		frag2.userData.velocity = frag2Dir.multiplyScalar(fragmentSpeed);

		// Spawn 3 product neutrons.
		spawnProductNeutrons();

		// Create an energy wave that expands through the entire confinement cube.
		const waveGeom = new THREE.SphereGeometry(0.1, 32, 32);
		const waveMat = new THREE.MeshBasicMaterial({
			color: 0xADD8E6, // light blue
			transparent: true,
			opacity: 0.25,   // almost transparent but solid
			side: THREE.DoubleSide
		});
		energyWave = new THREE.Mesh(waveGeom, waveMat);
		energyWave.scale.set(1, 1, 1);
		energyWave.userData.startTime = performance.now();
	}

	// Toggle pause/resume.
	function togglePause() {
		paused = !paused;
	}

	// Called on every frame.
	function animateFrame() {
		if (paused) return;
		const now = performance.now();

		// Animate the incoming neutron.
		if (neutron && animationStartTime !== null) {
			const elapsed = now - animationStartTime;
			const t = Math.min(elapsed / travelDuration, 1);
			neutron.position.lerpVectors(startPosition, targetPosition, t);
			if (t >= 1) {
				neutronGroup.remove(neutron);
				neutron = null;
				animationStartTime = null;
				fissionStarted = true;
				fissionStartTime = now;
			}
		}

		// Animate the original nucleus (if present).
		if (nucleusGroup) {
			nucleusGroup.rotation.y += 0.001;
			if (fissionStarted) {
				const vibrateIntensity = 0.03;
				const timeFactor = now * 0.05;
				nucleusGroup.position.x = Math.sin(timeFactor * 20) * vibrateIntensity;
				nucleusGroup.position.y = Math.cos(timeFactor * 20) * vibrateIntensity;
				nucleusGroup.rotation.z = Math.sin(timeFactor * 25) * vibrateIntensity;
			} else {
				nucleusGroup.position.set(0, 0, 0);
			}
		}

		// After fission starts, if enough time has passed and we haven't split yet, split the nucleus.
		if (fissionStarted && !hasSplit && (now - fissionStartTime) > splitDelay) {
			splitNucleus();
		}

		// Animate fission fragments.
		if (fragmentsGroup) {
			fragmentsGroup.children.forEach((frag: any) => {
				frag.position.add(frag.userData.velocity);
				// Bounce off boundaries (cube side 3, boundaries at ±1.5).
				['x', 'y', 'z'].forEach(axis => {
					if (frag.position[axis] > 1.5 || frag.position[axis] < -1.5) {
						frag.userData.velocity[axis] *= -1;
						frag.position[axis] = THREE.MathUtils.clamp(frag.position[axis], -1.5, 1.5);
					}
				});
				frag.rotation.x += 0.01;
				frag.rotation.y += 0.01;
			});
		}

		// Animate product neutrons.
		productNeutronsGroup.children.forEach((pNeutron: any) => {
			pNeutron.position.add(pNeutron.userData.velocity);
			['x', 'y', 'z'].forEach(axis => {
				if (pNeutron.position[axis] > 1.5 || pNeutron.position[axis] < -1.5) {
					pNeutron.userData.velocity[axis] *= -1;
					pNeutron.position[axis] = THREE.MathUtils.clamp(pNeutron.position[axis], -1.5, 1.5);
				}
			});
		});

		// Animate the energy wave.
		if (energyWave) {
			const waveElapsed = now - energyWave.userData.startTime;
			const scale = 3 + waveElapsed / 100;
			energyWave.scale.set(scale, scale, scale);
			energyWave.material.opacity = Math.max(0.25 - waveElapsed / 6000, 0);
		}
	}

	// Custom animation loop.
	function loop() {
		animateFrame();
		requestAnimationFrame(loop);
	}
	loop();
</script>

<div>
	<h2 class="-translate-y-24">Singular Fission Reaction</h2>
	<SC.Canvas antialias background={new THREE.Color('#000000')} shadows>
		<SC.Primitive object={cubeWireframe} />
		{#if nucleusGroup}
			<SC.Primitive object={nucleusGroup} />
		{:else if fragmentsGroup}
			<SC.Primitive object={fragmentsGroup} />
		{/if}
		<SC.Primitive object={neutronGroup} />
		<SC.Primitive object={productNeutronsGroup} />
		{#if energyWave}
			<SC.Primitive object={energyWave} />
		{/if}
		<SC.PerspectiveCamera position={[2, 1.5, 1.5]} />
		<SC.OrbitControls enableZoom={true} minDistance={3} maxDistance={4} />
		<SC.AmbientLight intensity={0.5} />
		<SC.DirectionalLight intensity={0.6} position={[2, 2, 2]} />
	</SC.Canvas>
	<button 
		class="bg-transparent border border-white justify-center items-center rounded-xl py-3 px-5 hover:scale-105 hover:text-[#9f3edc] hover:border-[#9f3edc] transform transition duration-300 ease-in-out group text-white text-sm mr-3 mt-3 -translate-y-20 translate-x-64 xl:translate-x-[350px] xxl:translate-x-[350px] xxl:-translate-y-52"
		onclick={neutronBombardment}>
		Fire Neutron
	</button>
	<button 
	class="bg-transparent border border-white justify-center items-center rounded-xl py-3 px-5 hover:scale-105 hover:text-[#9f3edc] hover:border-[#9f3edc] transform transition duration-300 ease-in-out group text-white text-sm mr-3 mt-3 -translate-y-4 translate-x-[150px] xl:-translate-y-4 xl:translate-x-[250px] xxl:-translate-y-36 xxl:translate-x-[250px]"
	onclick={togglePause}>
	{#if !paused}
		<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
			<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" d="M9 6H8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z"/>
			<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" d="M15 6h-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z"/>
		</svg>
	{:else}
		<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
			<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" d="M8 18V6l8 6-8 6Z"/>
		</svg>
	{/if}
</button>
</div>
