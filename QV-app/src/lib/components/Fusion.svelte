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
    let fusedNucleus: any = null; // will store the fused deuteron (Step 4)
    let helium3: any = null;      // will store the helium‑3 nucleus (Step 6)
    let helium4: any = null;      // will store the helium‑4 nucleus (Step 8)
    let extraProton: any = null;   // the extra proton for the deuteron reaction (Step 5)
    let extraHelium3: any = null;  // extra helium‑3 for the helium‑3 reaction (Step 7)
    let pressureArrows = new THREE.Group();
  
    let paused: boolean = false;
    let simulationStarted: boolean = false;
    let fusionStarted: boolean = false;         // ensures fusion process (Step 3) starts only once
    let fusionEffectsSpawned: boolean = false;    // ensures extra effects (Step 4) spawn only once
    let extraFusionTriggered: boolean = false;    // ensures deuteron-extra proton fusion (Step 5) triggers only once
    let helium3FusionTriggered: boolean = false;  // ensures helium‑3 fusion (Step 7) triggers only once
  
    // Arrays for extra fusion particles.
    let positrons: any[] = [];
    let neutrinos: any[] = [];
    let electrons: any[] = [];  // for spawned electrons
    let gammaWaves: any[] = []; // for gamma wave objects
    let energyRipples: any[] = []; // for the big energy ripple in Step 8
  
     // Array of simulation steps.
     const steps = [
      "Step 1 - Initial Protons: Two protons are present",
      "Step 2 - Pressure Field: External forces draw the protons inward (i.e. the Sun's gravity)",
      "Step 3 - Fusion Reaction: Protons overcome Coulomb repulsion and fuse",
      "Step 4 - Energy Release: Produces a deuteron, emits a positron and neutrino. Positron & electron annihilate to yield two gamma rays",
      "Step 5 - Deuteron Reaction: The deuteron fuses with another nearby proton",
      "Step 6 - Energy Release: Produces helium-3, emitting an additional gamma photon",
      "Step 7 - Helium-3 Reaction: Two helium-3 nuclei fuse, one from the last reaction and one from another reaction nearby",
      "Step 8 - Helium-4 Formation: Produces helium-4 and releases two protons and additional energy. These new protons allow the cycle to continue..."
    ];
    let currentStepIndex: number = 0;

    const reactionTimes = [
        "Static",
        "Millions of Years Worth Of Pressure",
        "~9 Billion Years (rate‑limiting)",
        "Almost Instantaneously (<10⁻¹⁸ s)",
        "~1 Second",
        "~1 Second",
        "~1 Second",
        "almost instantaneously (<10⁻⁹ s)"
    ]
    let currentReactionTimeIndex: number = 0;
  
    // Timing variables.
    let simulationTime = 0;
    let lastTime = performance.now();
    const pressureTriggerTime = 2000;    // Until 2000ms: Step 1.
    const fusionStartTime = 4000;        // 2000ms to 4000ms: Step 2.
    const fusionTriggerTime = 11000;     // 4000ms to 11000ms: Step 3; fusion triggers at 11000ms → then Step 4.
    const deuteronReactionTriggerTime = 13000;  // After 13000ms, extra proton should start moving (Step 5).
    const helium3FusionTriggerTime = 17000;     // After 17000ms, extra helium‑3 should begin fusion (Step 7).
  
    let isVibrating: boolean = false;
    let isVibratingExtra: boolean = false; // for extra proton & helium‑3 vibration

    // total energy var
    let totalEnergy = 0;
  
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
  
    // helper to create a 1D sinusoidal gamma wave
    // For Step 4 we spawn TWO such waves
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
      let randomDir = new Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize().multiplyScalar(0.002);
      line.userData.velocity = randomDir;
      line.userData.startTime = simulationTime;
      return line;
    }
  
    // helper to create energy ripple
    function createEnergyRipple() {
      const geometry = new THREE.RingGeometry(0.5, 0.55, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ripple = new THREE.Mesh(geometry, material);
      ripple.userData.startTime = simulationTime;
      // Give the ripple an outward radial velocity.
      ripple.userData.velocity = new Vector3(0.001, 0.001, 0.001);
      return ripple;
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
      energyRipples = [];
      simulationStarted = false;
      fusionStarted = false;
      fusionEffectsSpawned = false;
      extraFusionTriggered = false;
      helium3FusionTriggered = false;
      fusedNucleus = null;
      helium3 = null;
      helium4 = null;
      extraProton = null;
      extraHelium3 = null;
      isVibrating = false;
      isVibratingExtra = false;
      currentStepIndex = 0;
      currentReactionTimeIndex = 0;
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
      // Use the edges geometry here.
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
  
    // Function to fuse the two protons into a deuteron (Step 4).
    function fuseProtons() {
      fusedNucleus = createDeuteron();
      fusedNucleus.scale.set(1.2, 1.2, 1.2);
      sceneGroup.remove(targetsGroup);
      proton1 = null;
      proton2 = null;
      sceneGroup.add(fusedNucleus);
      totalEnergy += 1.44;
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
      extraProton.position.set(3, 0, 0); // Spawn off-screen along +X.
      sceneGroup.add(extraProton);
    }
  
    // Function to fuse the deuteron with the extra proton to form helium-3 (Step 6).
    function fuseDeuteronWithProton() {
      totalEnergy += 5.49;
      sceneGroup.remove(fusedNucleus);
      sceneGroup.remove(extraProton);
      helium3 = createHelium3();
      helium3.scale.set(1.2, 1.2, 1.2);
      sceneGroup.add(helium3);
      currentStepIndex = 5;
      currentReactionTimeIndex = 5;
      // Spawn one gamma wave at the helium-3 location.
      let gammaWave = createGammaWave();
      gammaWave.position.copy(helium3.position);
      sceneGroup.add(gammaWave);
      gammaWaves.push(gammaWave);
      // After helium3 is formed, schedule extra helium3 spawn (for Step 7).
      setTimeout(() => {
        currentStepIndex = 6; // Step 7.
        currentReactionTimeIndex = 6;
        if (!extraHelium3) {
          spawnExtraHelium3();
        }
      }, 2000);
    }
  
    // Function to spawn an extra helium-3 nucleus for Step 7.
    function spawnExtraHelium3() {
      extraHelium3 = createHelium3();
      extraHelium3.position.set(3, 0, 0); // Spawn off-screen along +X.
      sceneGroup.add(extraHelium3);
    }
  
    // Function to fuse two helium-3 nuclei into helium-4 (Step 8).
    function fuseHelium3() {
      totalEnergy += 12.86;
      sceneGroup.remove(helium3);
      sceneGroup.remove(extraHelium3);
      helium4 = createHelium4();
      helium4.scale.set(1.3, 1.3, 1.3);
      sceneGroup.add(helium4);
      currentStepIndex = 7;
      currentReactionTimeIndex = 7;
      // Spawn a big energy ripple to visualize energy release.
      let energyRipple = createEnergyRipple();
      energyRipple.position.copy(helium4.position);
      sceneGroup.add(energyRipple);
      energyRipples.push(energyRipple);
      // Spawn two new protons in arbitrary directions.
      let newProton1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.025, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0xff0000,
          emissive: 0xff5555,
          emissiveIntensity: 1,
          roughness: 0.8,
          metalness: 0.2
        })
      );
      let newProton2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.025, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0xff0000,
          emissive: 0xff5555,
          emissiveIntensity: 1,
          roughness: 0.8,
          metalness: 0.2
        })
      );
      newProton1.position.copy(helium4.position);
      newProton2.position.copy(helium4.position);
      newProton1.userData.velocity = new Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize().multiplyScalar(0.005);
      newProton2.userData.velocity = new Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize().multiplyScalar(0.005);
      // Create a new targetsGroup to hold these ejected protons.
      targetsGroup = new THREE.Group();
      targetsGroup.add(newProton1);
      targetsGroup.add(newProton2);
      sceneGroup.add(targetsGroup);
    }
  
    // NEW: Helper to create a helium-4 nucleus (2 protons and 2 neutrons).
    function createHelium4() {
      let group = new THREE.Group();
      // Two red spheres (protons)
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
      // Two grey spheres (neutrons)
      const greyGeo = new THREE.SphereGeometry(0.03, 16, 16);
      const greyMat = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.8,
        metalness: 0.2
      });
      const neutronA = new THREE.Mesh(greyGeo, greyMat);
      const neutronB = new THREE.Mesh(greyGeo, greyMat);
      neutronA.position.set(0, 0.02, 0);
      neutronB.position.set(0, -0.02, 0);
      group.add(protonA);
      group.add(protonB);
      group.add(neutronA);
      group.add(neutronB);
      // Surrounding shell.
      const shellGeo = new THREE.SphereGeometry(0.08, 32, 32);
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
  
    // In the animation loop, check if simulationTime exceeds fusionTriggerTime to trigger fusion effects (Step 4).
    function checkFusionTrigger() {
      if (fusionStarted && simulationTime >= fusionTriggerTime && !fusionEffectsSpawned) {
        fuseProtons();
        isVibrating = false;
        currentStepIndex = 3; // Energy Release step.
        currentReactionTimeIndex = 3;
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
        // Spawn one electron.
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
            currentStepIndex = 4; // Step 5: Deuteron Reaction.
            currentReactionTimeIndex = 4;
            if (!extraProton) {
              spawnExtraProton();
            }
          }, 2000);
        }
      }
    }
  
    // In the animation loop, update the extra proton's movement for Step 5.
    function updateExtraProton() {
      if (simulationTime >= deuteronReactionTriggerTime && extraProton && fusedNucleus) {
        const center = fusedNucleus.position.clone();
        let distance = extraProton.position.distanceTo(center);
        let accelFactor = 0.008 + (0.001 / distance);
        let toCenter = center.clone().sub(extraProton.position);
        const helixAxis = new Vector3(0, 1, 0);
        let helixOffset = toCenter.clone().cross(helixAxis).normalize().multiplyScalar(0.01);
        let zOffset = new Vector3(0, 0, 0.002 * Math.sin(simulationTime * 0.01));
        extraProton.position.add(toCenter.multiplyScalar(accelFactor)).add(helixOffset).add(zOffset);
        // When extra proton nears fusedNucleus, trigger rapid vibration and fuse (Step 5).
        if (extraProton.position.distanceTo(fusedNucleus.position) < 0.3 && !extraFusionTriggered) {
          extraFusionTriggered = true;
          isVibrating = true;
          setTimeout(() => {
            fuseDeuteronWithProton();
            isVibrating = false;
          }, 4000);
        }
      }
    }
  
    // In the animation loop, update the extra helium-3's movement for Step 7.
    function updateExtraHelium3() {
      if (simulationTime >= helium3FusionTriggerTime && extraHelium3 && helium3) {
        const center = helium3.position.clone();
        let distance = extraHelium3.position.distanceTo(center);
        let accelFactor = 0.001 + (0.006 / distance);
        let toCenter = center.clone().sub(extraHelium3.position);
        const helixAxis = new Vector3(0, 1, 0);
        let helixOffset = toCenter.clone().cross(helixAxis).normalize().multiplyScalar(0.02);
        let zOffset = new Vector3(0, 0, 0.002 * Math.sin(simulationTime * 0.015));
        extraHelium3.position.add(toCenter.multiplyScalar(accelFactor)).add(helixOffset).add(zOffset);
        // When extra helium-3 nears helium-3, trigger rapid vibration.
        if (extraHelium3.position.distanceTo(helium3.position) < 0.1 && !helium3FusionTriggered) {
          helium3FusionTriggered = true;
          isVibratingExtra = true;
          setTimeout(() => {
            fuseHelium3();
            isVibratingExtra = false;
          }, 4000);
        }
      }
    }
  
    // In the animation loop, update simulation using simulationTime.
    function animateFrame() {
      const now = performance.now();
      if (!paused && simulationStarted) {
        simulationTime += now - lastTime;
      }
      lastTime = now;
  
      if (targetsGroup) {
        targetsGroup.rotation.y += 0.0001;
        // NEW: Update any targetsGroup children with a defined velocity.
        targetsGroup.children.forEach((child: any) => {
          if (child.userData.velocity) {
            child.position.add(child.userData.velocity);
          }
        });
      }
      sceneGroup.rotation.y += 0.0001;
  
      if (!paused && simulationStarted) {
        // Update current step based on simulationTime.
        if (simulationTime < pressureTriggerTime) {
          currentStepIndex = 0;
          currentReactionTimeIndex = 0;
        } else if (simulationTime >= pressureTriggerTime && simulationTime < fusionStartTime) {
          currentStepIndex = 1;
          currentReactionTimeIndex = 1;
        } else if (simulationTime >= fusionStartTime && simulationTime < fusionTriggerTime) {
          currentStepIndex = 2;
          currentReactionTimeIndex = 2;
          isVibrating = true;
          if (!fusionStarted) {
            startFusion();
          }
        }
        checkFusionTrigger();
        checkElectronPositronCollision();
        updateExtraProton();
        updateExtraHelium3();
  
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
        // Update energy ripples.
        energyRipples.forEach((r, i) => {
          r.scale.x += 0.01;
          r.scale.y += 0.01;
          r.scale.z += 0.01;
          let elapsed = simulationTime - r.userData.startTime;
          r.material.opacity = Math.max(0.8 - elapsed / 6000, 0);
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
    <button class="bg-transparent border border-white rounded-xl py-3 px-5 transform transition duration-300 ease-in-out text-white text-sm mr-3 mt-3 -translate-y-20 translate-x-60 xl:-translate-y-28 xl:translate-x-[335px] xxl:translate-x-[335px] xxl:-translate-y-52 hover:scale-105 hover:text-[#dc3e3e] hover:border-[#dc3e3e]"
            onclick={beginSimulation}>
      Begin Simulation
    </button>
    <button class="bg-transparent border border-white rounded-xl py-3 px-5 transform transition duration-300 ease-in-out text-white text-sm mr-3 mt-3 -translate-y-3 translate-x-[150px] xl:-translate-y-12 xl:translate-x-[250px] xxl:-translate-y-36 xxl:translate-x-[250px] hover:scale-105 hover:text-[#9f3edc] hover:border-[#9f3edc]"
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
    <p class="text-white italic text-sm pl-3 translate-y-28 xl:translate-y-44 xxl:translate-y-20">Total Energy = <span class="text-purple-500">{totalEnergy}</span> MeV</p>
    <!-- Dynamic step description -->
    <p class="text-white italic text-sm p-2 translate-y-40 xl:translate-y-56 xxl:translate-y-32 bg-opacity-30 bg-white rounded-xl fixed">
      {steps[currentStepIndex]}
    </p>
    <p class="text-white text-sm font-bold p-2 translate-y-60 xl:translate-y-72 xxl:translate-y-48 bg-opacity-30 bg-white rounded-xl fixed">Approximate Reaction Time = <span class="text-red-500 italic">{reactionTimes[currentReactionTimeIndex]}</span></p>
  </div>
  