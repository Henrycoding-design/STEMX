import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import MathText from "../../common/MathText";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import SimulationVideoButton from "../SimulationVideoButton";
import { RotateCcw, Activity, HelpCircle, Ruler } from "lucide-react";

export default function HookeElasticity() {
  const simId = "hooke-elasticity";
  const simInfo = simulationsData.find(s => s.id === simId)!;
  const { recordEvent, language, t } = useAppProgress();

  const [springConstantK, setSpringConstantK] = useState(50); // N/m (Độ cứng k)
  const [initialLengthCm, setInitialLengthCm] = useState(15); // cm (Chiều dài ban đầu l0)
  const [hangingMassGrams, setHangingMassGrams] = useState(200); // grams (Khối lượng quả nặng)
  const [showQuiz, setShowQuiz] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const g = 9.8; // m/s^2

  // Physical calculations
  const massKg = hangingMassGrams / 1000;
  const gravityForce = massKg * g; // P = mg
  // Equilibrium condition: F_dh = P => k * delta_l = mg => delta_l = mg / k (in meters)
  const deltaLMeters = gravityForce / springConstantK;
  const deltaLCm = deltaLMeters * 100;
  const stretchedLengthCm = initialLengthCm + deltaLCm;
  const elasticEnergy = 0.5 * springConstantK * (deltaLMeters * deltaLMeters); // W_dh = 1/2 k delta_l^2

  useEffect(() => {
    recordEvent({ type: "simulation_started", simulationId: simId, topic: simInfo.topic });
  }, []);

  // Draw vertical spring stand and F - delta_l graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    // LEFT HALF: Experimental Spring Rig
    const standX = 140;
    const topY = 40;
    const springStartY = topY + 4;
    const scalePxPerCm = Math.min(7.5, (h - springStartY - 66) / stretchedLengthCm);

    // Vertical Support Stand
    ctx.fillStyle = "#334155";
    ctx.fillRect(40, topY - 10, 20, h - topY - 10);
    ctx.fillRect(20, h - 30, 80, 20); // base foot
    ctx.fillRect(40, topY - 10, standX - 20, 14); // horizontal arm

    // Ruler alongside spring
    const rulerX = standX + 70;
    const rulerMaxCm = Math.max(45, Math.ceil(stretchedLengthCm / 5) * 5);
    const rulerHeight = rulerMaxCm * scalePxPerCm;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(rulerX, topY, 40, rulerHeight);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rulerX, topY, 40, rulerHeight);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px monospace";
    for (let cm = 0; cm <= rulerMaxCm; cm += 5) {
      const ry = topY + cm * scalePxPerCm;
      ctx.strokeStyle = "#64748b";
      ctx.beginPath();
      ctx.moveTo(rulerX, ry);
      ctx.lineTo(rulerX + (cm % 10 === 0 ? 14 : 8), ry);
      ctx.stroke();
      if (cm % 10 === 0) {
        ctx.fillText(`${cm}cm`, rulerX + 17, ry + 3);
      }
    }

    // Spring Rendering (Coils)
    const totalSpringPx = stretchedLengthCm * scalePxPerCm;
    const springEndY = springStartY + totalSpringPx;
    const numCoils = 14;
    const coilStep = totalSpringPx / numCoils;

    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(standX, springStartY);

    for (let i = 1; i <= numCoils; i++) {
      const cy = springStartY + (i - 0.5) * coilStep;
      const cx = standX + (i % 2 === 0 ? 18 : -18);
      ctx.lineTo(cx, cy);
      ctx.lineTo(standX, springStartY + i * coilStep);
    }
    ctx.stroke();

    // Hook at bottom
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(standX, springEndY + 6, 6, 0, Math.PI);
    ctx.stroke();

    // Slotted Hanging Weights (Quả cân)
    const weightY = springEndY + 12;
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(standX - 22, weightY, 44, 26);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(standX - 22, weightY, 44, 26);

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${hangingMassGrams}g`, standX, weightY + 16);

    // Initial length l0 reference dashed line
    const l0Y = springStartY + initialLengthCm * scalePxPerCm;
    ctx.strokeStyle = "rgba(244, 63, 94, 0.6)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(standX - 45, l0Y);
    ctx.lineTo(rulerX, l0Y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#f43f5e";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`l0 = ${initialLengthCm}cm`, standX - 45, l0Y - 4);

    // Elongation indicator delta_l
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(standX + 35, l0Y);
    ctx.lineTo(standX + 35, springEndY);
    ctx.stroke();

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 12px monospace";
    ctx.fillText(`dl = ${deltaLCm.toFixed(1)}cm`, standX + 42, (l0Y + springEndY) / 2 + 3);

    // RIGHT HALF: Dynamic Graph F_dh vs Delta_l
    const gx = 420;
    const gy = h - 70;
    const gWidth = w - gx - 40;
    const gHeight = 220;

    // Graph Background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(gx, gy - gHeight, gWidth, gHeight);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(gx, gy - gHeight, gWidth, gHeight);

    // Graph Axes
    ctx.strokeStyle = "#64748b";
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + gWidth, gy); // Delta l axis
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx, gy - gHeight); // F axis
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    ctx.fillText("dl (cm) ->", gx + gWidth - 55, gy + 18);
    ctx.fillText(language === "VN" ? "Lực đàn hồi F (N)" : "Elastic Force F (N)", gx + 6, gy - gHeight + 14);

    // Theoretical line F = k * delta_l
    const maxDeltaLCm = Math.max(25, Math.ceil(deltaLCm / 5) * 5);
    const graphForceAtMaxDelta = springConstantK * (maxDeltaLCm / 100);
    const maxForceN = Math.max(10, Math.ceil(Math.max(gravityForce, graphForceAtMaxDelta) / 2) * 2);

    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    const endX = gx + (maxDeltaLCm / maxDeltaLCm) * gWidth;
    const endForce = graphForceAtMaxDelta;
    const endY = gy - (Math.min(maxForceN, endForce) / maxForceN) * gHeight;
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Active operating point on graph
    const ptX = gx + Math.min(1, deltaLCm / maxDeltaLCm) * gWidth;
    const ptY = gy - Math.min(1, gravityForce / maxForceN) * gHeight;

    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(ptX, ptY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 12px monospace";
    ctx.fillText(`(${deltaLCm.toFixed(1)}cm, ${gravityForce.toFixed(2)}N)`, ptX + 8, ptY - 8);
  }, [springConstantK, initialLengthCm, hangingMassGrams, deltaLCm, stretchedLengthCm, gravityForce]);

  return (
    <div className="simulation-page min-h-full flex flex-col space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-1">
            <span>{simInfo.knttRef}</span>
            <span>•</span>
            <span>{simInfo.ctstRef}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {language === "VN" ? simInfo.title : simInfo.titleEn}
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            <MathText text={language === "VN" ? simInfo.description : simInfo.descriptionEn} />
          </p>
          <div className="mt-3">
            <SimulationVideoButton href="https://www.youtube.com/watch?v=Xvf8HAbXQEE" />
          </div>
        </div>

        <button 
          onClick={() => setShowQuiz(true)}
          className="w-fit bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold transition-colors text-xs cursor-pointer shadow-md shrink-0 flex items-center space-x-1.5"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t("take_quiz")}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Main Canvas Area */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg">
          {/* Telemetry bar */}
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 px-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></span>
              <span>{language === "VN" ? "Thí nghiệm Treo lò xo & Đồ thị F - Δl" : "Hooke's Law Spring Lab"}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono text-slate-300">
              <span><MathText text="F_dh = P" />: <strong className="text-emerald-400">{gravityForce.toFixed(2)} N</strong></span>
              <span>Δl: <strong className="text-amber-400">{deltaLCm.toFixed(2)} cm</strong></span>
              <span>l: <strong className="text-indigo-400">{stretchedLengthCm.toFixed(2)} cm</strong></span>
            </div>
          </div>

          <div className="w-full relative aspect-[16/10] sm:aspect-[16/9] min-h-[320px] max-h-[460px] bg-slate-950 flex items-center justify-center p-2">
            <canvas 
              ref={canvasRef} 
              width={760} 
              height={440} 
              className="w-full h-full object-contain block"
            />
          </div>

          <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {language === "VN" ? "Quan sát điểm đo (màu xanh lá) di chuyển đúng theo đường thẳng thực nghiệm F = k·Δl." : "Observe how the green measurement point follows the Hooke line F = k·Δl."}
            </div>
            <div className="text-xs font-mono text-indigo-300 font-bold">
              k = {springConstantK} N/m
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wider">
              {language === "VN" ? "Điều chỉnh Thí nghiệm" : "Experiment Controls"}
            </h3>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Khối lượng quả cân treo (m)" : "Slotted Mass (m)"}</span>
                <span className="font-mono text-indigo-400 font-bold">{hangingMassGrams} g</span>
              </div>
              <input 
                type="range" min="50" max="600" step="25" value={hangingMassGrams}
                onChange={(e) => setHangingMassGrams(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Độ cứng lò xo (k)" : "Spring Constant (k)"}</span>
                <span className="font-mono text-indigo-400 font-bold">{springConstantK} N/m</span>
              </div>
              <input 
                type="range" min="20" max="150" step="5" value={springConstantK}
                onChange={(e) => setSpringConstantK(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Chiều dài tự nhiên ban đầu (l₀)" : "Initial Length (l₀)"}</span>
                <span className="font-mono text-indigo-400 font-bold">{initialLengthCm} cm</span>
              </div>
              <input 
                type="range" min="10" max="25" step="1" value={initialLengthCm}
                onChange={(e) => setInitialLengthCm(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-slate-100 text-sm mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-indigo-400" />
              {language === "VN" ? "Định luật Hooke (KNTT Bài 33)" : "Hooke's Law Formula"}
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-emerald-400 space-y-1 text-[11px]">
                <div><MathText text="F_dh = k · |Δl| = k · |l - l₀|" /></div>
                <div className="text-slate-400">P = m · g = {(massKg * g).toFixed(2)} N</div>
                <div className="text-indigo-300"><MathText text={`W_dh = ½k·(Δl)² = ${(elasticEnergy * 1000).toFixed(1)} mJ`} /></div>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {language === "VN"
                  ? "Trong giới hạn đàn hồi, độ dãn của lò xo tỉ lệ thuận với độ lớn lực tác dụng. Hệ số góc của đồ thị F theo Δl chính là độ cứng k."
                  : "Within proportional elastic limits, elongation is directly proportional to applied force. The slope of the F-Δl line equals spring stiffness k."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
