import React, { useEffect, useMemo, useState } from "react";
import { Atom, HelpCircle, RotateCcw, Zap } from "lucide-react";
import { simulationsData } from "../../../data/mockData";
import { useSimulationTutorState } from "../../../lib/aiTutor";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import SimulationVideoButton from "../SimulationVideoButton";

const metals = {
  Sodium: { workFunction: 2.28, color: "#fbbf24" },
  Potassium: { workFunction: 2.30, color: "#a78bfa" },
  Copper: { workFunction: 4.65, color: "#f97316" },
  Platinum: { workFunction: 5.65, color: "#cbd5e1" }
};

type Metal = keyof typeof metals;

export default function PhotoelectricEffect() {
  const simId = "photoelectric-effect";
  const simInfo = simulationsData.find(simulation => simulation.id === simId)!;
  const { recordEvent, language } = useAppProgress();
  const isVN = language === "VN";
  const [wavelength, setWavelength] = useState(450);
  const [intensity, setIntensity] = useState(65);
  const [metal, setMetal] = useState<Metal>("Sodium");
  const [appliedVoltage, setAppliedVoltage] = useState(0);
  const [time, setTime] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const frequency = 299792458 / (wavelength * 1e-9);
  const frequencyTHz = frequency / 1e12;
  const photonEnergy = 1239.84 / wavelength;
  const workFunction = metals[metal].workFunction;
  const kineticEnergy = Math.max(0, photonEnergy - workFunction);
  const stoppingPotential = kineticEnergy;
  const thresholdWavelength = 1239.84 / workFunction;
  const emitted = kineticEnergy > 0;
  const collectorReached = !emitted || appliedVoltage > -stoppingPotential;
  const photocurrent = emitted && collectorReached ? intensity * 0.8 : 0;

  useEffect(() => {
    recordEvent({ type: "simulation_started", simulationId: simId, topic: simInfo.topic });
  }, []);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const animate = (now: number) => {
      setTime(value => value + Math.min(0.05, (now - last) / 1000));
      last = now;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useSimulationTutorState(simId, {
    wavelengthNm: wavelength,
    frequencyTHz: Number(frequencyTHz.toFixed(2)),
    intensityPercent: intensity,
    metal,
    workFunctionEv: workFunction,
    stoppingPotentialV: Number(stoppingPotential.toFixed(3)),
    appliedVoltageV: appliedVoltage,
    photocurrentMicroAmps: Number(photocurrent.toFixed(2)),
    electronsEmitted: emitted
  });

  const chartMinFrequency = 400;
  const chartMaxFrequency = 1200;
  const points = useMemo(() => [
    { frequency: 400, potential: Math.max(0, 0.004136 * 400 - workFunction) },
    { frequency: 600, potential: Math.max(0, 0.004136 * 600 - workFunction) },
    { frequency: 800, potential: Math.max(0, 0.004136 * 800 - workFunction) },
    { frequency: 1000, potential: Math.max(0, 0.004136 * 1000 - workFunction) },
    { frequency: 1200, potential: Math.max(0, 0.004136 * 1200 - workFunction) }
  ], [workFunction]);
  const maxPotential = Math.max(1, ...points.map(point => point.potential), stoppingPotential);
  const estimatedH = emitted ? (stoppingPotential + workFunction) / frequencyTHz : 0;
  const chartX = (value: number) => 42 + ((value - chartMinFrequency) / (chartMaxFrequency - chartMinFrequency)) * 300;
  const chartY = (value: number) => 166 - (value / maxPotential) * 125;
  const electronPositions = emitted
    ? getElectronPositions(time, intensity, appliedVoltage, stoppingPotential)
    : [];

  return (
    <div className="simulation-page h-full flex flex-col space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{simInfo.subject}</span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300">{simInfo.difficulty}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">{isVN ? simInfo.title : simInfo.titleEn}</h1>
          <p className="text-slate-400 text-sm">{isVN ? simInfo.description : simInfo.descriptionEn}</p>
          <div className="mt-3">
            <SimulationVideoButton href="https://www.youtube.com/watch?v=5gMNyahBaT8" />
          </div>
        </div>
        <button onClick={() => setShowQuiz(true)} className="w-fit inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium text-sm"><HelpCircle className="w-4 h-4 mr-1.5" />{isVN ? "Kiểm tra kiến thức" : "Take Quiz"}</button>
      </header>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 min-h-[520px]">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />{isVN ? "Chùm photon" : "Photon stream"}</span>
            <span className={emitted ? "text-emerald-400" : "text-rose-400"}>{emitted ? (isVN ? "ĐÃ BỨT ELECTRON" : "PHOTOELECTRONS EMITTED") : (isVN ? "DƯỚI NGƯỠNG QUANG ĐIỆN" : "BELOW THRESHOLD")}</span>
          </div>
          <svg viewBox="0 0 760 270" className="w-full flex-1 min-h-[250px] rounded-lg bg-slate-950" role="img" aria-label="Photoelectric effect visualization">
            <defs><linearGradient id="metalSurface" x1="0" x2="1"><stop stopColor="#334155" /><stop offset="1" stopColor={metals[metal].color} stopOpacity=".65" /></linearGradient></defs>
            <rect width="760" height="270" fill="#020617" />
            <rect x="0" y="0" width="760" height="18" fill="#475569" />
            <text x="24" y="13" fill="#e2e8f0" fontSize="12" fontFamily="monospace">COLLECTOR PLATE · Vₐₚₚ = {appliedVoltage.toFixed(1)} V</text>
            <rect x="0" y="210" width="760" height="60" fill="url(#metalSurface)" />
            <text x="24" y="244" fill="#cbd5e1" fontSize="13" fontFamily="monospace">{metal} target · W₀ = {workFunction.toFixed(2)} eV</text>
            {Array.from({ length: 12 }).map((_, index) => {
              const x = ((index * 76 + time * 130) % 850) - 80;
              return <g key={index} opacity={emitted ? 1 : .45}>
                <line x1={x} y1="28" x2={x + 34} y2="28" stroke="#fde047" strokeWidth="3" />
                <circle cx={x + 38} cy="28" r="4" fill="#fde047" />
              </g>;
            })}
            {electronPositions.map((particle, index) => <g key={index}>
              <line x1={particle.originX} y1="208" x2={particle.x} y2={particle.y} stroke="#22c55e" strokeWidth="2" opacity=".35" />
              <circle cx={particle.x} cy={particle.y} r="4" fill="#22c55e" />
            </g>)}
            <text x="24" y="52" fill="#fde047" fontSize="12" fontFamily="monospace">hν = {photonEnergy.toFixed(2)} eV</text>
            <text x="510" y="60" fill="#86efac" fontSize="12" fontFamily="monospace">e⁻ → Kₘₐₓ {kineticEnergy.toFixed(2)} eV</text>
          </svg>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <Metric label={isVN ? "Tần số" : "Frequency"} value={`${frequencyTHz.toFixed(1)} THz`} />
            <Metric label={isVN ? "Điện thế hãm" : "Stopping potential"} value={`${stoppingPotential.toFixed(2)} V`} />
            <Metric label={isVN ? "Bước sóng giới hạn" : "Threshold wavelength"} value={`${thresholdWavelength.toFixed(0)} nm`} />
            <Metric label={isVN ? "Dòng quang điện" : "Photocurrent"} value={`${photocurrent.toFixed(2)} μA`} />
          </div>

          <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
            <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-slate-300">{isVN ? "Điện thế hãm Vₛ theo tần số f" : "Stopping Potential Vₛ vs Frequency f"}</span><span className="text-[10px] text-emerald-400">{isVN ? "hệ số góc ≈ h/e" : "slope ≈ h/e"}</span></div>
            <svg viewBox="0 0 370 190" className="w-full h-44">
              <line x1="42" y1="166" x2="342" y2="166" stroke="#475569" /><line x1="42" y1="30" x2="42" y2="166" stroke="#475569" />
              {[0, 1, 2, 3].map(value => <g key={value}><line x1="42" y1={166 - value * 42} x2="342" y2={166 - value * 42} stroke="#1e293b" /><text x="5" y={170 - value * 42} fill="#64748b" fontSize="12">{(maxPotential * value / 3).toFixed(1)}</text></g>)}
              {points.map(point => <circle key={point.frequency} cx={chartX(point.frequency)} cy={chartY(point.potential)} r="4" fill="#818cf8" />)}
              {emitted && <circle cx={chartX(frequencyTHz)} cy={chartY(stoppingPotential)} r="5" fill="#22c55e" stroke="#bbf7d0" />}
              <text x="145" y="187" fill="#94a3b8" fontSize="12">frequency (THz)</text><text x="5" y="23" fill="#94a3b8" fontSize="12">Vₛ (V)</text>
            </svg>
            <p className="text-[11px] text-slate-400">{isVN ? "Ước lượng thực nghiệm" : "Experimental estimate"}: <span className="text-emerald-400 font-mono">h = {estimatedH ? `${estimatedH.toFixed(4)} eV/THz` : "—"}</span> ({isVN ? "giá trị chuẩn" : "accepted value"}: 0.00414 eV/THz)</p>
          </div>
        </div>

        <aside className="space-y-6 overflow-y-auto pr-2">
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-5 flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-300" />{isVN ? "Nguồn sáng" : "Light source"}</h3>
            <Slider label={isVN ? "Bước sóng" : "Wavelength"} value={`${wavelength} nm`} min={250} max={750} valueNumber={wavelength} onChange={setWavelength} />
            <Slider label={isVN ? "Cường độ" : "Intensity"} value={`${intensity}%`} min={10} max={100} valueNumber={intensity} onChange={setIntensity} />
            <p className="text-[11px] text-slate-500 mt-3">{isVN ? "Tần số thay đổi năng lượng electron; cường độ thay đổi tốc độ phát xạ." : "Frequency changes electron energy; intensity changes the emission rate."}</p>
          </section>
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2"><Atom className="w-4 h-4 text-indigo-400" />{isVN ? "Kim loại mục tiêu" : "Target metal"}</h3>
            <div className="grid grid-cols-2 gap-2">{(Object.keys(metals) as Metal[]).map(option => <button key={option} onClick={() => setMetal(option)} className={`px-3 py-2 rounded-lg border text-sm transition-colors ${metal === option ? "border-indigo-400 bg-indigo-500/15 text-white" : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"}`}>{option}</button>)}</div>
            <div className="mt-5 flex justify-between text-xs"><span className="text-slate-400">{isVN ? "Công thoát" : "Work function"}</span><span className="font-mono text-indigo-300">{workFunction.toFixed(2)} eV</span></div>
          </section>
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-5">{isVN ? "Mạch điện thế hãm" : "Retarding circuit"}</h3>
            <Slider label={isVN ? "Điện áp đặt vào" : "Applied Voltage"} value={`${appliedVoltage.toFixed(1)} V`} min={-5} max={5} step={0.1} valueNumber={appliedVoltage} onChange={setAppliedVoltage} />
            <div className="flex justify-between text-xs"><span className="text-slate-400">{isVN ? "Dòng quang điện" : "Photocurrent"}</span><span className={photocurrent > 0 ? "text-emerald-400 font-mono" : "text-rose-400 font-mono"}>{photocurrent.toFixed(2)} μA</span></div>
            <p className="text-[11px] text-slate-500 mt-3">{isVN ? "Khi Vₐₚₚ ≤ −Vₛ, electron quay ngược trước khi đến cực góp." : "At Vₐₚₚ ≤ −Vₛ, electrons reverse before reaching the collector."}</p>
          </section>
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-3">{isVN ? "Phương trình Einstein" : "Einstein’s equation"}</h3>
            <p className="font-mono text-indigo-300 text-sm">Kₘₐₓ = hf − W₀</p>
            <p className="text-xs text-slate-400 mt-3">{isVN ? "Ngưỡng: λ₀" : "Threshold: λ₀"} = {thresholdWavelength.toFixed(0)} nm. {emitted ? (isVN ? "Photon có năng lượng vượt công thoát." : "Photons exceed the work function.") : (isVN ? "Tăng tần số để bứt electron." : "Increase frequency to eject electrons.")}</p>
            <button onClick={() => { setWavelength(450); setIntensity(65); setMetal("Sodium"); setAppliedVoltage(0); }} className="mt-4 inline-flex items-center text-xs text-slate-400 hover:text-white"><RotateCcw className="w-3 h-3 mr-1" />{isVN ? "Đặt lại thí nghiệm" : "Reset experiment"}</button>
          </section>
        </aside>
      </div>
      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="bg-slate-950 border border-slate-800 rounded-lg p-3"><div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div><div className="font-mono text-sm text-white mt-1">{value}</div></div>;
}

function Slider({ label, value, min, max, step = 1, valueNumber, onChange }: { label: string; value: string; min: number; max: number; step?: number; valueNumber: number; onChange: (value: number) => void }) {
  return <div className="mb-5"><div className="flex justify-between mb-1"><label className="text-xs font-medium text-slate-400">{label}</label><span className="text-xs font-mono text-indigo-400">{value}</span></div><input type="range" min={min} max={max} step={step} value={valueNumber} onChange={event => onChange(Number(event.target.value))} className="w-full accent-indigo-500" /></div>;
}

function getElectronPositions(time: number, intensity: number, appliedVoltage: number, stoppingPotential: number) {
  const travelDistance = 175;
  const initialSpeed = 135;
  const count = Math.max(3, Math.round(intensity / 10));
  const positions: { originX: number; x: number; y: number }[] = [];
  const ratio = stoppingPotential > 0 ? Math.abs(appliedVoltage) / stoppingPotential : 0;
  const strongRetardingField = appliedVoltage < 0 && ratio >= 1;
  const acceleration = strongRetardingField
    ? (initialSpeed * initialSpeed / (2 * travelDistance)) * Math.max(1.15, ratio)
    : 0;

  for (let index = 0; index < count; index += 1) {
    const originX = 90 + (index * 47) % 560;
    const phase = (time * 0.9 + index * 0.28) % (strongRetardingField ? (2 * initialSpeed / acceleration) : 1.55);
    let distance: number;

    if (!strongRetardingField) {
      distance = appliedVoltage < 0 && stoppingPotential > 0
        ? Math.min(travelDistance, initialSpeed * phase - 0.5 * (initialSpeed * initialSpeed / (2 * travelDistance)) * ratio * phase * phase)
        : Math.min(travelDistance, initialSpeed * phase);
    } else {
      const stoppingTime = initialSpeed / acceleration;
      distance = phase <= stoppingTime
        ? initialSpeed * phase - 0.5 * acceleration * phase * phase
        : travelDistance * 0.96 - 0.5 * acceleration * (phase - stoppingTime) ** 2;
      distance = Math.max(0, distance);
    }

    positions.push({ originX, x: originX + Math.sin(index) * 7, y: 208 - distance });
  }
  return positions;
}
