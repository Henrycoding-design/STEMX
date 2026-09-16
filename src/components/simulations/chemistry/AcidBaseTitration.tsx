import React, { useEffect, useMemo, useState } from "react";
import { Beaker, Droplets, HelpCircle, Pause, Play, RotateCcw } from "lucide-react";
import { simulationsData } from "../../../data/mockData";
import { useSimulationTutorState } from "../../../lib/aiTutor";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";

type Substance = "Strong acid" | "Weak acid" | "Strong base" | "Weak base";
type Indicator = "Phenolphthalein" | "Methyl orange";

const substanceOptions: Substance[] = ["Strong acid", "Weak acid", "Strong base", "Weak base"];

export default function AcidBaseTitration() {
  const simId = "acid-base-titration";
  const simInfo = simulationsData.find(simulation => simulation.id === simId)!;
  const { recordEvent } = useAppProgress();
  const [analyte, setAnalyte] = useState<Substance>("Weak acid");
  const [titrant, setTitrant] = useState<Substance>("Strong base");
  const [indicator, setIndicator] = useState<Indicator>("Phenolphthalein");
  const [volume, setVolume] = useState(0);
  const [flowRate, setFlowRate] = useState(2);
  const [running, setRunning] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const analyteIsAcid = analyte.includes("acid");
  const titrantIsBase = titrant.includes("base");
  const acidBaseMatch = analyteIsAcid === titrantIsBase;
  const equivalenceVolume = 25;
  const pH = calculatePH(volume, analyte, titrant);
  const equivalencePH = analyte === "Weak acid" && titrant === "Strong base" ? 8.7 : analyte === "Strong acid" && titrant === "Weak base" ? 5.3 : 7;
  const indicatorColor = indicator === "Phenolphthalein"
    ? pH >= 8.2 ? "#f472b6" : "#f8fafc"
    : pH <= 3.1 ? "#ef4444" : pH <= 4.4 ? "#f59e0b" : "#facc15";

  useEffect(() => {
    recordEvent({ type: "simulation_started", simulationId: simId, topic: simInfo.topic });
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setVolume(current => {
      const next = Math.min(50, current + flowRate / 5);
      if (next >= 50) setRunning(false);
      return next;
    }), 200);
    return () => window.clearInterval(timer);
  }, [running, flowRate]);

  useSimulationTutorState(simId, {
    analyte,
    titrant,
    indicator,
    titrantVolumeMl: Number(volume.toFixed(1)),
    flowRateMlPerSecond: flowRate,
    pH: Number(pH.toFixed(2)),
    equivalenceVolumeMl: equivalenceVolume,
    equivalencePH: Number(equivalencePH.toFixed(1))
  });

  const curve = useMemo(() => Array.from({ length: 101 }, (_, index) => {
    const pointVolume = index / 2;
    return { volume: pointVolume, pH: calculatePH(pointVolume, analyte, titrant) };
  }), [analyte, titrant]);
  const pointX = (value: number) => 42 + (value / 50) * 300;
  const pointY = (value: number) => 166 - (Math.min(14, Math.max(0, value)) / 14) * 130;

  return (
    <div className="h-full flex flex-col space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div><div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">{simInfo.subject}</span><span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300">{simInfo.difficulty}</span></div><h1 className="text-2xl font-bold text-white mt-1">{simInfo.title}</h1><p className="text-slate-400 text-sm">{simInfo.description}</p></div>
        <button onClick={() => setShowQuiz(true)} className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium text-sm"><HelpCircle className="w-4 h-4 mr-1.5" />Take Quiz</button>
      </header>
      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-5 min-h-[520px]">
          <div className="flex justify-between items-center"><div className="text-xs font-mono text-slate-400">LIVE TITRATION · {volume.toFixed(1)} mL added</div><div className="text-sm font-mono text-white">pH <span className={`text-xl font-bold ${pH < 7 ? "text-rose-400" : "text-emerald-400"}`}>{pH.toFixed(2)}</span></div></div>
          <div className="flex-1 flex items-center justify-center rounded-lg bg-slate-950 relative overflow-hidden min-h-[190px]">
            <div className="absolute top-5 right-1/2 translate-x-1/2 w-16 h-28 border-2 border-slate-400 border-t-0 rounded-b-3xl bg-slate-800/50"><div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-5 bg-slate-300 rounded-full" /><div className="absolute top-6 left-0 right-0 h-1 bg-indigo-400/60" /></div>
            {running && <div className="absolute top-[145px] left-1/2 w-1 h-20 bg-indigo-300 animate-pulse" />}
            {running && <div className="absolute top-[160px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-300 animate-bounce" />}
            <div className="absolute bottom-7 w-64 h-20 border-2 border-slate-400 border-t-0 rounded-b-[45%] overflow-hidden" style={{ background: `linear-gradient(to top, ${indicatorColor}88, ${indicatorColor}22)` }}><div className="absolute top-2 left-8 right-8 border-t border-white/30" /></div>
            <div className="absolute bottom-3 text-[10px] font-mono text-slate-400">ANALYTE + {indicator.toUpperCase()}</div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3"><Metric label="Equivalence volume" value={`${equivalenceVolume} mL`} /><Metric label="Equivalence pH" value={equivalencePH.toFixed(1)} /><Metric label="Indicator state" value={indicatorColor === "#f8fafc" ? "Clear" : "Color change"} /></div>
          <div className="rounded-lg bg-slate-950 border border-slate-800 p-3"><div className="flex justify-between mb-2"><span className="text-xs font-bold text-slate-300">pH curve</span><span className="text-[10px] text-slate-500">pH vs volume of titrant</span></div><svg viewBox="0 0 370 190" className="w-full h-44"><line x1="42" y1="166" x2="342" y2="166" stroke="#475569" /><line x1="42" y1="30" x2="42" y2="166" stroke="#475569" />{[0, 7, 14].map(value => <g key={value}><line x1="42" y1={pointY(value)} x2="342" y2={pointY(value)} stroke="#1e293b" /><text x="17" y={pointY(value) + 4} fill="#64748b" fontSize="10">{value}</text></g>)}<path d={curve.map((point, index) => `${index ? "L" : "M"}${pointX(point.volume)},${pointY(point.pH)}`).join(" ")} fill="none" stroke="#818cf8" strokeWidth="2.5" /><line x1={pointX(equivalenceVolume)} y1="30" x2={pointX(equivalenceVolume)} y2="166" stroke="#22c55e" strokeDasharray="4 4" /><circle cx={pointX(volume)} cy={pointY(pH)} r="5" fill="#f472b6" stroke="#fff" /><text x="140" y="187" fill="#94a3b8" fontSize="10">titrant volume (mL)</text><text x="5" y="23" fill="#94a3b8" fontSize="10">pH</text></svg></div>
        </div>
        <aside className="space-y-6 overflow-y-auto pr-2">
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6"><h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2"><Beaker className="w-4 h-4 text-indigo-400" />Solutions</h3><Select label="Analyte" value={analyte} options={substanceOptions} onChange={value => setAnalyte(value as Substance)} /><Select label="Titrant" value={titrant} options={substanceOptions} onChange={value => setTitrant(value as Substance)} />{!acidBaseMatch && <p className="text-xs text-amber-400 mt-3">Choose an acid and a base for a neutralization titration.</p>}</section>
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6"><h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2"><Droplets className="w-4 h-4 text-sky-400" />Burette controls</h3><div className="mb-5"><div className="flex justify-between mb-1"><label className="text-xs text-slate-400">Flow rate</label><span className="text-xs font-mono text-indigo-400">{flowRate} mL/s</span></div><input type="range" min="1" max="8" value={flowRate} onChange={event => setFlowRate(Number(event.target.value))} className="w-full accent-indigo-500" /></div><div className="flex gap-2"><button onClick={() => setRunning(value => !value)} className="flex-1 inline-flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm">{running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}{running ? "Pause" : "Add titrant"}</button><button onClick={() => { setRunning(false); setVolume(0); }} className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"><RotateCcw className="w-4 h-4" /></button></div><div className="mt-4"><div className="flex justify-between text-xs text-slate-400 mb-1"><span>Titrant volume</span><span>{volume.toFixed(1)} / 50 mL</span></div><input type="range" min="0" max="50" step="0.1" value={volume} onChange={event => setVolume(Number(event.target.value))} className="w-full accent-emerald-500" /></div></section>
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6"><h3 className="font-bold text-slate-100 mb-4">Indicator</h3><div className="grid grid-cols-2 gap-2">{(["Phenolphthalein", "Methyl orange"] as Indicator[]).map(option => <button key={option} onClick={() => setIndicator(option)} className={`px-2 py-2 rounded-lg border text-xs ${indicator === option ? "border-indigo-400 bg-indigo-500/15 text-white" : "border-slate-800 bg-slate-950 text-slate-400"}`}>{option}</button>)}</div><p className="text-xs text-slate-400 mt-4">{indicator} changes near pH {indicator === "Phenolphthalein" ? "8.2–10.0" : "3.1–4.4"}.</p></section>
        </aside>
      </div>
      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}

function calculatePH(volume: number, analyte: Substance, titrant: Substance) {
  const acid = analyte.includes("acid");
  const matching = acid === titrant.includes("base");
  if (!matching) return 7;
  const difference = volume - 25;
  if (Math.abs(difference) < 0.8) return analyte === "Weak acid" ? 8.7 : analyte === "Strong acid" ? 7 : 7.2;
  if (acid) {
    if (volume < 25) return analyte === "Weak acid" ? 3.1 - Math.log10(Math.max(0.2, 1 - volume / 30)) : 1.0 - Math.log10(Math.max(0.2, 1 - volume / 30));
    return titrant === "Weak base" ? 8.8 : 12.3;
  }
  if (volume < 25) return titrant === "Weak acid" ? 5.2 : 1.7;
  return analyte === "Weak base" ? 10.8 : 13.0;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="bg-slate-950 border border-slate-800 rounded-lg p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div><div className="font-mono text-sm text-white mt-1">{value}</div></div>; }
function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="block mb-4"><span className="block text-xs text-slate-400 mb-1">{label}</span><select value={value} onChange={event => onChange(event.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none">{options.map(option => <option key={option}>{option}</option>)}</select></label>; }
