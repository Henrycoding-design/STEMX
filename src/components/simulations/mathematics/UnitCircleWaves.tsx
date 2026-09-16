import React, { useEffect, useMemo, useState } from "react";
import { Circle, HelpCircle, RotateCcw } from "lucide-react";
import { simulationsData } from "../../../data/mockData";
import { useSimulationTutorState } from "../../../lib/aiTutor";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";

export default function UnitCircleWaves() {
  const simId = "unit-circle-waves";
  const simInfo = simulationsData.find(simulation => simulation.id === simId)!;
  const { recordEvent } = useAppProgress();
  const [angle, setAngle] = useState(45);
  const [showQuiz, setShowQuiz] = useState(false);
  const radians = angle * Math.PI / 180;
  const sine = Math.sin(radians);
  const cosine = Math.cos(radians);
  const tangent = Math.abs(cosine) < 0.05 ? "undefined" : Math.tan(radians).toFixed(2);

  useEffect(() => {
    recordEvent({ type: "simulation_started", simulationId: simId, topic: simInfo.topic });
  }, []);

  useSimulationTutorState(simId, {
    angleDegrees: angle,
    angleRadians: Number(radians.toFixed(3)),
    sine: Number(sine.toFixed(3)),
    cosine: Number(cosine.toFixed(3)),
    tangent: tangent === "undefined" ? tangent : Number(tangent)
  });

  const circlePoint = (coordinate: number) => 150 + coordinate * 105;
  const wavePath = (kind: "sin" | "cos" | "tan") => Array.from({ length: 121 }, (_, index) => {
    const xValue = index / 120 * Math.PI * 2;
    const value = kind === "sin" ? Math.sin(xValue) : kind === "cos" ? Math.cos(xValue) : Math.max(-1.2, Math.min(1.2, Math.tan(xValue)));
    const x = 42 + index / 120 * 310;
    const y = 100 - value * 58;
    return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const waveX = 42 + angle / 360 * 310;

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"><div><div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">{simInfo.subject}</span><span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300">{simInfo.difficulty}</span></div><h1 className="text-2xl font-bold text-white mt-1">{simInfo.title}</h1><p className="text-slate-400 text-sm">{simInfo.description}</p></div><button onClick={() => setShowQuiz(true)} className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium text-sm"><HelpCircle className="w-4 h-4 mr-1.5" />Take Quiz</button></header>
      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-5 min-h-[520px]">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400"><span>θ = {angle}° = {radians.toFixed(3)} rad</span><span className="text-indigo-300">x = cos θ · y = sin θ</span></div>
          <div className="grid md:grid-cols-2 gap-4 flex-1">
            <div className="rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center relative"><svg viewBox="0 0 300 300" className="w-full max-w-[330px]" aria-label="Unit circle"><circle cx="150" cy="150" r="105" fill="none" stroke="#475569" strokeWidth="2" /><line x1="25" y1="150" x2="275" y2="150" stroke="#334155" /><line x1="150" y1="25" x2="150" y2="275" stroke="#334155" /><line x1="150" y1="150" x2={circlePoint(cosine)} y2={circlePoint(-sine)} stroke="#818cf8" strokeWidth="2" strokeDasharray="5 4" /><line x1={circlePoint(cosine)} y1={circlePoint(-sine)} x2={circlePoint(cosine)} y2="150" stroke="#22c55e" strokeDasharray="4 4" /><line x1="150" y1="150" x2={circlePoint(cosine)} y2="150" stroke="#f472b6" strokeDasharray="4 4" /><path d={`M ${150 + 35} 150 A 35 35 0 ${angle > 180 ? 1 : 0} 0 ${circlePoint(cosine)} ${circlePoint(-sine)}`} fill="none" stroke="#facc15" strokeWidth="2" /><circle cx={circlePoint(cosine)} cy={circlePoint(-sine)} r="7" fill="#22c55e" stroke="#dcfce7" strokeWidth="2" /><text x="162" y="40" fill="#94a3b8" fontSize="11">y</text><text x="260" y="143" fill="#94a3b8" fontSize="11">x</text><text x="163" y="142" fill="#facc15" fontSize="11">θ</text><text x="174" y="185" fill="#f472b6" fontSize="11">cos θ</text><text x="155" y="73" fill="#22c55e" fontSize="11">sin θ</text></svg><div className="absolute bottom-3 text-[10px] text-slate-500">UNIT CIRCLE · r = 1</div></div>
            <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 flex flex-col"><div className="flex gap-3 text-[10px] mb-2"><span className="text-emerald-400">● sin θ</span><span className="text-pink-400">● cos θ</span><span className="text-amber-300">● tan θ</span></div><svg viewBox="0 0 370 210" className="w-full flex-1" aria-label="Trigonometric waves"><line x1="42" y1="100" x2="352" y2="100" stroke="#475569" /><line x1="42" y1="42" x2="42" y2="158" stroke="#475569" /><line x1="197" y1="35" x2="197" y2="165" stroke="#1e293b" strokeDasharray="3 3" /><path d={wavePath("sin")} fill="none" stroke="#22c55e" strokeWidth="2" /><path d={wavePath("cos")} fill="none" stroke="#f472b6" strokeWidth="2" /><path d={wavePath("tan")} fill="none" stroke="#facc15" strokeWidth="1.5" opacity=".8" /><line x1={waveX} y1="30" x2={waveX} y2="170" stroke="#818cf8" strokeDasharray="4 4" /><circle cx={waveX} cy={100 - sine * 58} r="5" fill="#22c55e" /><circle cx={waveX} cy={100 - cosine * 58} r="5" fill="#f472b6" /><text x="35" y="184" fill="#64748b" fontSize="10">0</text><text x="187" y="184" fill="#64748b" fontSize="10">π</text><text x="337" y="184" fill="#64748b" fontSize="10">2π</text><text x="144" y="205" fill="#94a3b8" fontSize="10">angle θ (radians)</text></svg><div className="text-center text-[10px] text-slate-500">Projection lines connect the circle point to wave coordinates.</div></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3"><Metric label="sin θ" value={sine.toFixed(3)} color="text-emerald-400" /><Metric label="cos θ" value={cosine.toFixed(3)} color="text-pink-400" /><Metric label="tan θ" value={tangent} color="text-amber-300" /></div>
        </div>
        <aside className="space-y-6 overflow-y-auto pr-2"><section className="bg-slate-900 border border-slate-800 rounded-xl p-6"><h3 className="font-bold text-slate-100 mb-5 flex items-center gap-2"><Circle className="w-4 h-4 text-indigo-400" />Angle control</h3><div className="flex justify-between mb-1"><label className="text-xs text-slate-400">θ in degrees</label><span className="text-xs font-mono text-indigo-400">{angle}°</span></div><input type="range" min="0" max="360" value={angle} onChange={event => setAngle(Number(event.target.value))} className="w-full accent-indigo-500" /><div className="flex justify-between text-[10px] text-slate-500 mt-1"><span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>360°</span></div><div className="mt-5 rounded-lg bg-slate-950 border border-slate-800 p-3 text-center"><div className="text-xs text-slate-500">Radians</div><div className="font-mono text-xl text-white mt-1">{radians.toFixed(3)} rad</div></div></section><section className="bg-slate-900 border border-slate-800 rounded-xl p-6"><h3 className="font-bold text-slate-100 mb-4">Coordinate readout</h3><div className="space-y-3 font-mono text-sm"><div className="flex justify-between"><span className="text-slate-400">x = cos θ</span><span className="text-pink-400">{cosine.toFixed(3)}</span></div><div className="flex justify-between"><span className="text-slate-400">y = sin θ</span><span className="text-emerald-400">{sine.toFixed(3)}</span></div><div className="flex justify-between"><span className="text-slate-400">tan θ</span><span className="text-amber-300">{tangent}</span></div></div><button onClick={() => setAngle(45)} className="mt-5 inline-flex items-center text-xs text-slate-400 hover:text-white"><RotateCcw className="w-3 h-3 mr-1" />Reset to 45°</button></section><section className="bg-slate-900 border border-slate-800 rounded-xl p-6"><h3 className="font-bold text-slate-100 mb-3">Key relationship</h3><p className="font-mono text-indigo-300 text-sm">sin²θ + cos²θ = 1</p><p className="text-xs text-slate-400 mt-3">The point always remains on a circle of radius 1, so its coordinates satisfy the fundamental Pythagorean identity.</p></section></aside>
      </div>
      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) { return <div className="bg-slate-950 border border-slate-800 rounded-lg p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div><div className={`font-mono text-sm mt-1 ${color}`}>{value}</div></div>; }
