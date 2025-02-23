<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import { onMount, tick } from 'svelte';

	// Fission state variables
	let fissionStarted = false;   // becomes true when the incoming neutron collides
	let hasSplit = false;         // becomes true once the nucleus has split
	let fissionStartTime = null;  // time when fissionStarted was set true
	const splitDelay = 700;       // delay (ms) between collision and splitting

	// Groups and objects for our simulation
	let nucleusGroup;            // original nucleus (layered)
	let cubeWireframe;           // simulation boundary
	let neutronGroup = new THREE.Group();  // group holding the incoming neutron
	let fragmentsGroup = null;   // will hold the fission fragments
	let productNeutronsGroup = new THREE.Group(); // group for product neutrons
	let energyWave = null;       // energy visualization

	// Reference to the current incoming neutron (if any)
	let neutron = null;
	// Duration for the incoming neutron to travel (ms)
	const travelDuration = 3000;
	// Starting and target positions for the incoming neutron
	const startPosition = new THREE.Vector3(3, 0, 0);
	const targetPosition = new THREE.Vector3(0, 0, 0);
	// For tracking the incoming neutron animation start time
	let animationStartTime = null;

	// Speeds
	const baseSpeed = 0.005;
	const fragmentSpeed = baseSpeed * 1.5;
	const productNeutronSpeed = baseSpeed * 6;

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
		// Also clear product neutrons.
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
		// Launch 3 product neutrons in arbitrary directions.
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
			// Position at the origin.
			pNeutron.position.set(0, 0, 0);
			// Generate a random direction.
			const randomDir = new THREE.Vector3(
				Math.random() - 0.5,
				Math.random() - 0.5,
				Math.random() - 0.5
			).normalize().multiplyScalar(productNeutronSpeed);
			pNeutron.userData.velocity = randomDir;
			productNeutronsGroup.add(pNeutron);
		}
	}

	// Function to split the nucleus into fragments and spawn an energy wave and product neutrons.
	function splitNucleus() {
		// Remove the original nucleus.
		nucleusGroup = null;
		hasSplit = true;

		// Create a group for the two fragments.
		fragmentsGroup = new THREE.Group();
		function createFragment(color) {
			let fragGroup = new THREE.Group();
			// Core fragment
			const fragCoreGeom = new THREE.SphereGeometry(0.1, 32, 32);
			const fragCoreMat = new THREE.MeshStandardMaterial({
				color: color,
				roughness: 0.8,
				metalness: 0.2
			});
			const fragCore = new THREE.Mesh(fragCoreGeom, fragCoreMat);
			fragCore.position.set(0, 0, 0);
			fragGroup.add(fragCore);
			// Halo fragment
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
		const frag2 = createFragment(0xFFA500);
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

		// Spawn product neutrons.
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

	// Called on every frame.
	function animateFrame() {
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

		// While the original nucleus exists, rotate it slowly and vibrate if fission started.
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

		// Animate fission fragments if they exist.
		if (fragmentsGroup) {
			fragmentsGroup.children.forEach(frag => {
				frag.position.add(frag.userData.velocity);
				// Bounce off boundaries: confinement cube side is 3 (boundaries at ±1.5).
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

		// Animate product neutrons if they exist.
		productNeutronsGroup.children.forEach(pNeutron => {
			pNeutron.position.add(pNeutron.userData.velocity);
			// Bounce off boundaries for product neutrons as well.
			['x', 'y', 'z'].forEach(axis => {
				if (pNeutron.position[axis] > 1.5 || pNeutron.position[axis] < -1.5) {
					pNeutron.userData.velocity[axis] *= -1;
					pNeutron.position[axis] = THREE.MathUtils.clamp(pNeutron.position[axis], -1.5, 1.5);
				}
			});
		});

		// Animate the energy wave so that it expands to cover the confinement cube.
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
	<SC.Canvas antialias background={new THREE.Color('#000000')} shadows frameloop="always">
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
		<SC.OrbitControls enableZoom={true} minDistance={1} maxDistance={4} />
		<SC.AmbientLight intensity={0.5} />
		<SC.DirectionalLight intensity={0.6} position={[2, 2, 2]} />
	</SC.Canvas>
	<button 
		class="bg-transparent border border-white justify-center items-center rounded-xl py-3 px-5 hover:scale-105 hover:text-[#9f3edc] hover:border-[#9f3edc] transform transition duration-300 ease-in-out group text-white text-sm mr-3 mt-3 -translate-y-20 translate-x-64"
		onclick={neutronBombardment}>
		Fire Neutron
	</button>
</div>
