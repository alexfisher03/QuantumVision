<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import { onMount, tick } from 'svelte';

	//state variables
	let fissionStarted: boolean = false;   // becomes true when the incoming neutron collides
	let hasSplit: boolean = false;         // becomes true once the nucleus has split
	let fissionStartTime: any = null;  // time when fissionStarted was set true
	const splitDelay: number = 700;       // delay (ms) between collision and splitting

	//groups and objects
	let nucleusGroup: any;            // original nucleus (layered)
	let cubeWireframe: any;           // simulation boundary
	let neutronGroup = new THREE.Group();  // group holding the incoming neutron
	let fragmentsGroup: any = null;   // will hold the fission fragments
	let productNeutronsGroup = new THREE.Group(); // group for product neutrons
	let energyWave: any = null;       // energy visualization

	//reference to the incoming neutron (if any)
	let neutron: any = null;
	//duration for the incoming neutron to travel from start to target position
	const travelDuration: number = 3000;
	//start and target positions for the incoming neutron
	const startPosition = new THREE.Vector3(3, 0, 0);
	const targetPosition = new THREE.Vector3(0, 0, 0);
	//for tracking the incoming neutron animation start time
	let animationStartTime: any = null;

	//speeds
	const baseSpeed: number = 0.005;
	const fragmentSpeed: number = baseSpeed * 1.5;
	const productNeutronSpeed: number = baseSpeed * 6;

	//global paused state (declared only once)
	let paused: boolean = false;

	//total energy
	let totalEnergy: number = 0;

	//helper to create the original nucleus (layered: core + halo)
	function createNucleus() {
		let group = new THREE.Group();
		const coreGeometry = new THREE.SphereGeometry(0.15, 32, 32);
		const coreMaterial = new THREE.MeshStandardMaterial({
			color: 0xff0000,
			roughness: 0.8,
			metalness: 0.2
		});
		const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
		coreSphere.position.set(0, 0, 0);
		group.add(coreSphere);
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
		//create the original nucleus
		nucleusGroup = createNucleus();

		//create the simulation boundary
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

	//called when the "Fire Neutron" button is clicked
	function neutronBombardment() {
		totalEnergy = 0;

		//remove any existing incoming neutron and reset fission state
		if (neutron) {
			neutronGroup.remove(neutron);
			neutron = null;
			animationStartTime = null;
		}
		//clear previous fission state: fragments, product neutrons, energyWave, etc
		fissionStarted = false;
		hasSplit = false;
		fissionStartTime = null;
		fragmentsGroup = null;
		energyWave = null;
		productNeutronsGroup = new THREE.Group();
		//if the original nucleus is missing (from a previous reaction), recreate it
		if (!nucleusGroup) {
			nucleusGroup = createNucleus();
		}

		//create the incoming neutron
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

	//function to spawn product neutrons
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

	//function to split the nucleus into fragments, spawn product neutrons, and create an energy wave
	function splitNucleus() {
		//increment total energy
		totalEnergy += 200;

		nucleusGroup = null;
		hasSplit = true;

		//create a group for the two fragments
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
		//generate one random "base" direction
		const baseDir = new THREE.Vector3(
			Math.random() - 0.5,
			Math.random() - 0.5,
			Math.random() - 0.5
		).normalize();
		//generate a small variation vector
		const variation = new THREE.Vector3(
			(Math.random() - 0.5) * 0.2,
			(Math.random() - 0.5) * 0.2,
			(Math.random() - 0.5) * 0.2
		);
		//frag1 exactly the base direction
		const frag1Dir = baseDir.clone();
		//frag2 nearly opposite to base direction with slight variation
		const frag2Dir = baseDir.clone().negate().add(variation).normalize();
		frag1.userData.velocity = frag1Dir.multiplyScalar(fragmentSpeed);
		frag2.userData.velocity = frag2Dir.multiplyScalar(fragmentSpeed);

		//spawn 3 product neutrons
		spawnProductNeutrons();

		//create an energy wave that expands through the entire confinement cube
		const waveGeom = new THREE.SphereGeometry(0.1, 32, 32);
		const waveMat = new THREE.MeshBasicMaterial({
			color: 0xADD8E6,
			transparent: true,
			opacity: 0.25, 
			side: THREE.DoubleSide
		});
		energyWave = new THREE.Mesh(waveGeom, waveMat);
		energyWave.scale.set(1, 1, 1);
		energyWave.userData.startTime = performance.now();
	}

	//toggle pause/resume
	function togglePause() {
		paused = !paused;
	}

	//called on every frame
	function animateFrame() {
		if (paused) return;
		const now = performance.now();

		//animate the incoming neutron
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

		//animate the original nucleus (if present)
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

		//after fission starts, if enough time has passed and we haven't split yet, split the nucleus
		if (fissionStarted && !hasSplit && (now - fissionStartTime) > splitDelay) {
			splitNucleus();
		}

		//animate fission fragments
		if (fragmentsGroup) {
			fragmentsGroup.children.forEach((frag: any) => {
				frag.position.add(frag.userData.velocity);
				//bounce off boundaries
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

		//animate product neutrons
		productNeutronsGroup.children.forEach((pNeutron: any) => {
			pNeutron.position.add(pNeutron.userData.velocity);
			['x', 'y', 'z'].forEach(axis => {
				if (pNeutron.position[axis] > 1.5 || pNeutron.position[axis] < -1.5) {
					pNeutron.userData.velocity[axis] *= -1;
					pNeutron.position[axis] = THREE.MathUtils.clamp(pNeutron.position[axis], -1.5, 1.5);
				}
			});
		});

		//animate the energy wave
		if (energyWave) {
			const waveElapsed = now - energyWave.userData.startTime;
			const scale = 3 + waveElapsed / 100;
			energyWave.scale.set(scale, scale, scale);
			energyWave.material.opacity = Math.max(0.25 - waveElapsed / 6000, 0);
		}
	}

	//custom animation loop
	function loop() {
		animateFrame();
		requestAnimationFrame(loop);
	}
	loop();
</script>

<div>
	<h2 class="-translate-y-24 xl:-translate-y-32 xxl:-translate-y-56 font-bold">Singular Fission Reaction</h2>
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
		<SC.OrbitControls enableZoom={true} minDistance={1} maxDistance={6} />
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
	<p class="text-white italic text-sm pl-3 translate-y-28 xl:translate-y-44 xxl:translate-y-20">Total Energy = <span class="text-purple-500">{totalEnergy}</span> MeV</p>
</div>
