import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  Gauge,
  HelpCircle,
  Layers,
  Sparkles,
  Table,
  Wind,
  Sliders
} from "lucide-react";

export default function FreeFallLab() {
  const simId = "free-fall";
  const simInfo = simulationsData.find((s) => s.id === simId) || {
    id: "free-fall",
    title: "Sự rơi tự do & Đo gia tốc trọng trường g",
    titleEn: "Free Fall & Gravitational Acceleration Measurement Lab",
    topic: "Rơi tự do trong chân không, ống Newton, đo gia tốc g bằng nam châm điện và cổng quang",
    topicEn: "Vacuum free fall, Newton's tube, measuring g with photogates and h-t² graph"
  };

  const { recordEvent, language, t } = useAppProgress();
  const isVN = language === "VN";

  // Tab Mode: 'newton-tube' (Ống Newton hút chân không) vs 'drop-experiment' (Thực hành đo g qua các độ cao)
  const [activeTab, setActiveTab] = useState<"newton-tube" | "drop-experiment">("newton-tube");
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  // --- Mode 1: Newton's Tube Parameters ---
  const [isVacuum, setIsVacuum] = useState<boolean>(true);
  const [tubeLength, setTubeLength] = useState<number>(1.2); // meters
  const [tubeTime, setTubeTime] = useState<number>(0);
  const [isTubePlaying, setIsTubePlaying] = useState<boolean>(false);

  // --- Mode 2: Gravitational Acceleration Measurement Experiment (Bài 11) ---
  const [selectedHeight, setSelectedHeight] = useState<number>(0.6); // 0.6 meters
  const [experimentalData, setExperimentalData] = useState<
    Array<{ height: number; t1: number; t2: number; t3: number; tAvg: number; tSquared: number; calculatedG: number }>
  >([
    { height: 0.2, t1: 0.201, t2: 0.203, t3: 0.202, tAvg: 0.202, tSquared: 0.0408, calculatedG: 9.80 },
    { height: 0.4, t1: 0.286, t2: 0.285, t3: 0.287, tAvg: 0.286, tSquared: 0.0818, calculatedG: 9.78 },
    { height: 0.6, t1: 0.350, t2: 0.351, t3: 0.349, tAvg: 0.350, tSquared: 0.1225, calculatedG: 9.80 },
    { height: 0.8, t1: 0.404, t2: 0.403, t3: 0.405, tAvg: 0.404, tSquared: 0.1632, calculatedG: 9.80 }
  ]);
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [dropTime, setDropTime] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    recordEvent({
      type: "simulation_started",
      simulationId: simId,
      topic: simInfo.topic
    });
  }, []);

  const g = 9.80; // Standard gravitational acceleration
  const theoreticalTubeTime = Math.sqrt((2 * tubeLength) / g);
  const currentDropTheoTime = Math.sqrt((2 * selectedHeight) / g);

  // Calculate average experimental g from data table
  const avgExpG =
    experimentalData.length > 0
      ? experimentalData.reduce((sum, item) => sum + item.calculatedG, 0) / experimentalData.length
      : 9.8;

  // Animation Loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (activeTab === "newton-tube" && isTubePlaying) {
        setTubeTime((prev) => {
          const next = prev + dt;
          const maxT = theoreticalTubeTime + (isVacuum ? 0.05 : 1.2);
          if (next >= maxT) {
            setIsTubePlaying(false);
            return maxT;
          }
          return next;
        });
      }

      if (activeTab === "drop-experiment" && isDropping) {
        setDropTime((prev) => {
          const next = prev + dt;
          if (next >= currentDropTheoTime) {
            setIsDropping(false);
            // Record 3 runs
            const jit1 = (Math.random() - 0.5) * 0.003;
            const jit2 = (Math.random() - 0.5) * 0.003;
            const jit3 = (Math.random() - 0.5) * 0.003;

            const t1Val = Number((currentDropTheoTime + jit1).toFixed(3));
            const t2Val = Number((currentDropTheoTime + jit2).toFixed(3));
            const t3Val = Number((currentDropTheoTime + jit3).toFixed(3));
            const tAvgVal = Number(((t1Val + t2Val + t3Val) / 3).toFixed(3));
            const tSq = Number((tAvgVal * tAvgVal).toFixed(4));
            const gCalc = Number(((2 * selectedHeight) / tSq).toFixed(2));

            // Update or add entry
            setExperimentalData((prevData) => {
              const existingIndex = prevData.findIndex((d) => Math.abs(d.height - selectedHeight) < 0.01);
              const newEntry = {
                height: selectedHeight,
                t1: t1Val,
                t2: t2Val,
                t3: t3Val,
                tAvg: tAvgVal,
                tSquared: tSq,
                calculatedG: gCalc
              };
              if (existingIndex >= 0) {
                const copy = [...prevData];
                copy[existingIndex] = newEntry;
                return copy;
              }
              return [...prevData, newEntry].sort((a, b) => a.height - b.height);
            });

            return currentDropTheoTime;
          }
          return next;
        });
      }

      drawScene();
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [activeTab, isTubePlaying, isDropping, tubeTime, dropTime, isVacuum, tubeLength, selectedHeight]);

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    // Dark background
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);

    if (activeTab === "newton-tube") {
      drawNewtonTubeScene(ctx, w, h);
    } else {
      drawDropTowerScene(ctx, w, h);
    }
  };

  // --- Mode 1: Newton's Vacuum Tube Canvas ---
  const drawNewtonTubeScene = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const tubeW = 85;
    const tubeTopY = 40;
    const tubeBottomY = h - 50;
    const tubeH = tubeBottomY - tubeTopY;

    const tube1CenterX = w / 2 - 120;
    const tube2CenterX = w / 2 + 120;

    // Function to draw a vertical glass tube
    const drawTube = (centerX: number, label: string, isVac: boolean, timeVal: number) => {
      // Stand base & clamp
      ctx.fillStyle = "#334155";
      ctx.fillRect(centerX - 50, h - 35, 100, 15);
      ctx.fillRect(centerX - 6, tubeTopY - 15, 12, tubeH + 30);

      // Glass Tube Body
      ctx.fillStyle = isVac ? "rgba(15, 23, 42, 0.85)" : "rgba(30, 41, 59, 0.7)";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 3;
      ctx.fillRect(centerX - tubeW / 2, tubeTopY, tubeW, tubeH);
      ctx.strokeRect(centerX - tubeW / 2, tubeTopY, tubeW, tubeH);

      // Glass reflective sheen
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.fillRect(centerX - tubeW / 2 + 6, tubeTopY + 5, 8, tubeH - 10);

      // Header Tag
      ctx.fillStyle = isVac ? "#10b981" : "#f59e0b";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, centerX, tubeTopY - 20);

      // Fall physics inside this tube:
      // Heavy Steel Coin (Bi chì / đồng xu):
      const yCoinNorm = Math.min(1, (0.5 * g * timeVal * timeVal) / tubeLength);
      const coinY = tubeTopY + 20 + yCoinNorm * (tubeH - 45);

      // Light Feather (Chiếc lông vũ):
      let yFeatherNorm = yCoinNorm;
      if (!isVac) {
        // Air resistance drastically slows down feather
        const kFeather = 0.55;
        const vTerminal = 1.6; // m/s
        const distFeather = vTerminal * timeVal * (1 - Math.exp(-kFeather * timeVal));
        yFeatherNorm = Math.min(1, distFeather / tubeLength);
      }
      const featherY = tubeTopY + 20 + yFeatherNorm * (tubeH - 45);

      // 1. Steel Ball / Coin (Left side of tube)
      const coinX = centerX - 18;
      ctx.fillStyle = "#cbd5e1";
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(coinX, coinY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("Bi", coinX, coinY + 3);

      // 2. Feather (Right side of tube)
      const featherX = centerX + 18;
      ctx.save();
      ctx.translate(featherX, featherY);
      if (!isVac) {
        // Flutter effect
        ctx.rotate(Math.sin(timeVal * 10) * 0.35);
      }

      // Feather shape
      ctx.fillStyle = "#ec4899";
      ctx.strokeStyle = "#f472b6";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Feather quill line
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(0, 18);
      ctx.stroke();

      ctx.restore();

      // Status info under tube
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px sans-serif";
      ctx.fillText(
        isVac ? (isVN ? "Chân không: v₁ = v₂ = gt" : "Vacuum: v₁ = v₂ = gt") : isVN ? "Không khí: Fc làm lông vũ rơi chậm" : "Air: Drag slows feather",
        centerX,
        tubeBottomY + 22
      );
    };

    drawTube(tube1CenterX, isVN ? "ỐNG HÚT CHÂN KHÔNG" : "VACUUM TUBE", true, tubeTime);
    drawTube(tube2CenterX, isVN ? "ỐNG CÓ KHÔNG KHÍ" : "AIR TUBE", false, tubeTime);
  };

  // --- Mode 2: Drop Tower with Photogates & h - t² Graph ---
  const drawDropTowerScene = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const leftPaneW = 280;
    const towerX = 140;
    const towerTopY = 45;
    const towerBottomY = h - 50;
    const towerH = towerBottomY - towerTopY;

    // 1. Draw Drop Stand (Trụ thí nghiệm thẳng đứng)
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(towerX - 10, towerTopY, 20, towerH);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.strokeRect(towerX - 10, towerTopY, 20, towerH);

    // Stand base
    ctx.fillStyle = "#334155";
    ctx.fillRect(towerX - 45, towerBottomY, 90, 15);

    // Ruler graduations along stand (0m to 1.0m)
    const maxDropMeters = 1.0;
    const pxPerMeter = (towerH - 30) / maxDropMeters;

    ctx.fillStyle = "#64748b";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    for (let meter = 0; meter <= maxDropMeters; meter += 0.2) {
      const yPos = towerTopY + 15 + meter * pxPerMeter;
      ctx.beginPath();
      ctx.moveTo(towerX - 10, yPos);
      ctx.lineTo(towerX - 18, yPos);
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillText(`${meter.toFixed(1)}m`, towerX - 22, yPos + 3);
    }

    // Top Electromagnetic Release (Nam châm điện giữ bi thép)
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(towerX + 15, towerTopY + 5, 24, 18);
    ctx.strokeStyle = "#ef4444";
    ctx.strokeRect(towerX + 15, towerTopY + 5, 24, 18);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("N/C", towerX + 27, towerTopY + 17);

    // Photogate at selectedHeight (Cổng quang điện E)
    const gateY = towerTopY + 15 + selectedHeight * pxPerMeter;
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(towerX + 12, gateY - 14, 28, 28);
    ctx.strokeStyle = "#38bdf8";
    ctx.strokeRect(towerX + 12, gateY - 14, 28, 28);

    // Infrared Beam
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(towerX + 14, gateY);
    ctx.lineTo(towerX + 38, gateY);
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Cổng quang E (${selectedHeight.toFixed(1)}m)`, towerX + 46, gateY + 4);

    // Falling Steel Sphere (Viên bi thép rơi tự do)
    const currentFallDist = Math.min(selectedHeight, 0.5 * g * dropTime * dropTime);
    const ballY = towerTopY + 15 + currentFallDist * pxPerMeter;
    const ballX = towerX + 26;

    const ballGrad = ctx.createRadialGradient(ballX - 2, ballY - 2, 2, ballX, ballY, 8);
    ballGrad.addColorStop(0, "#ffffff");
    ballGrad.addColorStop(0.5, "#94a3b8");
    ballGrad.addColorStop(1, "#334155");
    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 2. Right Pane: Real-Time Regression Graph (h - t²)
    const graphLeftX = leftPaneW + 50;
    const graphTop = 50;
    const graphW = w - graphLeftX - 35;
    const graphH = h - 110;

    // Background graph panel
    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1.5;
    ctx.fillRect(graphLeftX, graphTop, graphW, graphH);
    ctx.strokeRect(graphLeftX, graphTop, graphW, graphH);

    // Title
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(isVN ? "Đồ thị Thực nghiệm h - t² (Đường thẳng đi qua gốc O)" : "Experimental h - t² Graph", graphLeftX + 15, graphTop + 24);

    const padL = 45;
    const padB = 35;
    const plotW = graphW - padL - 25;
    const plotH = graphH - 45 - padB;
    const originGX = graphLeftX + padL;
    const originGY = graphTop + 45 + plotH;

    const maxT2 = 0.25; // s^2
    const maxH = 1.2; // m

    // Grid & Axis labels
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#64748b";
    ctx.font = "10px sans-serif";

    for (let t2 = 0; t2 <= maxT2; t2 += 0.05) {
      const x = originGX + (t2 / maxT2) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, graphTop + 40);
      ctx.lineTo(x, originGY);
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.fillText(`${t2.toFixed(2)}`, x, originGY + 14);
    }
    ctx.fillText("t² (s²)", originGX + plotW / 2, originGY + 28);

    for (let hStep = 0; hStep <= maxH; hStep += 0.3) {
      const y = originGY - (hStep / maxH) * plotH;
      ctx.beginPath();
      ctx.moveTo(originGX, y);
      ctx.lineTo(originGX + plotW, y);
      ctx.stroke();
      ctx.textAlign = "right";
      ctx.fillText(`${hStep.toFixed(1)}`, originGX - 6, y + 3);
    }
    ctx.fillText("h (m)", originGX - 10, graphTop + 38);

    // Axes lines
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originGX, graphTop + 40);
    ctx.lineTo(originGX, originGY);
    ctx.lineTo(originGX + plotW, originGY);
    ctx.stroke();

    // Theoretical Regression Line: h = 1/2 g t^2 => slope = 1/2 g = 4.9
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(originGX, originGY);
    const endT2 = maxT2;
    const endH = 0.5 * g * endT2;
    ctx.lineTo(originGX + (endT2 / maxT2) * plotW, originGY - (endH / maxH) * plotH);
    ctx.stroke();

    // Plot Data Points from experimentalData
    experimentalData.forEach((point) => {
      const ptX = originGX + (point.tSquared / maxT2) * plotW;
      const ptY = originGY - (point.height / maxH) * plotH;

      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(ptX, ptY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Slope tag
    ctx.fillStyle = "#a5b4fc";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(
      isVN ? `Hệ số góc k = ½g ≈ ${(avgExpG / 2).toFixed(2)} -> ḡ ≈ ${avgExpG.toFixed(2)} m/s²` : `Slope k = ½g -> ḡ ≈ ${avgExpG.toFixed(2)} m/s²`,
      graphLeftX + graphW - 15,
      graphTop + 24
    );
  };

  const handleLaunchTube = () => {
    setTubeTime(0);
    setIsTubePlaying(true);
  };

  const handleLaunchDrop = () => {
    setDropTime(0);
    setIsDropping(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vật lí 10 • KNTT Bài 10 &amp; Bài 11 • CTST Bài 9 &amp; Bài 10</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isVN ? simInfo.title : simInfo.titleEn}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {isVN
                ? "Khảo sát thực nghiệm sự rơi tự do trong chân không với Ống Newton (chiếc lông vũ và hòn bi). Thực hành đo gia tốc rơi tự do g bằng nam châm điện, cổng quang và phương pháp hồi quy đồ thị h - t²."
                : "Explore free fall in vacuum using Newton's tube and measure local gravitational acceleration g via photogates and linear h-t² regression."}
            </p>
          </div>

          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{isVN ? "Luyện tập & Trắc nghiệm" : "Concept Quiz"}</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab("newton-tube")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === "newton-tube"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-slate-800/70 text-slate-400 hover:text-white"
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>{isVN ? "1. Ống Newton (Chân không vs Không khí)" : "1. Newton's Tube"}</span>
          </button>

          <button
            onClick={() => setActiveTab("drop-experiment")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === "drop-experiment"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-slate-800/70 text-slate-400 hover:text-white"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>{isVN ? "2. Thực hành Đo gia tốc g & Đồ thị h - t²" : "2. Measure g & h-t² Graph"}</span>
          </button>
        </div>
      </div>

      {showQuiz ? (
        <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visualizer (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span>
                    {activeTab === "newton-tube"
                      ? isVN ? "Mô phỏng Ống Newton" : "Newton's Tube Visualizer"
                      : isVN ? "Trụ Đo Rơi Tự Do & Đồ thị h - t²" : "Free Fall Tower & Regression"}
                  </span>
                </div>

                {activeTab === "newton-tube" ? (
                  <button
                    onClick={handleLaunchTube}
                    disabled={isTubePlaying}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isVN ? "Thả rơi đồng thời" : "Simultaneous Drop"}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleLaunchDrop}
                    disabled={isDropping}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isVN ? "Nhả bi & Ghi số liệu" : "Drop Sphere & Measure"}</span>
                  </button>
                )}
              </div>

              {/* Canvas Viewport */}
              <div className="w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 aspect-[16/10] relative">
                <canvas ref={canvasRef} width={760} height={460} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Bottom Experimental Results Card */}
            {activeTab === "drop-experiment" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Table className="w-4 h-4 text-indigo-400" />
                    <span>{isVN ? "Bảng số liệu Thực hành Đo gia tốc g (SGK KNTT tr.45)" : "Experimental Data Table"}</span>
                  </h3>
                  <button
                    onClick={() =>
                      setExperimentalData([
                        { height: 0.2, t1: 0.201, t2: 0.203, t3: 0.202, tAvg: 0.202, tSquared: 0.0408, calculatedG: 9.80 },
                        { height: 0.4, t1: 0.286, t2: 0.285, t3: 0.287, tAvg: 0.286, tSquared: 0.0818, calculatedG: 9.78 },
                        { height: 0.6, t1: 0.350, t2: 0.351, t3: 0.349, tAvg: 0.350, tSquared: 0.1225, calculatedG: 9.80 },
                        { height: 0.8, t1: 0.404, t2: 0.403, t3: 0.405, tAvg: 0.404, tSquared: 0.1632, calculatedG: 9.80 }
                      ])
                    }
                    className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    {isVN ? "Đặt lại số liệu" : "Reset Data"}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">h (m)</th>
                        <th className="py-2.5 px-3">t₁ (s)</th>
                        <th className="py-2.5 px-3">t₂ (s)</th>
                        <th className="py-2.5 px-3">t₃ (s)</th>
                        <th className="py-2.5 px-3">t̄ (s)</th>
                        <th className="py-2.5 px-3">t̄² (s²)</th>
                        <th className="py-2.5 px-3">g = 2h / t̄² (m/s²)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {experimentalData.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="py-2 px-3 text-indigo-300 font-bold">{item.height.toFixed(2)}</td>
                          <td className="py-2 px-3 text-slate-400">{item.t1.toFixed(3)}</td>
                          <td className="py-2 px-3 text-slate-400">{item.t2.toFixed(3)}</td>
                          <td className="py-2 px-3 text-slate-400">{item.t3.toFixed(3)}</td>
                          <td className="py-2 px-3 text-sky-300 font-bold">{item.tAvg.toFixed(3)}</td>
                          <td className="py-2 px-3 text-purple-300 font-bold">{item.tSquared.toFixed(4)}</td>
                          <td className="py-2 px-3 text-emerald-400 font-bold">{item.calculatedG.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Statistical Summary */}
                <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Gia tốc rơi tự do trung bình đo được:</span>
                    <span className="text-amber-300 font-mono font-bold text-base">
                      ḡ = {avgExpG.toFixed(2)} ± 0.05 m/s²
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block">Sai số tỉ đối:</span>
                    <span className="text-emerald-400 font-mono font-bold">δg ≈ 0.51%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Controls (1 Col) */}
          <div className="space-y-5">
            {activeTab === "newton-tube" ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Gauge className="w-4 h-4 text-indigo-400" />
                  <span>{isVN ? "Cấu hình Ống Newton" : "Newton's Tube Setup"}</span>
                </h2>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-emerald-400 block">Khám phá Vật lí của Newton:</span>
                  <p className="text-slate-300 leading-relaxed">
                    Trong ống hút chân không, lực cản không khí triệt tiêu (Fc = 0). Hòn bi chì và chiếc lông vũ rơi nhanh như nhau và chạm đáy cùng một lúc, chứng minh mọi vật rơi tự do với cùng gia tốc g.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{isVN ? "Chiều dài ống thuỷ tinh:" : "Tube Length:"}</span>
                    <span className="text-indigo-400 font-mono font-bold">{tubeLength} m</span>
                  </div>
                  <input
                    type="range"
                    min={0.8}
                    max={2.0}
                    step={0.1}
                    value={tubeLength}
                    onChange={(e) => {
                      setTubeLength(Number(e.target.value));
                      setIsTubePlaying(false);
                      setTubeTime(0);
                    }}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleLaunchTube}
                  disabled={isTubePlaying}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isVN ? "Thả rơi hai vật" : "Drop Both Objects"}</span>
                </button>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Gauge className="w-4 h-4 text-indigo-400" />
                  <span>{isVN ? "Chọn độ cao rơi (h)" : "Drop Height Selection"}</span>
                </h2>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{isVN ? "Khoảng cách đến Cổng quang (h):" : "Height (h):"}</span>
                    <span className="text-indigo-400 font-mono font-bold">{selectedHeight.toFixed(2)} m</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={0.9}
                    step={0.05}
                    value={selectedHeight}
                    onChange={(e) => {
                      setSelectedHeight(Number(e.target.value));
                      setIsDropping(false);
                      setDropTime(0);
                    }}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-amber-300 block">Phương pháp tính gia tốc g:</span>
                  <p className="text-slate-300">
                    Từ công thức <strong className="text-indigo-300 font-mono">h = ½·g·t²</strong>:
                  </p>
                  <p className="text-slate-300">
                    =&gt; <strong className="text-emerald-400 font-mono">g = 2h / t̄²</strong>
                  </p>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Đồ thị h theo t² là đường thẳng đi qua gốc toạ độ có hệ số góc k = g/2.
                  </p>
                </div>

                <button
                  onClick={handleLaunchDrop}
                  disabled={isDropping}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isVN ? "Nhả nam châm điện & Đo" : "Release Magnet & Measure"}</span>
                </button>
              </div>
            )}

            {/* Curriculum Standard Card */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>{isVN ? "Chuẩn SGK Đối chiếu" : "Curriculum Standard"}</span>
              </div>
              <p className="text-xs text-slate-400">
                • <strong>KNTT:</strong> Bài 10 (tr. 43-46), Bài 11 (tr. 47-48)
              </p>
              <p className="text-xs text-slate-400">
                • <strong>CTST:</strong> Bài 9 (tr. 47-50), Bài 10 (tr. 51-54)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
