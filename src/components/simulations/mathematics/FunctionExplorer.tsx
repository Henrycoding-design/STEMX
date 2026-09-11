import React, { useState } from "react";
import { simulationsData } from "../../../data/mockData";
import QuizPanel from "../../quiz/QuizPanel";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";

export default function FunctionExplorer() {
  const simId = "function-explorer";
  const simInfo = simulationsData.find(s => s.id === simId)!;

  const [funcType, setFuncType] = useState<"Linear" | "Quadratic" | "Trigonometric">("Quadratic");
  
  // Linear: y = mx + c
  const [m, setM] = useState(1);
  const [c, setC] = useState(0);
  
  // Quadratic: y = ax^2 + bx + k
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [k, setK] = useState(0);
  
  // Trig: y = A sin(Bx)
  const [amp, setAmp] = useState(1);
  const [freq, setFreq] = useState(1);

  const [showQuiz, setShowQuiz] = useState(false);

  // Generate Data
  const data = [];
  for (let x = -10; x <= 10; x += 0.5) {
    let y = 0;
    if (funcType === "Linear") y = m * x + c;
    if (funcType === "Quadratic") y = a * x * x + b * x + k;
    if (funcType === "Trigonometric") y = amp * Math.sin(freq * x);
    
    // Clamp y for graphing aesthetics
    if (y > 20) y = 20;
    if (y < -20) y = -20;
    
    data.push({ x, y });
  }

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

      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        {["Linear", "Quadratic", "Trigonometric"].map(type => (
          <button
            key={type}
            onClick={() => setFuncType(type as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${funcType === type ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"}`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
          
          <div className="text-center py-4 text-xl font-mono text-indigo-400 bg-slate-950 rounded-lg mb-4 border border-slate-800">
            {funcType === "Linear" && `y = ${m}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`}
            {funcType === "Quadratic" && `y = ${a}x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${k >= 0 ? '+' : '-'} ${Math.abs(k)}`}
            {funcType === "Trigonometric" && `y = ${amp} sin(${freq}x)`}
          </div>

          <div className="flex-1 w-full relative min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="x" stroke="#94a3b8" type="number" domain={[-10, 10]} ticks={[-10, -5, 0, 5, 10]} />
                <YAxis stroke="#94a3b8" domain={[-15, 15]} />
                <ReferenceLine x={0} stroke="#cbd5e1" />
                <ReferenceLine y={0} stroke="#cbd5e1" />
                <Line type="monotone" dataKey="y" stroke="#818cf8" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto pr-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-6">Coefficients</h3>
            
            <div className="space-y-6">
              {funcType === "Linear" && (
                <>
                  <div>
                    <div className="flex justify-between mb-1"><label className="text-sm text-slate-400">Slope (m)</label><span className="text-indigo-400">{m}</span></div>
                    <input type="range" min="-5" max="5" step="0.5" value={m} onChange={(e) => setM(Number(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><label className="text-sm text-slate-400">Intercept (c)</label><span className="text-indigo-400">{c}</span></div>
                    <input type="range" min="-10" max="10" step="1" value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
                </>
              )}

              {funcType === "Quadratic" && (
                <>
                  <div>
                    <div className="flex justify-between mb-1"><label className="text-sm text-slate-400">a (Curve direction/width)</label><span className="text-indigo-400">{a}</span></div>
                    <input type="range" min="-3" max="3" step="0.1" value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><label className="text-sm text-slate-400">b (Shift)</label><span className="text-indigo-400">{b}</span></div>
                    <input type="range" min="-5" max="5" step="1" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><label className="text-sm text-slate-400">c (Y-Intercept)</label><span className="text-indigo-400">{k}</span></div>
                    <input type="range" min="-10" max="10" step="1" value={k} onChange={(e) => setK(Number(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
                </>
              )}

              {funcType === "Trigonometric" && (
                <>
                  <div>
                    <div className="flex justify-between mb-1"><label className="text-sm text-slate-400">Amplitude (A)</label><span className="text-indigo-400">{amp}</span></div>
                    <input type="range" min="1" max="10" step="1" value={amp} onChange={(e) => setAmp(Number(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><label className="text-sm text-slate-400">Frequency (B)</label><span className="text-indigo-400">{freq}</span></div>
                    <input type="range" min="0.1" max="5" step="0.1" value={freq} onChange={(e) => setFreq(Number(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
