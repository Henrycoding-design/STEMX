import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import { Play, Pause, RotateCcw, Flame, Sparkles, HelpCircle } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "A" | "B" | "Product";
}

export default function ReactionKinetics() {
  const simId = "reaction-kinetics";
  const simInfo = simulationsData.find(s => s.id === simId)!;
  const { recordEvent } = useAppProgress();

  const [temperature, setTemperature] = useState(320); // Kelvin
  const [concentration, setConcentration] = useState(1.5); // M
  const [hasCatalyst, setHasCatalyst] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [reactedCount, setReactedCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const reqRef = useRef<number>();

  useEffect(() => {
    recordEvent({ type: "simulation_started", simulationId: simId, topic: simInfo.topic });
  }, []);

  // Chemical Kinetics Constants
  const R = 8.314; // J/(mol*K)
  const baseEa = 45000; // 45 kJ/mol
  const activeEa = hasCatalyst ? 24000 : baseEa; // 24 kJ/mol with catalyst
  const preExpA = 1e7; // Pre-exponential factor

  // Arrhenius Rate Constant k = A * exp(-Ea / (R * T))
  const rateConstant = preExpA * Math.exp(-activeEa / (R * temperature));
  // Rate = k * [A] * [B] (assume [A]=[B]=concentration)
  const theoreticalRate = rateConstant * Math.pow(concentration, 2);

  // Effective collision fraction: exp(-Ea / RT)
  const effectiveFraction = Math.exp(-activeEa / (R * temperature));

  // Initialize or update particles
  const initParticles = () => {
    const total = Math.min(80, Math.floor(concentration * 26));
    const parts: Particle[] = [];
    const w = 480;
    const h = 320;

    for (let i = 0; i < total; i++) {
      // Speed scales with sqrt(T) (Maxwell-Boltzmann thermal speed)
      const speed = Math.sqrt(temperature / 300) * 80;
      const angle = Math.random() * Math.PI * 2;
      parts.push({
        x: 30 + Math.random() * (w - 60),
        y: 30 + Math.random() * (h - 60),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        type: i % 2 === 0 ? "A" : "B"
      });
    }
    particlesRef.current = parts;
    setReactedCount(0);
  };

  useEffect(() => {
    initParticles();
  }, [concentration]);

  // Particle Simulation Loop
  useEffect(() => {
    let lastTime = performance.now();

    const update = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const w = canvas.width;
          const h = canvas.height;

          // Chamber boundary
          ctx.fillStyle = "#020617";
          ctx.fillRect(0, 0, w, h);

          // Thermal ambient tint
          const heatAlpha = Math.min(0.25, Math.max(0.02, (temperature - 273) / 400));
          ctx.fillStyle = `rgba(239, 68, 68, ${heatAlpha})`;
          ctx.fillRect(0, 0, w, h);

          // Catalyst surface visualization at the bottom if enabled
          if (hasCatalyst) {
            ctx.fillStyle = "rgba(168, 85, 247, 0.25)";
            ctx.fillRect(0, h - 14, w, 14);
            ctx.strokeStyle = "#c084fc";
            ctx.lineWidth = 2;
            ctx.strokeRect(0, h - 14, w, 14);
            ctx.fillStyle = "#e9d5ff";
            ctx.font = "bold 9px monospace";
            ctx.fillText("⚡ CATALYST ACTIVE (LOWERED Ea)", 12, h - 4);
          }

          const particles = particlesRef.current;
          const speedMultiplier = Math.sqrt(temperature / 300);

          // Move particles and check collisions
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            if (isPlaying) {
              p.x += p.vx * dt * speedMultiplier;
              p.y += p.vy * dt * speedMultiplier;

              // Wall bounces
              if (p.x < 10) { p.x = 10; p.vx *= -1; }
              if (p.x > w - 10) { p.x = w - 10; p.vx *= -1; }
              if (p.y < 10) { p.y = 10; p.vy *= -1; }
              if (p.y > h - 10) { p.y = h - 10; p.vy *= -1; }

              // Check collision with other particles
              for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p2.x - p.x;
                const dy = p2.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 14) {
                  // Elastic bounce
                  const tempVx = p.vx;
                  const tempVy = p.vy;
                  p.vx = p2.vx;
                  p.vy = p2.vy;
                  p2.vx = tempVx;
                  p2.vy = tempVy;

                  // Reactive collision check if A and B collide
                  if ((p.type === "A" && p2.type === "B") || (p.type === "B" && p2.type === "A")) {
                    // Collision energy probability based on effective fraction
                    if (Math.random() < effectiveFraction * 12) {
                      p.type = "Product";
                      p2.type = "Product";
                      setReactedCount(c => c + 1);

                      // Flash reaction spark
                      ctx.beginPath();
                      ctx.arc((p.x + p2.x) / 2, (p.y + p2.y) / 2, 12, 0, Math.PI * 2);
                      ctx.fillStyle = "rgba(251, 191, 36, 0.6)";
                      ctx.fill();
                    }
                  }
                }
              }
            }

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.type === "Product" ? 5.5 : 4.5, 0, Math.PI * 2);
            if (p.type === "A") ctx.fillStyle = "#38bdf8"; // Reactant A (Sky Blue)
            else if (p.type === "B") ctx.fillStyle = "#f43f5e"; // Reactant B (Rose)
            else ctx.fillStyle = "#fbbf24"; // Product C (Golden Amber)
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      reqRef.current = requestAnimationFrame(update);
    };

    reqRef.current = requestAnimationFrame(update);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying, temperature, hasCatalyst, effectiveFraction]);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {simInfo.subject}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300">
              {simInfo.difficulty}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">{simInfo.title}</h1>
          <p className="text-slate-400 text-sm">{simInfo.description}</p>
        </div>

        <button
          onClick={() => setShowQuiz(true)}
          className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm"
        >
          <HelpCircle className="w-4 h-4 mr-1.5" />
          Take Quiz
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Reaction Status Tag */}
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span className="text-slate-300">A</span>
            <span className="text-slate-500">+</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            <span className="text-slate-300">B</span>
            <span className="text-slate-500">→</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-amber-300 font-bold">C (Product)</span>
          </div>

          <canvas ref={canvasRef} width={520} height={340} className="w-full h-full max-h-[380px] rounded-lg border border-slate-800" />

          {/* Reaction Counter Bar */}
          <div className="mt-3 w-full flex justify-between items-center px-2 text-xs text-slate-400 font-mono">
            <span>Successful Reactions: <strong className="text-amber-400 text-sm">{reactedCount}</strong></span>
            <span>Effective Collision Rate: <strong className="text-indigo-400">{(effectiveFraction * 100).toFixed(2)}%</strong></span>
          </div>
        </div>

        {/* Controls & Math Panel */}
        <div className="space-y-6 overflow-y-auto pr-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-6 flex items-center">
              <Flame className="w-4 h-4 text-indigo-400 mr-2" />
              Reaction Variables
            </h3>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">Temperature (T)</span>
                  <span className="text-indigo-400 font-mono font-bold">{temperature} K ({(temperature - 273)}°C)</span>
                </div>
                <input
                  type="range"
                  min="273"
                  max="550"
                  step="5"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">Reactant Concentration</span>
                  <span className="text-indigo-400 font-mono font-bold">{concentration.toFixed(1)} M</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={concentration}
                  onChange={(e) => setConcentration(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Catalyst Toggle */}
              <div className="pt-2">
                <button
                  onClick={() => setHasCatalyst(!hasCatalyst)}
                  className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-between font-medium text-sm transition-all ${
                    hasCatalyst 
                      ? "bg-purple-600/20 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="flex items-center">
                    <Sparkles className={`w-4 h-4 mr-2 ${hasCatalyst ? "text-purple-400" : "text-slate-500"}`} />
                    Chemical Catalyst
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${hasCatalyst ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                    {hasCatalyst ? "ACTIVE (-Ea)" : "OFF"}
                  </span>
                </button>
              </div>
            </div>

            {/* Play/Pause & Reset */}
            <div className="flex space-x-2 mt-6">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg flex items-center justify-center font-medium transition-colors text-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? "Pause Collisions" : "Resume"}
              </button>
              <button
                onClick={() => {
                  setTemperature(320);
                  setConcentration(1.5);
                  setHasCatalyst(false);
                  initParticles();
                  setIsPlaying(true);
                }}
                className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center transition-colors"
                title="Reset Lab"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Arrhenius & Collision Theory Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-4">Arrhenius Equation &amp; Energetics</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Activation Energy (Ea)</span>
                <span className={`font-bold ${hasCatalyst ? "text-purple-400" : "text-slate-200"}`}>
                  {(activeEa / 1000).toFixed(0)} kJ/mol
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Rate Constant (k)</span>
                <span className="text-rose-400 font-bold">{rateConstant.toExponential(2)} s⁻¹</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Reaction Rate (R = k[A]²)</span>
                <span className="text-amber-400 font-bold">{theoreticalRate.toExponential(2)} M/s</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400">
              <strong className="block text-slate-200 mb-1">Maxwell-Boltzmann Insight:</strong>
              {hasCatalyst 
                ? "The catalyst provides a lower activation barrier (Ea), allowing significantly more molecules to successfully react at the current temperature."
                : "Higher temperature raises the average kinetic energy and flattens the Maxwell-Boltzmann distribution, increasing the fraction of collisions with E ≥ Ea."}
            </div>
          </div>
        </div>
      </div>

      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
