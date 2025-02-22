/**
 * Computes the probability density for each vertex.
 * The original sphere vertex positions (in range roughly [-0.45, 0.45])
 * are remapped to [0,L] to represent the box coordinates.
 * Returns an array of ψ² values.
 *
 * @param {number} n_x - Quantum number along x
 * @param {number} n_y - Quantum number along y
 * @param {number} n_z - Quantum number along z
 * @param {number} L - Length of the box
 * @param {number} x coordinate of the vertex in the grid
 * @param {number} y coordinate of the vertex in the grid
 * @param {number} z coordinate of the vertex in the grid
 * @returns {number}
 */
export function computeWaveFunction3D(n_x, n_y, n_z, x, y, z, L = 1) {
    const psi = Math.sin(n_x * Math.PI * x / L) *
                Math.sin(n_y * Math.PI * y / L) *
                Math.sin(n_z * Math.PI * z / L);
    return psi * psi;
  }
  