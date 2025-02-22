import * as THREE from 'three';

/**
 * @param {number} n_x
 * @param {number} n_y
 * @param {number} n_z
 * @param {any} geometry
 */
export function computeWaveFunction3D(n_x, n_y, n_z, geometry) {
  const posAttr = geometry.attributes.position;
  const densities = [];
  const L = 1;
  const offset = L / 2;
  
  for (let i = 0; i < posAttr.count; i++) {
    const vertex = new THREE.Vector3().fromBufferAttribute(posAttr, i);
    const x = vertex.x + offset;
    const y = vertex.y + offset;
    const z = vertex.z + offset;
    const psi = Math.sin(n_x * Math.PI * x / L) *
                Math.sin(n_y * Math.PI * y / L) *
                Math.sin(n_z * Math.PI * z / L);
    densities.push(psi * psi);
  }
  return densities;
}
