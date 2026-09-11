import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import CurriculumExplorer from "./components/curriculum/CurriculumExplorer";
import SimulationHub from "./components/simulations/SimulationHub";
import ProgressDashboard from "./components/progress/ProgressDashboard";
import ProjectileMotion from "./components/simulations/physics/ProjectileMotion";
import WaveInterference from "./components/simulations/physics/WaveInterference";
import FunctionExplorer from "./components/simulations/mathematics/FunctionExplorer";
import EquilibriumLab from "./components/simulations/chemistry/EquilibriumLab";
import ElectricCircuit from "./components/simulations/physics/ElectricCircuit";
import OrbitalMechanics from "./components/simulations/physics/OrbitalMechanics";
import ReactionKinetics from "./components/simulations/chemistry/ReactionKinetics";
import CalculusMotion from "./components/simulations/mathematics/CalculusMotion";

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
            <Route path="simulations/wave-interference" element={<WaveInterference />} />
            <Route path="simulations/function-explorer" element={<FunctionExplorer />} />
            <Route path="simulations/chemical-equilibrium" element={<EquilibriumLab />} />
            <Route path="simulations/electric-circuit" element={<ElectricCircuit />} />
            <Route path="simulations/orbital-mechanics" element={<OrbitalMechanics />} />
            <Route path="simulations/reaction-kinetics" element={<ReactionKinetics />} />
            <Route path="simulations/calculus-motion" element={<CalculusMotion />} />
            <Route path="progress" element={<ProgressDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
