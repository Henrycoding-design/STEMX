import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import CurriculumExplorer from "./components/curriculum/CurriculumExplorer";
import SimulationHub from "./components/simulations/SimulationHub";
import ProgressDashboard from "./components/progress/ProgressDashboard";
import TheoryNotes from "./components/theory/TheoryNotes";
import ProjectileMotion from "./components/simulations/physics/ProjectileMotion";
import NewtonDynamics from "./components/simulations/physics/NewtonDynamics";
import EnergyConservation from "./components/simulations/physics/EnergyConservation";
import MomentumCollision from "./components/simulations/physics/MomentumCollision";
import CircularMotion from "./components/simulations/physics/CircularMotion";
import HookeElasticity from "./components/simulations/physics/HookeElasticity";
import ElectricCircuit from "./components/simulations/physics/ElectricCircuit";
import WaveInterference from "./components/simulations/physics/WaveInterference";
import OrbitalMechanics from "./components/simulations/physics/OrbitalMechanics";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="curriculum" element={<CurriculumExplorer />} />
            <Route path="simulations" element={<SimulationHub />} />
            <Route path="simulations/projectile-motion" element={<ProjectileMotion />} />
            <Route path="simulations/newton-dynamics" element={<NewtonDynamics />} />
            <Route path="simulations/energy-conservation" element={<EnergyConservation />} />
            <Route path="simulations/momentum-collision" element={<MomentumCollision />} />
            <Route path="simulations/circular-motion" element={<CircularMotion />} />
            <Route path="simulations/hooke-elasticity" element={<HookeElasticity />} />
            <Route path="simulations/electric-circuit" element={<ElectricCircuit />} />
            <Route path="simulations/wave-interference" element={<WaveInterference />} />
            <Route path="simulations/orbital-mechanics" element={<OrbitalMechanics />} />
            <Route path="progress" element={<ProgressDashboard />} />
            <Route path="theory" element={<TheoryNotes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
