<script lang="ts">
    import * as THREE from 'three';
    import { Vector3 } from 'three';
    import * as SC from 'svelte-cubed';
    import { onMount, tick } from 'svelte';
  
    // Parent group for the entire scene.
    let sceneGroup = new THREE.Group();
    // Group for the reaction targets (initially the two protons).
    let targetsGroup = new THREE.Group();
  
    let cubeWireframe: any;
    let proton1: any;
    let proton2: any;
    let fusedNucleus: any = null; // will store the fused deuteron
    let helium3: any = null;      // will store the helium-3 nucleus
    let extraProton: any = null;   // the extra proton for deuteron reaction
    let pressureArrows = new THREE.Group();
  
    let paused: boolean = false;
    let simulationStarted: boolean = false;
    let fusionStarted: boolean = false; // ensures fusion process starts only once
    let fusionEffectsSpawned: boolean = false; // ensures extra effects spawn only once
    let extraFusionTriggered: boolean = false; // ensures deuteron-extra proton fusion triggers only once
  
    // Arrays for extra fusion particles.
    let positrons: any[] = [];
    let neutrinos: any[] = [];
    let electrons: any[] = [];  // for spawned electrons
    let gammaWaves: any[] = []; // for gamma wave objects
  
    // Array of simulation steps.
    const steps = [
      "Step 1 - Initial Protons: Two protons are present",
      "Step 2 - Pressure Field: External forces draw the protons inward",
      "Step 3 - Fusion Reaction: Protons overcome Coulomb repulsion and fuse",
      "Step 4 - Energy Release: Produces a deuteron, emits a positron and neutrino; the positron annihilates with an electron to yield two gamma rays",
      "Step 5 - Deuteron Reaction: The deuteron fuses with another nearby proton",
      "Step 6 - Energy Release: Produces helium-3, emitting an additional gamma photon",
      "Step 7 - Helium-3 Reaction: Two helium-3 nuclei fuse, one from the last reaction and one from another reaction nearby",
      "Step 8 - Helium-4 Formation: Produces helium-4 and releases two protons and additional energy. These new protons allow the cycle to continue..."
    ];
    let currentStepIndex: number = 0;
  
    // Timing variables.
    let simulationTime = 0;
    let lastTime = performance.now();
    const pressureTriggerTime = 2000;    // Until 2000ms: Step 1.
    const fusionStartTime = 4000;        // 2000ms to 4000ms: Step 2.
    const fusionTriggerTime = 11000;     // 4000ms to 11000ms: Step 3; fusion triggers at 11000ms → then Step 4.
    const deuteronReactionTriggerTime = 13000;  // After 13000ms, spawn extra proton (Step 5).
    const helium3FusionTriggerTime = 17000;     // After 17000ms, fuse deuteron + extra proton → helium-3.
  
    let isVibrating: boolean = false;
    let isVibratingExtra: boolean = false; // for deuteron & extra proton vibration
  
    // Helper to create a nucleus (core + halo); used for fused objects.
    function createNucleus() {
      let group = new THREE.Group();
      const coreGeometry = new THREE.SphereGeometry(0.05, 32, 32);
      const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0x6082B6,
        roughness: 0.8,
        metalness: 0.2
      });
      const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
      group.add(coreSphere);
      const haloGeometry = new THREE.SphereGeometry(0.075, 32, 32);
      const haloMaterial = new THREE.MeshStandardMaterial({
        color: 0x00008B,
        opacity: 0.2,
        transparent: true,
        roughness: 1.0,
        metalness: 0.3
      });
      const haloSphere = new THREE.Mesh(haloGeometry, haloMaterial);
      group.add(haloSphere);
      return group;
    }
  
    // Helper to create a deuteron.
    function createDeuteron() {
      let group = new THREE.Group();
      // Create red sphere.
      const redGeo = new THREE.SphereGeometry(0.03, 16, 16);
      const redMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.8,
        metalness: 0.2
      });
      const redSphere = new THREE.Mesh(redGeo, redMat);
      redSphere.position.set(-0.015, 0, 0);
      // Create grey sphere.
      const greyGeo = new THREE.SphereGeometry(0.03, 16, 16);
      const greyMat = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.8,
        metalness: 0.2
      });
      const greySphere = new THREE.Mesh(greyGeo, greyMat);
      greySphere.position.set(0.015, 0, 0);
      group.add(redSphere);
      group.add(greySphere);
      // Create a surrounding shell.
      const shellGeo = new THREE.SphereGeometry(0.06, 32, 32);
      const shellMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        opacity: 0.2,
        transparent: true,
        roughness: 1.0,
        metalness: 0.3
      });
      const shell = new THREE.Mesh(shellGeo, shellMat);
      group.add(shell);
      return group;
    }
  
    // Helper to create a helium-3 nucleus.
    function createHelium3() {
      let group = new THREE.Group();
      // Two red spheres (protons).
      const redGeo = new THREE.SphereGeometry(0.03, 16, 16);
      const redMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        roughness: 0.8,
        metalness: 0.2
      });
      const protonA = new THREE.Mesh(redGeo, redMat);
      const protonB = new THREE.Mesh(redGeo, redMat);
      protonA.position.set(-0.02, 0, 0);
      protonB.position.set(0.02, 0, 0);
      // One grey sphere (neutron).
      const greyGeo = new THREE.SphereGeometry(0.03, 16, 16);
      const greyMat = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.8,
        metalness: 0.2
      });
      const neutron = new THREE.Mesh(greyGeo, greyMat);
      neutron.position.set(0, 0.03, 0);
      group.add(protonA);
      group.add(protonB);
      group.add(neutron);
      // Surrounding shell.
      const shellGeo = new THREE.SphereGeometry(0.07, 32, 32);
      const shellMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        opacity: 0.2,
        transparent: true,
        roughness: 1.0,
        metalness: 0.3
      });
      const shell = new THREE.Mesh(shellGeo, shellMat);
      group.add(shell);
      return group;
    }
  
    // Helper to create a positron (blue glowing sphere) that always launches in +X.
    function createPositron() {
      const geo = new THREE.SphereGeometry(0.03, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        emissive: 0x0000ff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.9
      });
      const positron = new THREE.Mesh(geo, mat);
      let direction = new Vector3(1, 0, 0);
      positron.userData.velocity = direction.clone().multiplyScalar(0.005);
      positron.userData.direction = direction.clone();
      return positron;
    }
  
    // Helper to create a neutrino (green sphere).
    function createNeutrino() {
      const geo = new THREE.SphereGeometry(0.02, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 3,
        transparent: true,
        opacity: 0.9
      });
      const neutrino = new THREE.Mesh(geo, mat);
      neutrino.userData.velocity = new Vector3(
        (Math.random() - 0.5) * 0.025,
        (Math.random() - 0.5) * 0.025,
        (Math.random() - 0.5) * 0.025
      );
      return neutrino;
    }
  
    // Helper to create an electron. (Do not change this function)
    function createElectron(direction: any) {
      const geo = new THREE.SphereGeometry(0.03, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xadd8e6,
        emissive: 0xadd8e6,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.9
      });
      const electron = new THREE.Mesh(geo, mat);
      electron.position.set(2, 0, 0);
      electron.userData.velocity = new Vector3(-0.005, 0, 0);
      return electron;
    }
  
    // NEW: Helper to create a 1D sinusoidal gamma wave.
    // This creates a line representing a gamma ray that travels in a random direction.
    // In this version, we spawn TWO such waves.
    function createGammaWave() {
      const points = [];
      const segments = 50;
      const length = 2;
      const amplitude = 0.1;
      const frequency = 20;
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * length;
        const y = amplitude * Math.sin(frequency * x);
        points.push(new Vector3(x, y, 0));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.8
      });
      const line = new THREE.Line(geometry, material);
      // Rotate the line to a random orientation.
      line.rotation.x = Math.random() * Math.PI * 2;
      line.rotation.y = Math.random() * Math.PI * 2;
      line.rotation.z = Math.random() * Math.PI * 2;
      // Give the gamma wave a velocity so it travels.
      let randomDir = new Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize().multiplyScalar(0.002);
      line.userData.velocity = randomDir;
      line.userData.startTime = simulationTime;
      return line;
    }
  
    // Reset the entire fusion simulation.
    function resetFusionSimulation() {
      while (sceneGroup.children.length > 0) {
        sceneGroup.remove(sceneGroup.children[0]);
      }
      positrons = [];
      neutrinos = [];
      electrons = [];
      gammaWaves = [];
      simulationStarted = false;
      fusionStarted = false;
      fusionEffectsSpawned = false;
      extraFusionTriggered = false;
      fusedNucleus = null;
      helium3 = null;
      extraProton = null;
      isVibrating = false;
      isVibratingExtra = false;
      currentStepIndex = 0;
      simulationTime = 0;
      lastTime = performance.now();
  
      // Recreate the boundary cube.
      const L = 3;
      const cubeGeo = new THREE.BoxGeometry(L, L, L);
      const edges = new THREE.EdgesGeometry(cubeGeo);
      const cubeMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2
      });
      cubeWireframe = new THREE.LineSegments(edges, cubeMat);
      sceneGroup.add(cubeWireframe);
  
      // Recreate pressure arrows.
      pressureArrows = new THREE.Group();
      const arrowLength = 0.3;
      const arrowColor = 0x00ffff;
      const offsets = [-0.05, 0, 0.05];
      const faces = [
        { position: new Vector3(0, 0, 1.5), direction: new Vector3(0, 0, -1), tangent: new Vector3(1, 0, 0) },
        { position: new Vector3(0, 0, -1.5), direction: new Vector3(0, 0, 1), tangent: new Vector3(1, 0, 0) },
        { position: new Vector3(1.5, 0, 0), direction: new Vector3(-1, 0, 0), tangent: new Vector3(0, 1, 0) },
        { position: new Vector3(-1.5, 0, 0), direction: new Vector3(1, 0, 0), tangent: new Vector3(0, 1, 0) },
        { position: new Vector3(0, 1.5, 0), direction: new Vector3(0, -1, 0), tangent: new Vector3(1, 0, 0) },
        { position: new Vector3(0, -1.5, 0), direction: new Vector3(0, 1, 0), tangent: new Vector3(1, 0, 0) }
      ];
      faces.forEach(face => {
        offsets.forEach(offset => {
          const startPos = face.position.clone().add(face.tangent.clone().multiplyScalar(offset));
          const arrow = new THREE.ArrowHelper(face.direction, startPos, arrowLength, arrowColor);
          pressureArrows.add(arrow);
        });
      });
      sceneGroup.add(pressureArrows);
  
      // Recreate targetsGroup and protons.
      targetsGroup = new THREE.Group();
      const protonGeometry = new THREE.SphereGeometry(0.05, 16, 16);
      const protonMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff5555,
        emissiveIntensity: 1,
        roughness: 0.8,
        metalness: 0.2
      });
      proton1 = new THREE.Mesh(protonGeometry, protonMaterial);
      proton2 = new THREE.Mesh(protonGeometry, protonMaterial);
      proton1.position.set(-0.3, 0, 0);
      proton2.position.set(0.3, 0, 0);
      targetsGroup.add(proton1);
      targetsGroup.add(proton2);
      sceneGroup.add(targetsGroup);
  
      window.dispatchEvent(new Event('resize'));
    }
  
    onMount(async () => {
      // Initially, the simulation is paused until "Begin Simulation" is clicked.
      resetFusionSimulation();
      await tick();
      window.dispatchEvent(new Event('resize'));
    });
  
    // Function to fuse the two protons into a deuteron.
    function fuseProtons() {
      fusedNucleus = createDeuteron();
      fusedNucleus.scale.set(1.2, 1.2, 1.2);
      sceneGroup.remove(targetsGroup);
      proton1 = null;
      proton2 = null;
      sceneGroup.add(fusedNucleus);
    }
  
    // Function to start fusion (Step 3).
    function startFusion() {
      if (fusionStarted) return;
      fusionStarted = true;
      currentStepIndex = 2;
      isVibrating = true;
    }
  
    // Function to spawn an extra proton for the deuteron reaction (Step 5).
    function spawnExtraProton() {
      const protonGeometry = new THREE.SphereGeometry(0.025, 16, 16);
      const protonMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff5555,
        emissiveIntensity: 1,
        roughness: 0.8,
        metalness: 0.2
      });
      extraProton = new THREE.Mesh(protonGeometry, protonMaterial);
      // Spawn the extra proton off-screen along +X.
      extraProton.position.set(3, 0, 0);
      sceneGroup.add(extraProton);
    }
  
    // Function to fuse the deuteron with the extra proton to form helium-3 (Step 6).
    function fuseDeuteronWithProton() {
      sceneGroup.remove(fusedNucleus);
      sceneGroup.remove(extraProton);
      helium3 = createHelium3();
      helium3.scale.set(1.2, 1.2, 1.2);
      sceneGroup.add(helium3);
      currentStepIndex = 5;
      // Spawn one additional gamma wave at the helium-3 location.
      let gammaWave = createGammaWave();
      gammaWave.position.copy(helium3.position);
      sceneGroup.add(gammaWave);
      gammaWaves.push(gammaWave);
    }
  
    // In the animation loop, check if simulationTime exceeds fusionTriggerTime to trigger fusion effects.
    function checkFusionTrigger() {
      if (fusionStarted && simulationTime >= fusionTriggerTime && !fusionEffectsSpawned) {
        fuseProtons();
        isVibrating = false;
        currentStepIndex = 3;
        // Spawn one positron.
        let positron = createPositron();
        positron.position.set(0, 0, 0);
        sceneGroup.add(positron);
        positrons.push(positron);
        // Spawn one neutrino.
        let neutrino = createNeutrino();
        neutrino.position.set(0.1, 0, 0);
        sceneGroup.add(neutrino);
        neutrinos.push(neutrino);
        // Spawn one electron using the positron's stored direction.
        let electron = createElectron(positron.userData.direction);
        sceneGroup.add(electron);
        electrons.push(electron);
        fusionEffectsSpawned = true;
      }
    }
  
    // In the animation loop, check for electron-positron collision.
    function checkElectronPositronCollision() {
      if (positrons.length > 0 && electrons.length > 0) {
        let positron = positrons[0];
        let electron = electrons[0];
        if (positron.position.distanceTo(electron.position) < 0.05) {
          sceneGroup.remove(positron);
          sceneGroup.remove(electron);
          positrons.splice(0, 1);
          electrons.splice(0, 1);
          // Spawn TWO gamma waves at the collision point.
          let gammaWave1 = createGammaWave();
          gammaWave1.position.copy(positron.position);
          gammaWave1.rotation.z = Math.PI / 4;
          sceneGroup.add(gammaWave1);
          gammaWaves.push(gammaWave1);
          let gammaWave2 = createGammaWave();
          gammaWave2.position.copy(positron.position);
          gammaWave2.rotation.z = -Math.PI / 4;
          sceneGroup.add(gammaWave2);
          gammaWaves.push(gammaWave2);
          // After gamma emission, schedule Step 5: spawn an extra proton.
          setTimeout(() => {
            currentStepIndex = 4;
            if (!extraProton) {
              spawnExtraProton();
            }
          }, 2000);
        }
      }
    }
  
    // In the animation loop, update the extra proton for Step 5.
    function updateExtraProton() {
      if (simulationTime >= deuteronReactionTriggerTime && extraProton && fusedNucleus) {
        const center = fusedNucleus.position.clone();
        let distance = extraProton.position.distanceTo(center);
        // Differential acceleration: weaker overall pull with a lower base factor.
        let accelFactor = 0.001 + (0.002 / distance);
        let toCenter = center.clone().sub(extraProton.position);
        // Create a helical path: add a rotating offset.
        const helixAxis = new Vector3(0, 1, 0); // Y-axis
        let helixOffset = toCenter.clone().cross(helixAxis).normalize().multiplyScalar(0.02);
        // Also add a small Z offset to break the flatness.
        let zOffset = new Vector3(0, 0, 0.001 * Math.sin(simulationTime * 0.01));
        extraProton.position.add(toCenter.multiplyScalar(accelFactor)).add(helixOffset).add(zOffset);
        // If extraProton nears fusedNucleus, trigger rapid vibration for both.
        if (extraProton.position.distanceTo(fusedNucleus.position) < 0.4 && !extraFusionTriggered) {
          extraFusionTriggered = true;
          isVibrating = true;
          // Delay extra fusion for cinematic tension.
          setTimeout(() => {
            fuseDeuteronWithProton();
            isVibrating = false;
          }, 4000);
        }
      }
    }
  
    // Animation loop: update simulation using simulationTime.
    function animateFrame() {
      const now = performance.now();
      if (!paused && simulationStarted) {
        simulationTime += now - lastTime;
      }
      lastTime = now;
  
      // Rotate targetsGroup and sceneGroup slightly.
      if (targetsGroup) {
        targetsGroup.rotation.y += 0.0001;
      }
      sceneGroup.rotation.y += 0.0001;
  
      if (!paused && simulationStarted) {
        // Update current step based on simulationTime.
        if (simulationTime < pressureTriggerTime) {
          currentStepIndex = 0;
        } else if (simulationTime >= pressureTriggerTime && simulationTime < fusionStartTime) {
          currentStepIndex = 1;
        } else if (simulationTime >= fusionStartTime && simulationTime < fusionTriggerTime) {
          currentStepIndex = 2;
          isVibrating = true;
          if (!fusionStarted) {
            startFusion();
          }
        }
  
        // Check if it's time to trigger fusion effects.
        checkFusionTrigger();
        // Check for electron-positron collision.
        checkElectronPositronCollision();
        // Update extra proton movement for Step 5.
        updateExtraProton();
  
        if (!fusedNucleus && proton1 && proton2) {
          const center = new Vector3(0, 0, 0);
          [proton1, proton2].forEach(proton => {
            let toCenter = center.clone().sub(proton.position);
            let attraction = toCenter.multiplyScalar(0.005);
            let oscillation = new Vector3(
              0.0005 * Math.sin(simulationTime * 0.01),
              0.0005 * Math.cos(simulationTime * 0.01),
              0
            );
            proton.position.add(attraction).add(oscillation);
          });
          if (isVibrating) {
            const vibrationIntensity = 0.007;
            proton1.position.x += (Math.random() - 0.5) * vibrationIntensity;
            proton1.position.y += (Math.random() - 0.5) * vibrationIntensity;
            proton2.position.x += (Math.random() - 0.5) * vibrationIntensity;
            proton2.position.y += (Math.random() - 0.5) * vibrationIntensity;
          }
        }
        if (fusedNucleus) {
          fusedNucleus.position.lerp(new Vector3(0, 0, 0), 0.05);
        }
        // Update positrons.
        positrons.forEach((p, i) => {
          p.position.add(p.userData.velocity);
          if (p.position.length() > 5) {
            sceneGroup.remove(p);
            positrons.splice(i, 1);
          }
        });
        // Update neutrinos.
        neutrinos.forEach((n, i) => {
          n.position.add(n.userData.velocity);
          if (n.position.length() > 5) {
            sceneGroup.remove(n);
            neutrinos.splice(i, 1);
          }
        });
        // Update electrons.
        electrons.forEach((e, i) => {
          e.position.add(e.userData.velocity);
          if (e.position.x <= 1) {
            e.userData.velocity.set(0, 0, 0);
          }
          if (e.position.length() > 5) {
            sceneGroup.remove(e);
            electrons.splice(i, 1);
          }
        });
        // Update gamma waves.
        gammaWaves.forEach((g, i) => {
          g.position.add(g.userData.velocity);
          g.scale.x += 0.005;
          g.scale.y += 0.005;
          g.scale.z += 0.005;
          let elapsed = simulationTime - g.userData.startTime;
          g.material.opacity = Math.max(0.7 - elapsed / 8000, 0);
        });
      }
      requestAnimationFrame(animateFrame);
    }
    animateFrame();
  
    // Begin Simulation handler: resets and starts the simulation.
    function beginSimulation() {
      resetFusionSimulation();
      simulationStarted = true;
      simulationTime = 0;
      lastTime = performance.now();
    }
  
    function togglePause() {
      paused = !paused;
    }
  </script>
  
  <div>
    <h2 class="-translate-y-24 xl:-translate-y-32 xxl:-translate-y-56 font-bold">
      <i>Proton - Proton</i> Fusion Reaction
    </h2>
    <SC.Canvas antialias background={new THREE.Color('#000000')} shadows>
      <SC.Primitive object={sceneGroup} />
      <SC.PerspectiveCamera position={[1.5, 1.5, 1.5]} />
      <SC.OrbitControls enableZoom={true} minDistance={1} maxDistance={6} />
      <SC.AmbientLight intensity={0.5} />
      <SC.DirectionalLight intensity={0.6} position={[2, 2, 2]} />
    </SC.Canvas>
    <!-- Begin Simulation button -->
    <button class="bg-transparent border border-white rounded-xl py-3 px-5 transform transition duration-300 ease-in-out text-white text-sm mr-3 mt-3 -translate-y-20 translate-x-60 xl:-translate-y-28 xl:translate-x-[335px] xxl:translate-x-[335px] xxl:-translate-y-52"
            onclick={beginSimulation}>
      Begin Simulation
    </button>
    <button class="bg-transparent border border-white rounded-xl py-3 px-5 transform transition duration-300 ease-in-out text-white text-sm mr-3 mt-3 -translate-y-12 translate-x-[150px] xl:-translate-y-4 xl:translate-x-[250px] xxl:-translate-y-36 xxl:translate-x-[250px]"
            onclick={togglePause}>
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
    <!-- Dynamic step description -->
    <p class="text-white italic text-sm pl-3 translate-y-28 xl:translate-y-44 xxl:translate-y-20">
      {steps[currentStepIndex]}
    </p>
  </div>
  