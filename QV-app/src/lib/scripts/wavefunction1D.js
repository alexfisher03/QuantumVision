/**
 * 
 * @param {number} n - quantum number
 * @param {number} L - length of the box
 * @param {number} numPoints - number of points to compute the wave function
 */

export function computeWaveFunction(n, L = 1, numPoints = 200) {
    let data = [];

    for (let i = 0; i < numPoints; i++) {
        let x = (i / numPoints) * L;
        let psi = Math.sqrt(2 / L) * Math.sin(n * Math.PI * x / L);
        let probDensity = psi ** 2;

        data.push({ key: x, value: probDensity });
    }

    return data;
}