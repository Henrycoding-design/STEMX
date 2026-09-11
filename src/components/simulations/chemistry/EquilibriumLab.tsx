import React, { useState } from "react";
import { simulationsData } from "../../../data/mockData";
import QuizPanel from "../../quiz/QuizPanel";

export default function EquilibriumLab() {
  const simId = "chemical-equilibrium";
  const simInfo = simulationsData.find(s => s.id === simId)!;

  const [temp, setTemp] = useState(298); // Kelvin
  const [pressure, setPressure] = useState(1); // atm
  
  // A conceptual reaction: N2 + 3H2 ⇌ 2NH3 (Exothermic)
  // Let's simplify to A ⇌ B (Exothermic, less moles on right)
  
  // Base equilibrium constant at 298K
  const baseK = 1.0; 
  
  // Calculate Shift based on Le Chatelier
  // Temp increase -> shifts left (endothermic direction)
  // Pressure increase -> shifts right (fewer moles)
  
  const tempFactor = (298 - temp) * 0.01; 
  const pressureFactor = (pressure - 1) * 0.5;
  
  // Pseudo concentration ratio [B]/[A]
  const equilibriumPosition = baseK + tempFactor + pressureFactor;
  
  // Bound the visual ratio between 0 and 1
  const ratioB = Math.max(0.1, Math.min(0.9, 0.5 + equilibriumPosition * 0.2));
  const ratioA = 1 - ratioB;

  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{simInfo.title}</h1>
          <p className="text-slate-400 text-sm">{simInfo.description}</p>
        </div>
        <button 
          onClick={() => setShowQuiz(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          Take Quiz
        </button>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          
          <h2 className="text-3xl font-bold text-white mb-12 flex items-center space-x-6 tracking-wider">
            <span className="text-blue-400">A</span>
            <span className="text-slate-500 text-4xl">⇌</span>
            <span className="text-rose-400">B</span>
          </h2>
          
          <div className="text-xs text-slate-500 mb-8 uppercase tracking-widest font-semibold">Exothermic Reaction (ΔH &lt; 0)</div>

          {/* Visual Beaker/Chamber */}
          <div className="w-64 h-64 border-4 border-slate-700 rounded-b-3xl rounded-t-lg relative overflow-hidden bg-slate-950 flex flex-col justify-end shadow-[0_0_50px_rgba(0,0,0,0.5)_inset]">
            {/* Mixture gradient based on ratio */}
            <div 
              className="w-full transition-all duration-1000 ease-in-out relative"
              style={{ 
                height: '80%',
                background: `linear-gradient(to top, rgba(59, 130, 246, ${ratioA}), rgba(244, 63, 94, ${ratioB}))`
              }}
            >
              {/* Particles */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,_#fff_1px,_transparent_1px)] bg-[size:10px_10px] animate-[pulse_4s_ease-in-out_infinite]" />
            </div>
            
            <div className="absolute bottom-4 w-full flex justify-around px-4">
               <div className="text-center font-mono">
                 <div className="text-blue-400 font-bold">{(ratioA * 100).toFixed(0)}%</div>
                 <div className="text-[10px] text-slate-500 uppercase">Reactant A</div>
               </div>
               <div className="text-center font-mono">
                 <div className="text-rose-400 font-bold">{(ratioB * 100).toFixed(0)}%</div>
                 <div className="text-[10px] text-slate-500 uppercase">Product B</div>
               </div>
            </div>
          </div>
          
          <div className="mt-12 text-center max-w-md">
             <div className="text-sm text-slate-400">
               {ratioB > 0.6 ? "Equilibrium shifted Right (Products favored)" : 
                ratioA > 0.6 ? "Equilibrium shifted Left (Reactants favored)" : 
                "Dynamic equilibrium balanced"}
             </div>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto pr-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-6">Environmental Controls</h3>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-400">Temperature</label>
                  <span className="text-sm font-mono text-amber-400">{temp} K</span>
                </div>
                <input type="range" min="200" max="600" value={temp} onChange={(e) => setTemp(Number(e.target.value))} className="w-full accent-amber-500" />
                <p className="text-xs text-slate-500 mt-2">Increasing temp shifts exo reactions left.</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-400">Pressure</label>
                  <span className="text-sm font-mono text-emerald-400">{pressure.toFixed(1)} atm</span>
                </div>
                <input type="range" min="0.5" max="5" step="0.1" value={pressure} onChange={(e) => setPressure(Number(e.target.value))} className="w-full accent-emerald-500" />
                <p className="text-xs text-slate-500 mt-2">Increasing pressure shifts to side with fewer moles.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-2">Le Chatelier's Principle</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              When a system at equilibrium is subjected to change in concentration, temperature, volume, or pressure, then the system readjusts itself to counteract the effect of the applied change and a new equilibrium is established.
            </p>
          </div>
        </div>
      </div>
      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
