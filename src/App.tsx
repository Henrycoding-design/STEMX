import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import CurriculumExplorer from "./components/curriculum/CurriculumExplorer";
import SimulationHub from "./components/simulations/SimulationHub";
import ProgressDashboard from "./components/progress/ProgressDashboard";
import TheoryNotes from "./components/theory/TheoryNotes";

// Physics Simulation Components
import MeasurementErrorLab from "./components/simulations/physics/MeasurementErrorLab";
import DisplacementTimeLab from "./components/simulations/physics/DisplacementTimeLab";
import VectorVelocityLab from "./components/simulations/physics/VectorVelocityLab";
import PhotogateTimerLab from "./components/simulations/physics/PhotogateTimerLab";
import MotionGraphLab from "./components/simulations/physics/MotionGraphLab";
import FreeFallLab from "./components/simulations/physics/FreeFallLab";
import ProjectileMotion from "./components/simulations/physics/ProjectileMotion";
import NewtonDynamics from "./components/simulations/physics/NewtonDynamics";
import EnergyConservation from "./components/simulations/physics/EnergyConservation";
import MomentumCollision from "./components/simulations/physics/MomentumCollision";
import CircularMotion from "./components/simulations/physics/CircularMotion";
import HookeElasticity from "./components/simulations/physics/HookeElasticity";
import FluidPressureLab from "./components/simulations/physics/FluidPressureLab";
import ElectricCircuit from "./components/simulations/physics/ElectricCircuit";
import WaveInterference from "./components/simulations/physics/WaveInterference";
import OrbitalMechanics from "./components/simulations/physics/OrbitalMechanics";
import PhotoelectricEffect from "./components/simulations/physics/PhotoelectricEffect";

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
            
            {/* Grade 10 Physics Simulation Routes */}
            <Route path="simulations/measurement-error" element={<MeasurementErrorLab />} />
            <Route path="simulations/displacement-time" element={<DisplacementTimeLab />} />
            <Route path="simulations/vector-velocity" element={<VectorVelocityLab />} />
            <Route path="simulations/photogate-mc964" element={<PhotogateTimerLab />} />
            <Route path="simulations/motion-graph" element={<MotionGraphLab />} />
            <Route path="simulations/free-fall" element={<FreeFallLab />} />
            <Route path="simulations/projectile-motion" element={<ProjectileMotion />} />
            <Route path="simulations/newton-dynamics" element={<NewtonDynamics />} />
            <Route path="simulations/energy-conservation" element={<EnergyConservation />} />
            <Route path="simulations/momentum-collision" element={<MomentumCollision />} />
            <Route path="simulations/circular-motion" element={<CircularMotion />} />
            <Route path="simulations/hooke-elasticity" element={<HookeElasticity />} />
            <Route path="simulations/fluid-pressure" element={<FluidPressureLab />} />
            <Route path="simulations/electric-circuit" element={<ElectricCircuit />} />
            <Route path="simulations/wave-interference" element={<WaveInterference />} />
            <Route path="simulations/orbital-mechanics" element={<OrbitalMechanics />} />
            <Route path="simulations/photoelectric-effect" element={<PhotoelectricEffect />} />

            <Route path="progress" element={<ProgressDashboard />} />
            <Route path="theory" element={<TheoryNotes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
