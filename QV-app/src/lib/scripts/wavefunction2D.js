/**
 * Compute the 2D wavefunction for a particle in a box
 * The wavefunction is given by
 *   ψ(x,y) = (2/L) * sin(nₓπx/L) * sin(n_yπy/L)
 * probability density is ψ²
 *
 * @param {number} n_x - quantum number in x direction
 * @param {number} n_y - quantum number in y direction
 * @param {number} L - length of the box equal in both directions
 * @param {number} numPoints - number of points along one dimension (grid resolution)
 * @returns {Float32Array} A flat array containing x,y,z for each grid vertex
 */
export function computeWaveFunction2D(n_x, n_y, L = 1, numPoints = 50) {
  const vertices = new Float32Array(numPoints * numPoints * 3);
  let index = 0;
  for (let i = 0; i < numPoints; i++) {
    const x = (i / (numPoints - 1)) * L;
    for (let j = 0; j < numPoints; j++) {
      const y = (j / (numPoints - 1)) * L;
      const psi = (2 / L) * Math.sin(n_x * Math.PI * x / L) * Math.sin(n_y * Math.PI * y / L);
      const probDensity = psi * psi;
      vertices[index++] = x - L / 2;
      vertices[index++] = y - L / 2;
      vertices[index++] = probDensity;
    }
  }
  return vertices;
}