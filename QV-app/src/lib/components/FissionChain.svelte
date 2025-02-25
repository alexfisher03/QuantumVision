<script lang="ts">
  import * as THREE from 'three';
  import * as SC from 'svelte-cubed';
  import { onMount, tick } from 'svelte';
  import { Dropdown, DropdownItem } from 'flowbite-svelte';
  import { ChevronDownOutline } from 'flowbite-svelte-icons';

  // global simulation parameters
  let paused = false;
  const travelDuration = 3000; // time for incoming neutron to travel (ms)
  const splitDelay = 700; // delay before a nucleus splits (ms)
  const baseSpeed = 0.005;
  const fragmentSpeed = baseSpeed * 1.5;
  const productNeutronSpeed = baseSpeed * 6;
  const collisionThreshold = 0.2; // distance threshold to trigger fission

  // total energy produced by fission events
  let totalEnergy: number = 0;

  // uranium density; default is 39 (least dense)
  let density: number = 39; // displayed as "Nuclei Density: 39"
  let densityDisplay: number = density + 1;

  // scene groups to organize simulation objects
  let nucleiGroup: any; // group of unfissioned nuclei
  let eventsGroup = new THREE.Group(); // holds fission events (vibrating nuclei, fragments, product neutrons, energy waves)
  let neutronsGroup = new THREE.Group(); // holds the active incoming neutron
  let cubeWireframe: any; // transparent boundary cube

  // incoming neutron variables
  let incomingNeutron: any = null;
  let incomingNeutronStartTime: any = null;
  const startPosition = new THREE.Vector3(3, 0, 0);
  const targetPosition = new THREE.Vector3(0, 0, 0);

  // active fission events array; each event tracks a nucleus (vibrating then splitting),
  // fragments, product neutrons, and an energy wave
  let activeFissions: any = [];

  // handler for Flowbite Dropdown selection
  function handleDensitySelect(value: number) {
    density = value;
	densityDisplay = density + 1;
    resetSimulation();
  }

  // helper to create a layered nucleus (core and halo)
  function createNucleus() {
    let nucleus = new THREE.Group();
    const coreGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      roughness: 0.7,
      metalness: 0.3
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    nucleus.add(core);
    const haloGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0xff5555,
      opacity: 0.4,
      transparent: true,
      roughness: 1.0,
      metalness: 0
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    nucleus.add(halo);
    nucleus.userData.fissioned = false;
    return nucleus;
  }

  // helper to spawn 3 product neutrons for a fission event
  function spawnProductNeutrons(event: any) {
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.SphereGeometry(0.02, 12, 12);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x808080,
        emissive: 0xffffff,
        emissiveIntensity: 3,
        roughness: 0.9,
        metalness: 0.1
      });
      const pNeutron = new THREE.Mesh(geo, mat);
      pNeutron.position.set(0, 0, 0);
      let randomDir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize().multiplyScalar(productNeutronSpeed);
      pNeutron.userData.velocity = randomDir;
      event.productNeutronsGroup.add(pNeutron);
    }
  }

  // helper to trigger a fission event when a neutron hits a nucleus
  function triggerFission(nucleus: any) {
    if (nucleus.userData.fissioned) return;
    nucleus.userData.fissioned = true;
    nucleiGroup.remove(nucleus);
    let event = {
      nucleus: nucleus,
      startTime: performance.now(),
      hasSplit: false,
      fragmentsGroup: null,
      productNeutronsGroup: new THREE.Group(),
      energyWave: null
    };
    activeFissions.push(event);
    eventsGroup.add(nucleus);
    eventsGroup.add(event.productNeutronsGroup);
  }

  // helper to split a nucleus into fragments, spawn product neutrons, and create an energy wave
  function splitNucleus(event: any) {
    if (!event.nucleus) return;
	totalEnergy += 200;
    eventsGroup.remove(event.nucleus);
    event.nucleus = null;
    event.hasSplit = true;
    let fragmentsGroup = new THREE.Group();
    function createFragment(color: any) {
      let frag = new THREE.Group();
      const coreGeo = new THREE.SphereGeometry(0.1, 32, 32);
      const coreMat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
        metalness: 0.2
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      frag.add(core);
      const haloGeo = new THREE.SphereGeometry(0.17, 32, 32);
      const haloMat = new THREE.MeshStandardMaterial({
        color: color,
        opacity: 0.2,
        transparent: true,
        roughness: 1.0,
        metalness: 0.3
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      frag.add(halo);
      return frag;
    }
    let frag1 = createFragment(0xff6666);
    let frag2 = createFragment(0xff3333);
    fragmentsGroup.add(frag1);
    fragmentsGroup.add(frag2);
    frag1.position.set(0, 0, 0);
    frag2.position.set(0, 0, 0);
    let baseDir = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    let variation = new THREE.Vector3(
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2
    );
    let frag1Dir = baseDir.clone();
    let frag2Dir = baseDir.clone().negate().add(variation).normalize();
    frag1.userData.velocity = frag1Dir.multiplyScalar(fragmentSpeed);
    frag2.userData.velocity = frag2Dir.multiplyScalar(fragmentSpeed);
    event.fragmentsGroup = fragmentsGroup;
    eventsGroup.add(fragmentsGroup);
    spawnProductNeutrons(event);
    const waveGeo = new THREE.SphereGeometry(0.1, 32, 32);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0xADD8E6,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    let energyWave = new THREE.Mesh(waveGeo, waveMat);
    energyWave.scale.set(1, 1, 1);
    energyWave.userData.startTime = performance.now();
    event.energyWave = energyWave;
    eventsGroup.add(energyWave);
  }

  // reset the simulation completely
  function resetSimulation() {
	totalEnergy = 0;
    activeFissions = [];
    while (eventsGroup.children.length > 0) {
      eventsGroup.remove(eventsGroup.children[0]);
    }
    // create a new nuclei group with one nucleus at (0,0,0)
    nucleiGroup = new THREE.Group();
    let nucleusAtOrigin = createNucleus();
    nucleusAtOrigin.position.set(0, 0, 0);
    nucleiGroup.add(nucleusAtOrigin);
    // add additional random nuclei based on the selected density value
    const numRandom = density;
    for (let i = 0; i < numRandom; i++) {
      const nucleus = createNucleus();
      nucleus.position.set(
        (Math.random() - 0.5) * 1,
        (Math.random() - 0.5) * 1,
        (Math.random() - 0.5) * 1
      );
      nucleiGroup.add(nucleus);
    }
    eventsGroup.add(nucleiGroup);
    while (neutronsGroup.children.length > 0) {
      neutronsGroup.remove(neutronsGroup.children[0]);
    }
    window.dispatchEvent(new Event('resize'));
  }

  // animation loop that updates simulation each frame
  function animateFrame() {
    requestAnimationFrame(animateFrame);
    if (!paused) {
      let now = performance.now();
      if (nucleiGroup) {
        nucleiGroup.rotation.y += 0.0001;
      }
      if (incomingNeutron && incomingNeutronStartTime !== null) {
        let elapsed = now - incomingNeutronStartTime;
        let t = Math.min(elapsed / travelDuration, 1);
        incomingNeutron.position.lerpVectors(startPosition, targetPosition, t);
        if (t >= 1) {
          nucleiGroup.children.forEach((nucleus: any) => {
            if (!nucleus.userData.fissioned && incomingNeutron) {
              let dist = incomingNeutron.position.distanceTo(nucleus.position);
              if (dist < collisionThreshold) {
                triggerFission(nucleus);
              }
            }
          });
          neutronsGroup.remove(incomingNeutron);
          incomingNeutron = null;
          incomingNeutronStartTime = null;
        }
      }
      activeFissions.forEach((event: any) => {
        if (!event.hasSplit && event.nucleus) {
          let vibrateIntensity = 0.03;
          let timeFactor = now * 0.05;
          event.nucleus.position.x = Math.sin(timeFactor * 20) * vibrateIntensity;
          event.nucleus.position.y = Math.cos(timeFactor * 20) * vibrateIntensity;
          event.nucleus.rotation.z = Math.sin(timeFactor * 25) * vibrateIntensity;
          if (now - event.startTime > splitDelay) {
            splitNucleus(event);
          }
        }
        if (event.fragmentsGroup) {
          event.fragmentsGroup.children.forEach((frag: any) => {
            frag.position.add(frag.userData.velocity);
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
        event.productNeutronsGroup.children.forEach((pNeutron: any) => {
          pNeutron.position.add(pNeutron.userData.velocity);
          ['x', 'y', 'z'].forEach(axis => {
            if (pNeutron.position[axis] > 1.5 || pNeutron.position[axis] < -1.5) {
              pNeutron.userData.velocity[axis] *= -1;
              pNeutron.position[axis] = THREE.MathUtils.clamp(pNeutron.position[axis], -1.5, 1.5);
            }
          });
          nucleiGroup.children.forEach((nucleus: any) => {
            if (!nucleus.userData.fissioned) {
              let dist = pNeutron.position.distanceTo(nucleus.position);
              if (dist < collisionThreshold) {
                triggerFission(nucleus);
                event.productNeutronsGroup.remove(pNeutron);
              }
            }
          });
        });
        if (event.energyWave) {
          let waveElapsed = now - event.energyWave.userData.startTime;
          let scale = 3 + waveElapsed / 100;
          event.energyWave.scale.set(scale, scale, scale);
          event.energyWave.material.opacity = Math.max(0.25 - waveElapsed / 6000, 0);
        }
      });
    }
  }
  animateFrame();

  // user interaction to launch an incoming neutron and restart simulation
  function neutronBombardment() {
    resetSimulation();
    const geo = new THREE.SphereGeometry(0.025, 16, 16);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x808080,
      emissive: 0xffffff,
      emissiveIntensity: 3,
      roughness: 0.9,
      metalness: 0.1
    });
    incomingNeutron = new THREE.Mesh(geo, mat);
    incomingNeutron.position.copy(startPosition);
    neutronsGroup.add(incomingNeutron);
    incomingNeutronStartTime = performance.now();
  }

  // toggle pause state without stopping the animation loop
  function togglePause() {
    paused = !paused;
  }

  // setup the simulation on component mount
  onMount(async () => {
    const L = 3;
    const cubeGeo = new THREE.BoxGeometry(L, L, L);
    const edges = new THREE.EdgesGeometry(cubeGeo);
    const cubeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2
    });
    cubeWireframe = new THREE.LineSegments(edges, cubeMat);
    eventsGroup.add(neutronsGroup);
    resetSimulation();
    await tick();
    window.dispatchEvent(new Event('resize'));
  });
</script>

<div>
  <h2 class="-translate-y-24 xl:-translate-y-32 xxl:-translate-y-56 font-bold">Fission Chain Reaction</h2>
  <SC.Canvas antialias background={new THREE.Color('#000000')} shadows>
    <SC.Primitive object={cubeWireframe} />
    <!-- render unfissioned nuclei group -->
    <SC.Primitive object={nucleiGroup} />
    <!-- render the incoming neutron -->
    <SC.Primitive object={neutronsGroup} />
    <!-- render fission events (vibrating nuclei, fragments, product neutrons, energy waves) -->
    <SC.Primitive object={eventsGroup} />
    <SC.PerspectiveCamera position={[1.5, 1.5, 1.5]} />
    <SC.OrbitControls enableZoom={true} minDistance={1} maxDistance={6} />
    <SC.AmbientLight intensity={0.5} />
    <SC.DirectionalLight intensity={0.6} position={[2, 2, 2]} />
  </SC.Canvas>
  <!-- display current uranium density -->
  <div class="font-bold italic text-white text-sm mt-2 ml-3 translate-y-40 translate-x-64 xl:translate-x-[350px] xxl:translate-x-[350px] xl:translate-y-56 xxl:translate-y-36">
    Nuclei Density: <span class="text-red-500 underline font-bold">{densityDisplay}</span>
  </div>
  <button 
    class="bg-transparent border border-white rounded-xl py-3 px-5 transform transition duration-300 ease-in-out text-white text-sm mr-3 mt-3 -translate-y-28 translate-x-64 xl:translate-x-[350px] xxl:translate-x-[350px] xl:-translate-y-36 xxl:-translate-y-60 hover:scale-105 hover:text-[#9f3edc] hover:border-[#9f3edc]"
    on:click={neutronBombardment}>
    Fire Neutron
  </button>
  <button 
    class="bg-transparent border border-white rounded-xl py-3 px-5 transform transition duration-300 ease-in-out text-white text-sm mr-3 mt-3 -translate-y-12 translate-x-[150px] xl:-translate-y-20 xl:translate-x-[250px] xxl:-translate-y-44 xxl:translate-x-[250px] hover:scale-105 hover:text-[#9f3edc] hover:border-[#9f3edc]"
    on:click={togglePause}>
    {#if !paused}
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" d="M9 6H8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z"/>
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" d="M15 6h-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z"/>
      </svg>
    {:else}
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" d="M8 18V6l8 6-8 6Z"/>
      </svg>
    {/if}
  </button>
  <!-- button version for density selection -->
  <button class="bg-transparent border border-white rounded-3xl py-3 px-5 transform transition duration-300 ease-in-out text-white text-sm mr-3 mt-3 flex translate-y-44 translate-x-24 xl:translate-x-36 xl:translate-y-64 xxl:translate-y-40 hover:scale-105 hover:text-[#dc3e3e] hover:border-[#dc3e3e] group">
    Select Uranium Density
    <ChevronDownOutline class="-rotate-90 group-hover:rotate-0" />
  </button>
  <Dropdown placement="bottom">
    <DropdownItem on:click={() => handleDensitySelect(39)}>40</DropdownItem>
    <DropdownItem on:click={() => handleDensitySelect(59)}>60</DropdownItem>
    <DropdownItem on:click={() => handleDensitySelect(79)}>80</DropdownItem>
	<DropdownItem on:click={() => handleDensitySelect(99)}>100</DropdownItem>
  </Dropdown>
  <p class="text-white italic text-sm pl-3 translate-y-5 xl:translate-y-20 xxl:translate-y-1">Total Energy = <span class="text-purple-500">{totalEnergy}</span> MeV</p>
</div>
