<script>
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
    import { computeWaveFunction2D } from '$lib/scripts/wavefunction2D.js';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { tick } from 'svelte';
	
	// Quantum numbers
    let n_x = $state(1);
	let n_y = $state(1);
    
	const L = 1;
	const numPoints = 50;
    const zScale = 0.1;

	let geometryStore = writable(null);

    /**
	 * Update the geometry's vertex z values using the computed 2D wavefunction.
	 */
     function updateGeometry() {
        const newGeometry = new THREE.PlaneGeometry(L, L, numPoints - 1, numPoints - 1);
        newGeometry.rotateX(-Math.PI / 2);
        const computedVertices = computeWaveFunction2D(n_x, n_y, L, numPoints);
        const posAttr = newGeometry.attributes.position;
        const colors = [];
        
        let minZ = Infinity, maxZ = -Infinity;
        for (let i = 0; i < posAttr.count; i++) {
            const z = computedVertices[i * 3 + 2] * zScale;
            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        }
        
        const color1 = new THREE.Color('blue');
        const color2 = new THREE.Color('#a855f7');
        const color3 = new THREE.Color('#ec4899');
        const color4 = new THREE.Color('#eab308');
        
        for (let i = 0; i < posAttr.count; i++) {
            const zVal = computedVertices[i * 3 + 2] * zScale;
            posAttr.setY(i, zVal);
            
            const t = (zVal - minZ) / (maxZ - minZ);
            let color = new THREE.Color();
            if (t <= 0.33) {
            const factor = t / 0.33;
            color.copy(color1).lerp(color2, factor);
            } else if (t <= 0.66) {
            const factor = (t - 0.33) / 0.33;
            color.copy(color2).lerp(color3, factor);
            } else {
            const factor = (t - 0.66) / 0.34;
            color.copy(color3).lerp(color4, factor);
            }
            colors.push(color.r, color.g, color.b);
        }
        
        posAttr.needsUpdate = true;
        newGeometry.computeVertexNormals();
        newGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        // Update the store so the mesh re-renders
        geometryStore.set(newGeometry);
        }

    const arrowOrigin = new THREE.Vector3(-L/2, 0, -L/2);
    const arrowLength = L + 0.25;
    const arrowLengthZ = L - 0.5;
    const arrowColor = 0xb3b3b3;

    const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), arrowOrigin, arrowLength, arrowColor);
    const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), arrowOrigin, arrowLengthZ, arrowColor);
    const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), arrowOrigin, arrowLength, arrowColor);
	
	onMount(async () => {
        await tick();
        // ensure the container has its final dimensions
        window.dispatchEvent(new Event('resize'));
        updateGeometry();
    });
	
	$effect(() => {
	    updateGeometry();
    });    
     
</script>

<div>
    <SC.Canvas
		antialias
		background={new THREE.Color('black')}
		shadows
		fog={new THREE.FogExp2('black', 0.1)}
	>
		<SC.Group>
			<SC.Mesh
				geometry={new THREE.PlaneGeometry(50, 50)}
				material={new THREE.MeshStandardMaterial({
					color: 'darkgray',
					side: THREE.DoubleSide
				})}
				rotation={[-Math.PI / 2, 0, 0]}
				receiveShadow
			/>
			<SC.Primitive
				object={new THREE.GridHelper(50, 200, '#333333', '#333333')}
			/>
		</SC.Group>
        <SC.Primitive object={arrowX} />
        <SC.Primitive object={arrowY} />
        <SC.Primitive object={arrowZ} />
		<SC.Mesh
			geometry={$geometryStore}
			material={new THREE.MeshStandardMaterial({
				vertexColors: true,
				side: THREE.DoubleSide,
				wireframe: false
			})}
			receiveShadow
		/>
		<SC.PerspectiveCamera position={[1, 1, 1.5]} />
		<SC.OrbitControls enableZoom={false} maxPolarAngle={Math.PI * 0.45} />
		<SC.AmbientLight intensity={0.5} />
		<SC.DirectionalLight
			intensity={0.6}
			position={[2, 2, 2]}
			shadow={{ mapSize: [1024, 1024] }}
		/>
	</SC.Canvas>
    <!-- Heat map legend -->
    <div class="absolute right-2 top-0 bottom-0 flex flex-col items-center pointer-events-none h-4/5 translate-y-8">
        <!-- gradient bar -->
        <div
          class="w-4 h-full border border-white"
          style="background: linear-gradient(to top, blue 0%, #a855f7 33%, #ec4899 66%, #eab308 100%);"
        ></div>
        <!-- labels -->
        <div class="absolute right-8 top-0 bottom-0 flex flex-col justify-between text-xs text-white">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
    </div>
    <div class="mb-4 translate-y-64 flex justify-center -translate-x-6">
        <label class="mr-4 text-white text-lg">
            nₓ :
            <select bind:value={n_x} onchange={updateGeometry} class="rounded-lg text-black bg-slate-300 ml-1">
                {#each [1, 2, 3, 4] as num}
                    <option value={num}>{num}</option>
                {/each}
            </select>
        </label>
        <label class="text-white text-lg">
            nᵧ :
            <select bind:value={n_y} onchange={updateGeometry} class="rounded-lg text-black bg-slate-300 ml-1">
                {#each [1, 2, 3, 4] as num}
                    <option value={num}>{num}</option>
                {/each}
            </select>
        </label>
    </div>
</div>