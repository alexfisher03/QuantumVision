import numpy as np

class InfinitePotentialWell:
    hbar = 1.0545718e-34 #Joules * seconds

    def __init__(self, m, L, n):
        self.mass = m 
        self.boundary_length = L
        self.energy_levels = []
        self.x_values = np.linspace(0, self.boundary_length, 1000)

        def setEnergy(self, n):
            return (n**2 * np.pi**2 * self.hbar**2) / (2 * self.mass * self.boundary_length**2)

        for i in range(1, n+1):
            self.energy_levels.append(setEnergy(i))

    def getEnergyLevels(self):
        return self.energy_levels
    
    def computePsi(self, n):
        psi = np.sqrt(2 / self.boundary_length) * np.sin(n * np.pi * self.x_values / self.boundary_length)
        return psi