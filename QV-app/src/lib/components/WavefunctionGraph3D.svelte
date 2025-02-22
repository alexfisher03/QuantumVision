<script>
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import { onMount, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { computeWaveFunction3D } from '$lib/scripts/wavefunction3D.js';

	const L = 1;

	// Transparent cube (confinement area)
	let cubeGeometry = new THREE.BoxGeometry(L, L, L);
	const edges = new THREE.EdgesGeometry(cubeGeometry);
	const cubeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
	let cubeWireframe = new THREE.LineSegments(edges, cubeMaterial);

	// Orbital cloud (starting as a sphere)
	let orbitalGeometry = new THREE.SphereGeometry(0.45, 32, 32);
	const orbitalMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
	let orbitalMesh = new THREE.Mesh(orbitalGeometry, orbitalMaterial);
	let orbitalGeometryStore = writable(orbitalGeometry);

	// Quantum numbers
	let n_x = 1, n_y = 1, n_z = 1;

	function updateOrbital() {
		const densities = computeWaveFunction3D(n_x, n_y, n_z, orbitalGeometry);
		const posAttr = orbitalGeometry.attributes.position;
		const colors = [];
		let minD = Infinity, maxD = -Infinity;
		for (let i = 0; i < posAttr.count; i++) {
			const d = densities[i];
			if (d < minD) minD = d;
			if (d > maxD) maxD = d;
		}
		for (let i = 0; i < posAttr.count; i++) {
			const d = densities[i];
			const t = (d - minD) / (maxD - minD);
			let vertex = new THREE.Vector3().fromBufferAttribute(posAttr, i);
			vertex.multiplyScalar(1 + 0.2 * t);
			posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
			const color = new THREE.Color().setHSL(0.7 * (1 - t), 1, 0.5);
			colors.push(color.r, color.g, color.b);
		}
		posAttr.needsUpdate = true;
		orbitalGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
		orbitalGeometry.computeVertexNormals();
		orbitalGeometryStore.set(orbitalGeometry);
	}

	onMount(async () => {
		await tick();
		window.dispatchEvent(new Event('resize'));
		updateOrbital();
	});
</script>

<div>
	<SC.Canvas antialias background={new THREE.Color('#000000')} shadows fog={new THREE.FogExp2('black', 0.1)}>
		<SC.Primitive object={cubeWireframe} />
		<SC.Mesh geometry={$orbitalGeometryStore} material={orbitalMaterial} position={[0, 0, 0]} />
		<SC.PerspectiveCamera position={[1.5, 1.5, 1.5]} />
		<SC.OrbitControls enableZoom={true} maxPolarAngle={Math.PI * 0.45} />
		<SC.AmbientLight intensity={0.5} />
		<SC.DirectionalLight intensity={0.6} position={[2, 2, 2]} shadow={{ mapSize: [1024, 1024] }} />
	</SC.Canvas>
</div>
