import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import { Play, Pause, RotateCcw, Zap, HelpCircle } from "lucide-react";

export default function ElectricCircuit() {
  const simId = "electric-circuit";
  const simInfo = simulationsData.find(s => s.id === simId)!;
  const { language, recordEvent } = useAppProgress();
  const isVN = language === "VN";

  const [mode, setMode] = useState<"single" | "series" | "parallel">("single");
  const [voltage, setVoltage] = useState(12); // Volts
  const [r1, setR1] = useState(10); // Ohms
  const [r2, setR2] = useState(10); // Ohms
  const [isPlaying, setIsPlaying] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animOffsetMainRef = useRef(0);
  const animOffsetBranch1Ref = useRef(0);
  const animOffsetBranch2Ref = useRef(0);
  const animOffsetSingleRef = useRef(0);
  const reqRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    recordEvent({ type: "simulation_started", simulationId: simId, topic: simInfo.topic });
  }, []);

  // Equivalent Resistance Calculations
  const equivalentR = mode === "single" ? r1 : mode === "series" ? r1 + r2 : (r1 * r2) / (r1 + r2);
  const current = equivalentR > 0 ? voltage / equivalentR : 0;
  const power = voltage * current;

  // Branch currents and individual bulb powers for parallel and series
  const i1 = mode === "parallel" && r1 > 0 ? voltage / r1 : current;
  const i2 = mode === "parallel" && r2 > 0 ? voltage / r2 : (mode === "series" ? current : 0);
  const p1 = mode === "parallel" ? voltage * i1 : (mode === "single" ? power : (current * current * r1));
  const p2 = mode === "parallel" ? voltage * i2 : (mode === "series" ? (current * current * r2) : 0);

  // Canvas animation for current electron flow
  useEffect(() => {
    let last = performance.now();
    const animate = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      // Speed proportional to current
      const speedScale = 45;
      if (isPlaying && current > 0) {
        animOffsetMainRef.current = (animOffsetMainRef.current + current * speedScale * dt) % 690;
        animOffsetBranch1Ref.current = (animOffsetBranch1Ref.current + i1 * speedScale * dt) % 220;
        animOffsetBranch2Ref.current = (animOffsetBranch2Ref.current + i2 * speedScale * dt) % 690;
        animOffsetSingleRef.current = (animOffsetSingleRef.current + current * speedScale * dt) % 1380;
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const w = canvas.width;
          const h = canvas.height;

          // Wire path coordinates
          const leftX = 85;
          const midX = 320;
          const rightX = w - 85;
          const topY = 70;
          const botY = h - 70;
          const midY = (topY + botY) / 2;

          ctx.strokeStyle = "#334155";
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          // Draw Primary Outer Wire Loop
          ctx.beginPath();
          ctx.moveTo(leftX, topY);
          ctx.lineTo(rightX, topY);
          ctx.lineTo(rightX, botY);
          ctx.lineTo(leftX, botY);
          ctx.closePath();
          ctx.stroke();

          // In parallel mode: draw vertical middle branch parallel to battery and right wire
          if (mode === "parallel") {
            ctx.beginPath();
            ctx.moveTo(midX, topY);
            ctx.lineTo(midX, botY);
            ctx.stroke();

            // Draw Junction Nodes (Nodes A and B)
            const drawJunction = (nx: number, ny: number, label: string, labelAbove = true) => {
              // Outer halo
              ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
              ctx.beginPath();
              ctx.arc(nx, ny, 9, 0, Math.PI * 2);
              ctx.fill();

              // Solid dot
              ctx.fillStyle = "#38bdf8";
              ctx.beginPath();
              ctx.arc(nx, ny, 5.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = "#ffffff";
              ctx.lineWidth = 1.5;
              ctx.stroke();

              // Label
              ctx.fillStyle = "#7dd3fc";
              ctx.font = "bold 10px monospace";
              ctx.textAlign = "center";
              ctx.fillText(label, nx, labelAbove ? ny - 12 : ny + 19);
            };

            drawJunction(midX, topY, isVN ? "Nút A (Tách dòng: I_tổng = I₁ + I₂)" : "Node A (Split: I_tot = I₁ + I₂)", true);
            drawJunction(midX, botY, isVN ? "Nút B (Hợp dòng: I₁ + I₂ = I_tổng)" : "Node B (Join: I₁ + I₂ = I_tot)", false);
          }

          // Draw Battery on Left Wire
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(leftX - 25, midY - 32, 50, 64);
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(leftX - 25, midY - 32, 50, 64);

          // Battery Plates
          ctx.fillStyle = "#38bdf8"; // + plate
          ctx.fillRect(leftX - 16, midY - 18, 32, 6);
          ctx.fillStyle = "#f43f5e"; // - plate
          ctx.fillRect(leftX - 10, midY + 12, 20, 6);

          ctx.fillStyle = "#e2e8f0";
          ctx.font = "bold 11px monospace";
          ctx.textAlign = "center";
          ctx.fillText(`+ ${voltage}V -`, leftX, midY + 4);

          // Total Current Indicator near battery
          ctx.fillStyle = "#34d399";
          ctx.font = "bold 10px monospace";
          ctx.fillText(`I_tổng: ${current.toFixed(2)}A`, leftX, botY + 22);

          // Resistor Drawing Helper
          const drawResistor = (
            rx: number,
            ry: number,
            label: string,
            sublabel?: string,
            boxBorder = "#6366f1",
            textCol = "#a5b4fc"
          ) => {
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(rx - 42, ry - 16, 84, 32);
            ctx.strokeStyle = boxBorder;
            ctx.lineWidth = 2;
            ctx.strokeRect(rx - 42, ry - 16, 84, 32);
            ctx.fillStyle = textCol;
            ctx.font = "bold 11px monospace";
            ctx.textAlign = "center";
            ctx.fillText(label, rx, ry + 4);

            if (sublabel) {
              ctx.fillStyle = boxBorder;
              ctx.font = "9px monospace";
              ctx.fillText(sublabel, rx, ry - 20);
            }
          };

          // Light Bulb Drawing Helper
          const drawBulb = (bx: number, by: number, bulbPower: number, label: string) => {
            const glowAlpha = Math.min(1, bulbPower / 35);
            if (glowAlpha > 0.05 && isPlaying) {
              const rad = 18 + glowAlpha * 32;
              const grad = ctx.createRadialGradient(bx, by, 4, bx, by, rad);
              grad.addColorStop(0, `rgba(251, 191, 36, ${0.85 * glowAlpha})`);
              grad.addColorStop(1, "rgba(251, 191, 36, 0)");
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(bx, by, rad, 0, Math.PI * 2);
              ctx.fill();
            }

            // Socket base
            ctx.fillStyle = "#1e293b";
            ctx.beginPath();
            ctx.arc(bx, by, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = glowAlpha > 0.1 ? "#fbbf24" : "#64748b";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Bulb icon
            ctx.fillStyle = glowAlpha > 0.1 ? "#fef08a" : "#94a3b8";
            ctx.font = "14px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("💡", bx, by + 5);

            // Power tag
            ctx.fillStyle = glowAlpha > 0.1 ? "#fef08a" : "#94a3b8";
            ctx.font = "bold 9px monospace";
            ctx.fillText(label, bx, by + 28);
          };

          // Draw Components based on Mode
          if (mode === "parallel") {
            // BRANCH 1: Middle Vertical Line (Node A to Node B)
            drawResistor(midX, 122, `R₁: ${r1}Ω`, isVN ? `Nhánh 1: I₁ = ${i1.toFixed(2)}A` : `Branch 1: I₁ = ${i1.toFixed(2)}A`, "#6366f1", "#a5b4fc");
            drawBulb(midX, 226, p1, isVN ? `Đèn 1: ${p1.toFixed(1)}W` : `Bulb 1: ${p1.toFixed(1)}W`);

            // BRANCH 2: Outer Right Vertical Line
            drawResistor(rightX, 122, `R₂: ${r2}Ω`, isVN ? `Nhánh 2: I₂ = ${i2.toFixed(2)}A` : `Branch 2: I₂ = ${i2.toFixed(2)}A`, "#38bdf8", "#7dd3fc");
            drawBulb(rightX, 226, p2, isVN ? `Đèn 2: ${p2.toFixed(1)}W` : `Bulb 2: ${p2.toFixed(1)}W`);
          } else if (mode === "series") {
            // Resistor 1 on Top Wire
            drawResistor(midX, topY, `R₁: ${r1}Ω`, `U₁ = ${(current * r1).toFixed(1)}V`, "#6366f1", "#a5b4fc");
            // Resistor 2 on Bottom Wire
            drawResistor(midX, botY, `R₂: ${r2}Ω`, `U₂ = ${(current * r2).toFixed(1)}V`, "#6366f1", "#a5b4fc");
            // Single Bulb on Right Wire
            drawBulb(rightX, midY, power, isVN ? `Đèn: ${power.toFixed(1)}W` : `Bulb: ${power.toFixed(1)}W`);
          } else {
            // Single Circuit: Resistor 1 on Top Wire, Bulb on Right Wire
            drawResistor(midX, topY, `R₁: ${r1}Ω`, `U = ${voltage.toFixed(1)}V`, "#6366f1", "#a5b4fc");
            drawBulb(rightX, midY, power, isVN ? `Đèn: ${power.toFixed(1)}W` : `Bulb: ${power.toFixed(1)}W`);
          }

          // Electron rendering helper
          const drawCharge = (cx: number, cy: number) => {
            ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
            ctx.beginPath();
            ctx.arc(cx, cy, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#38bdf8";
            ctx.beginPath();
            ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(cx, cy, 1.2, 0, Math.PI * 2);
            ctx.fill();
          };

          // Animated Electron Flow
          if (isPlaying && current > 0) {
            if (mode === "parallel") {
              // 1. Source Loop (carrying I_tot from Node B via Battery to Node A)
              const lCommon = 690;
              const numMain = 15;
              const stepMain = lCommon / numMain;

              const getCommonPos = (d: number) => {
                if (d < 235) {
                  // Node B to bottom left corner: (midX, botY) -> (leftX, botY)
                  return { x: midX - d, y: botY };
                } else if (d < 455) {
                  // Upwards through battery: (leftX, botY) -> (leftX, topY)
                  return { x: leftX, y: botY - (d - 235) };
                } else {
                  // Along top rail to Node A: (leftX, topY) -> (midX, topY)
                  return { x: leftX + (d - 455), y: topY };
                }
              };

              for (let i = 0; i < numMain; i++) {
                const dist = (i * stepMain + animOffsetMainRef.current) % lCommon;
                const pt = getCommonPos(dist);
                drawCharge(pt.x, pt.y);
              }

              // 2. Branch 1 (Middle vertical wire through R1 and Bulb 1, carrying I1)
              const lBranch1 = 220;
              const numB1 = 6;
              const stepB1 = lBranch1 / numB1;
              for (let i = 0; i < numB1; i++) {
                const dist = (i * stepB1 + animOffsetBranch1Ref.current) % lBranch1;
                drawCharge(midX, topY + dist);
              }

              // 3. Branch 2 (Outer path through R2 and Bulb 2, carrying I2)
              const lBranch2 = 690;
              const numB2 = 15;
              const stepB2 = lBranch2 / numB2;

              const getBranch2Pos = (d: number) => {
                if (d < 235) {
                  // From Node A along top rail: (midX, topY) -> (rightX, topY)
                  return { x: midX + d, y: topY };
                } else if (d < 455) {
                  // Down right wire through R2 and Bulb 2: (rightX, topY) -> (rightX, botY)
                  return { x: rightX, y: topY + (d - 235) };
                } else {
                  // Along bottom rail back to Node B: (rightX, botY) -> (midX, botY)
                  return { x: rightX - (d - 455), y: botY };
                }
              };

              for (let i = 0; i < numB2; i++) {
                const dist = (i * stepB2 + animOffsetBranch2Ref.current) % lBranch2;
                const pt = getBranch2Pos(dist);
                drawCharge(pt.x, pt.y);
              }
            } else {
              // Single or Series: Single closed loop
              const perimeter = 2 * (rightX - leftX) + 2 * (botY - topY);
              const numElectrons = 26;
              const step = perimeter / numElectrons;

              for (let i = 0; i < numElectrons; i++) {
                let dist = (i * step + animOffsetSingleRef.current) % perimeter;
                let ex = 0;
                let ey = 0;

                // Top segment: Left -> Right
                if (dist < (rightX - leftX)) {
                  ex = leftX + dist;
                  ey = topY;
                } 
                // Right segment: Top -> Bottom
                else if (dist < (rightX - leftX) + (botY - topY)) {
                  const d = dist - (rightX - leftX);
                  ex = rightX;
                  ey = topY + d;
                } 
                // Bottom segment: Right -> Left
                else if (dist < 2 * (rightX - leftX) + (botY - topY)) {
                  const d = dist - ((rightX - leftX) + (botY - topY));
                  ex = rightX - d;
                  ey = botY;
                } 
                // Left segment: Bottom -> Top
                else {
                  const d = dist - (2 * (rightX - leftX) + (botY - topY));
                  ex = leftX;
                  ey = botY - d;
                }

                drawCharge(ex, ey);
              }
            }
          }
        }
      }

      reqRef.current = requestAnimationFrame(animate);
    };

    reqRef.current = requestAnimationFrame(animate);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [mode, voltage, r1, r2, isPlaying, current, power, i1, i2, p1, p2]);

  return (
    <div className="min-h-full flex flex-col space-y-6 pb-8">
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
          className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 mr-1.5" />
          {isVN ? "Kiểm tra kiến thức" : "Take Quiz"}
        </button>
      </div>

      {/* Main Lab Grid */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative">
          {/* Circuit Mode Selector */}
          <div className="absolute top-4 left-4 z-10 flex space-x-1 bg-slate-950/85 backdrop-blur border border-slate-800 rounded-lg p-1">
            {(["single", "series", "parallel"] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors capitalize cursor-pointer ${
                  mode === m ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {m === "single"
                  ? (isVN ? "Mạch đơn" : "Single")
                  : m === "series"
                  ? (isVN ? "Mạch nối tiếp" : "Series")
                  : (isVN ? "Mạch song song" : "Parallel")}
              </button>
            ))}
          </div>

          <div className="w-full mt-12 sm:mt-10 flex justify-center">
            <canvas ref={canvasRef} width={640} height={360} className="w-full h-auto max-w-[640px] rounded-lg bg-slate-950 border border-slate-800/80 shadow-inner" />
          </div>

          {/* Quick Status Pill */}
          <div className="mt-4 flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-xs font-mono text-slate-400">
            <span>{isVN ? "R_tương đương" : "R_equiv"}: <strong className="text-indigo-300">{equivalentR.toFixed(2)} Ω</strong></span>
            <span>•</span>
            <span>{isVN ? "Dòng điện I" : "Total I"}: <strong className="text-emerald-400">{current.toFixed(2)} A</strong></span>
            <span>•</span>
            <span>{isVN ? "Công suất P" : "Total P"}: <strong className="text-amber-400">{power.toFixed(2)} W</strong></span>
            {mode === "parallel" && (
              <>
                <span>•</span>
                <span>{isVN ? "Nhánh 1 (Đèn 1)" : "Branch 1 (Bulb 1)"}: <strong className="text-indigo-300">{i1.toFixed(2)} A ({p1.toFixed(1)} W)</strong></span>
                <span>•</span>
                <span>{isVN ? "Nhánh 2 (Đèn 2)" : "Branch 2 (Bulb 2)"}: <strong className="text-sky-300">{i2.toFixed(2)} A ({p2.toFixed(1)} W)</strong></span>
              </>
            )}
          </div>
        </div>

        {/* Controls and Calculations */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-6 flex items-center">
              <Zap className="w-4 h-4 text-indigo-400 mr-2" />
              {isVN ? "Thông số Mạch điện" : "Circuit Parameters"}
            </h3>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">{isVN ? "Hiệu điện thế nguồn (U)" : "Source Voltage (V)"}</span>
                  <span className="text-indigo-400 font-mono font-bold">{voltage.toFixed(1)} V</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="48"
                  step="1"
                  value={voltage}
                  onChange={(e) => setVoltage(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">
                    {mode === "parallel"
                      ? (isVN ? "Điện trở 1 (R₁ - Nhánh giữa)" : "Resistor 1 (R₁ - Middle Branch)")
                      : (isVN ? "Điện trở 1 (R₁)" : "Resistor 1 (R₁)")}
                  </span>
                  <span className="text-indigo-400 font-mono font-bold">{r1.toFixed(1)} Ω</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="1"
                  value={r1}
                  onChange={(e) => setR1(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              {mode !== "single" && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300 font-medium">
                      {mode === "parallel"
                        ? (isVN ? "Điện trở 2 (R₂ - Nhánh ngoài)" : "Resistor 2 (R₂ - Outer Branch)")
                        : (isVN ? "Điện trở 2 (R₂)" : "Resistor 2 (R₂)")}
                    </span>
                    <span className="text-indigo-400 font-mono font-bold">{r2.toFixed(1)} Ω</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="50"
                    step="1"
                    value={r2}
                    onChange={(e) => setR2(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Play/Pause & Reset */}
            <div className="flex space-x-2 mt-6">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg flex items-center justify-center font-medium transition-colors text-sm cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? (isVN ? "Tạm dừng dòng điện" : "Pause Flow") : (isVN ? "Mô phỏng dòng điện" : "Simulate Flow")}
              </button>
              <button
                onClick={() => {
                  setVoltage(12);
                  setR1(10);
                  setR2(10);
                  setIsPlaying(true);
                }}
                className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                title={isVN ? "Đặt lại mạch" : "Reset Circuit"}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-time Formulas and Readouts */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-4">{isVN ? "Đo lường & Công thức Định luật Ohm" : "Meters & Formulas"}</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">{isVN ? "Dòng điện toàn mạch (I = U/R_tđ)" : "Total Current (I = V/R_eq)"}</span>
                <span className="text-emerald-400 font-bold">{current.toFixed(2)} A</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">{isVN ? "Tổng công suất tiêu thụ (P = U × I)" : "Total Power (P_tot = V × I)"}</span>
                <span className="text-amber-400 font-bold">{power.toFixed(2)} W</span>
              </div>
              {mode === "parallel" && (
                <>
                  <div className="flex justify-between p-2.5 bg-slate-950/70 rounded-lg border border-indigo-900/40 text-xs">
                    <div>
                      <span className="text-indigo-300 font-bold block">{isVN ? "Nhánh 1 (Dây giữa)" : "Branch 1 (Middle Wire)"}</span>
                      <span className="text-slate-400">I₁ = U/R₁ • {isVN ? "Đèn 1" : "Bulb 1"}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-indigo-400 font-bold block">{i1.toFixed(2)} A</span>
                      <span className="text-amber-300">{p1.toFixed(1)} W</span>
                    </div>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-950/70 rounded-lg border border-sky-900/40 text-xs">
                    <div>
                      <span className="text-sky-300 font-bold block">{isVN ? "Nhánh 2 (Dây ngoài)" : "Branch 2 (Outer Wire)"}</span>
                      <span className="text-slate-400">I₂ = U/R₂ • {isVN ? "Đèn 2" : "Bulb 2"}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sky-400 font-bold block">{i2.toFixed(2)} A</span>
                      <span className="text-amber-300">{p2.toFixed(1)} W</span>
                    </div>
                  </div>
                  <div className="flex justify-between px-2.5 py-1.5 bg-emerald-950/30 rounded border border-emerald-800/40 text-xs text-emerald-300">
                    <span>{isVN ? "Kiểm tra Định luật nút Kirchhoff:" : "Kirchhoff's Law Check:"}</span>
                    <span>{i1.toFixed(2)}A + {i2.toFixed(2)}A = {current.toFixed(2)}A</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-lg text-xs text-indigo-200">
              <strong className="block mb-1">{isVN ? "Ý nghĩa Vật lí:" : "Ohm's & Kirchhoff's Insight:"}</strong>
              {mode === "series" 
                ? (isVN ? "Trong đoạn mạch nối tiếp: điện trở tương đương R_tđ = R₁ + R₂, dòng điện qua mọi linh kiện là như nhau." : "In series, resistances sum up: R_eq = R₁ + R₂, reducing total current through all elements.") 
                : mode === "parallel"
                ? (isVN ? "Trong mạch song song: mỗi nhánh nhận trọn vẹn hiệu điện thế nguồn U. Các nhánh hoạt động độc lập, tổng dòng điện mạch chính bằng tổng dòng các nhánh I_tổng = I₁ + I₂." : "In parallel, each vertical branch is across the full source voltage. Branch 1 and 2 operate independently: total current I_tot = I₁ + I₂.")
                : (isVN ? "Định luật Ohm: Cường độ dòng điện I tỉ lệ thuận với hiệu điện thế U và tỉ lệ nghịch với điện trở R." : "Current is directly proportional to voltage and inversely proportional to resistance.")}
            </div>
          </div>
        </div>
      </div>

      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
