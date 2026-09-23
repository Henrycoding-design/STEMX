import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import SimulationVideoButton from "../SimulationVideoButton";
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
  Timer,
  Sliders
} from "lucide-react";

export default function PhotogateTimerLab() {
  const simId = "photogate-mc964";
  const simInfo = simulationsData.find((s) => s.id === simId) || {
    id: "photogate-mc964",
    title: "Thực hành: Đo tốc độ bằng Đồng hồ hiện số MC-964 & Cổng quang",
    titleEn: "Digital Photogate Timer MC-964 & Speed Measurement Lab",
    topic: "Cổng quang điện, đồng hồ số MC964, đo tốc độ tức thời và gia tốc",
    topicEn: "Photogate sensors, MC964 timer modes, instantaneous velocity & acceleration"
  };

  const { recordEvent, language, t } = useAppProgress();
  const isVN = language === "VN";

  // Mode of MC964 Timer:
  // 'MODE_A': measures tA (passage time through Gate A)
  // 'MODE_B': measures tB (passage time through Gate B)
  // 'MODE_AB': measures tAB (time to travel from Gate A to Gate B)
  const [timerMode, setTimerMode] = useState<"MODE_A" | "MODE_B" | "MODE_AB">("MODE_AB");
  
  // Experimental Apparatus Parameters:
  const [shutterWidthMm, setShutterWidthMm] = useState<number>(20); // Width of flag/shutter on cart d = 20mm = 0.02m
  const [gateDistanceCm, setGateDistanceCm] = useState<number>(50); // Distance between Gate A and Gate B s = 50cm = 0.5m
  const [trackInclineDeg, setTrackInclineDeg] = useState<number>(8); // Incline angle alpha = 8 degrees
  const [cartMassG, setCartMassG] = useState<number>(200); // Cart mass m = 200g
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  // Simulation Running State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);

  // Sensor Readings Table
  const [dataLogs, setDataLogs] = useState<
    Array<{ run: number; tA: number; tB: number; tAB: number; vA: number; vB: number; a: number }>
  >([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    recordEvent({
      type: "simulation_started",
      simulationId: simId,
      topic: simInfo.topic
    });
  }, []);

  // Theoretical Kinematics:
  // Acceleration on inclined track: a = g * sin(alpha) (neglecting small rolling friction)
  const g = 9.8;
  const rad = (trackInclineDeg * Math.PI) / 180;
  const theoreticalAccel = g * Math.sin(rad); // m/s^2

  // Distances:
  // Release point x0 = 0
  // Gate A position: sA = 0.15 m (15 cm from start)
  // Gate B position: sB = sA + s (where s = gateDistanceCm / 100)
  const sA = 0.15;
  const s = gateDistanceCm / 100;
  const sB = sA + s;
  const dMeters = shutterWidthMm / 1000; // shutter plate width in meters

  // Theoretical Arrival Times at Gates (from rest v0 = 0):
  // s = 1/2 a t^2 => t = sqrt(2s / a)
  const timeReachGateA = Math.sqrt((2 * sA) / theoreticalAccel);
  const vA_theo = theoreticalAccel * timeReachGateA;
  const tA_shutter_theo = dMeters / (vA_theo || 0.001);

  const timeReachGateB = Math.sqrt((2 * sB) / theoreticalAccel);
  const vB_theo = theoreticalAccel * timeReachGateB;
  const tB_shutter_theo = dMeters / (vB_theo || 0.001);

  const tAB_theo = timeReachGateB - timeReachGateA;
  const totalTrackTime = Math.sqrt((2 * (sB + 0.15)) / theoreticalAccel);

  // MC-964 Display Time value based on current mode
  let displayChronometer = "0.0000";
  if (timerMode === "MODE_A") {
    if (simTime >= timeReachGateA + tA_shutter_theo) {
      displayChronometer = tA_shutter_theo.toFixed(4);
    } else if (simTime >= timeReachGateA) {
      displayChronometer = (simTime - timeReachGateA).toFixed(4);
    }
  } else if (timerMode === "MODE_B") {
    if (simTime >= timeReachGateB + tB_shutter_theo) {
      displayChronometer = tB_shutter_theo.toFixed(4);
    } else if (simTime >= timeReachGateB) {
      displayChronometer = (simTime - timeReachGateB).toFixed(4);
    }
  } else if (timerMode === "MODE_AB") {
    if (simTime >= timeReachGateB) {
      displayChronometer = tAB_theo.toFixed(4);
    } else if (simTime >= timeReachGateA) {
      displayChronometer = (simTime - timeReachGateA).toFixed(4);
    }
  }

  // Animation Loop
  useEffect(() => {
    let lastTimestamp = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isRunning) {
        setSimTime((prev) => {
          const next = prev + dt;
          if (next >= totalTrackTime) {
            setIsRunning(false);
            // Log measurement run
            const jitterA = (Math.random() - 0.5) * 0.0004;
            const jitterB = (Math.random() - 0.5) * 0.0004;
            const jitterAB = (Math.random() - 0.5) * 0.002;

            const measured_tA = Number((tA_shutter_theo + jitterA).toFixed(4));
            const measured_tB = Number((tB_shutter_theo + jitterB).toFixed(4));
            const measured_tAB = Number((tAB_theo + jitterAB).toFixed(4));

            const measured_vA = Number((dMeters / measured_tA).toFixed(3));
            const measured_vB = Number((dMeters / measured_tB).toFixed(3));
            const measured_a = Number(((measured_vB * measured_vB - measured_vA * measured_vA) / (2 * s)).toFixed(3));

            setDataLogs((logs) => [
              ...logs.slice(-4),
              {
                run: logs.length + 1,
                tA: measured_tA,
                tB: measured_tB,
                tAB: measured_tAB,
                vA: measured_vA,
                vB: measured_vB,
                a: measured_a
              }
            ]);

            return totalTrackTime;
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
  }, [isRunning, simTime, trackInclineDeg, gateDistanceCm, shutterWidthMm, timerMode]);

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);

    const startX = 60;
    const startY = 130;
    const trackPxLen = w - 160;
    const inclineRad = (trackInclineDeg * Math.PI) / 180;
    const endX = startX + trackPxLen * Math.cos(inclineRad);
    const endY = startY + trackPxLen * Math.sin(inclineRad);

    // Bench / Track Support stand
    ctx.fillStyle = "#334155";
    ctx.fillRect(startX - 20, startY - 10, 16, h - startY - 20);
    ctx.fillStyle = "#475569";
    ctx.fillRect(startX - 35, h - 35, 60, 15);

    // Aluminum Guide Track (Máng trượt hợp kim)
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(startX, startY - 6);
    ctx.lineTo(endX, endY - 6);
    ctx.stroke();

    // Metric Scale along Track (mm/cm marks)
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;
    for (let f = 0; f <= 1; f += 0.05) {
      const mx = startX + f * (endX - startX);
      const my = startY + f * (endY - startY) - 6;
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx - 4 * Math.sin(inclineRad), my - 4 * Math.cos(inclineRad));
      ctx.stroke();
    }

    // Gate A & Gate B coordinates
    const totalTrackMeters = sB + 0.15;
    const pxPerMeter = trackPxLen / totalTrackMeters;

    const gateAPx = sA * pxPerMeter;
    const gateAX = startX + gateAPx * Math.cos(inclineRad);
    const gateAY = startY + gateAPx * Math.sin(inclineRad);

    const gateBPx = sB * pxPerMeter;
    const gateBX = startX + gateBPx * Math.cos(inclineRad);
    const gateBY = startY + gateBPx * Math.sin(inclineRad);

    // Function to draw a photogate
    const drawPhotogate = (gx: number, gy: number, label: string, isBeamBroken: boolean) => {
      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(inclineRad);

      // Photogate bracket (U-shape)
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 2;
      ctx.fillRect(-10, -42, 20, 36);
      ctx.strokeRect(-10, -42, 20, 36);

      // Infrared Sensor Beam
      ctx.strokeStyle = isBeamBroken ? "#eab308" : "#ef4444";
      ctx.lineWidth = isBeamBroken ? 3 : 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -36);
      ctx.lineTo(0, -10);
      ctx.stroke();

      // Indicator LED
      ctx.fillStyle = isBeamBroken ? "#22c55e" : "#dc2626";
      ctx.beginPath();
      ctx.arc(0, -40, 3, 0, Math.PI * 2);
      ctx.fill();

      // Label Tag
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, 0, -48);

      ctx.restore();
    };

    // Calculate cart position at simTime
    const currentDistMeters = 0.5 * theoreticalAccel * simTime * simTime;
    const isCartAtGateA = currentDistMeters >= sA && currentDistMeters <= sA + dMeters;
    const isCartAtGateB = currentDistMeters >= sB && currentDistMeters <= sB + dMeters;

    // Draw Photogates
    drawPhotogate(gateAX, gateAY, isVN ? "CỔNG A" : "GATE A", isCartAtGateA);
    drawPhotogate(gateBX, gateBY, isVN ? "CỔNG B" : "GATE B", isCartAtGateB);

    // Dimension line between Gate A and Gate B
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(gateAX - 50 * Math.sin(inclineRad), gateAY - 50 * Math.cos(inclineRad));
    ctx.lineTo(gateBX - 50 * Math.sin(inclineRad), gateBY - 50 * Math.cos(inclineRad));
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      `s = ${gateDistanceCm} cm (${(gateDistanceCm / 100).toFixed(2)} m)`,
      (gateAX + gateBX) / 2 - 60 * Math.sin(inclineRad),
      (gateAY + gateBY) / 2 - 60 * Math.cos(inclineRad)
    );

    // Draw Laboratory Cart (Xe trượt thông minh có cọc chắn sáng)
    const cartPxPos = Math.min(trackPxLen - 30, currentDistMeters * pxPerMeter);
    const cartCenterX = startX + cartPxPos * Math.cos(inclineRad);
    const cartCenterY = startY + cartPxPos * Math.sin(inclineRad);

    ctx.save();
    ctx.translate(cartCenterX, cartCenterY);
    ctx.rotate(inclineRad);

    // Cart Body (Khung xe nhôm)
    ctx.fillStyle = "#2563eb";
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 2;
    ctx.fillRect(-22, -18, 44, 12);
    ctx.strokeRect(-22, -18, 44, 12);

    // Shutter flag (Lá chắn sáng bề rộng d)
    ctx.fillStyle = "#f59e0b";
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 1.5;
    const flagW = Math.max(6, (shutterWidthMm / 20) * 10);
    ctx.fillRect(-flagW / 2, -38, flagW, 20);
    ctx.strokeRect(-flagW / 2, -38, flagW, 20);

    // Cart low-friction wheels
    ctx.fillStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.arc(-14, -6, 5, 0, Math.PI * 2);
    ctx.arc(14, -6, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // MC-964 Digital Chronometer Unit (Realistic Virtual Device)
    const timerW = 190;
    const timerH = 85;
    const timerX = w - timerW - 25;
    const timerY = 20;

    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.fillRect(timerX, timerY, timerW, timerH);
    ctx.strokeRect(timerX, timerY, timerW, timerH);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${isVN ? "ĐỒNG HỒ ĐO HIỆN SỐ" : "DIGITAL TIMER"} MC-964`, timerX + 10, timerY + 16);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "12px sans-serif";
    ctx.fillText(`${isVN ? "CHẾ ĐỘ" : "MODE"}: ${timerMode}`, timerX + 10, timerY + 30);

    // 7-segment green digital display
    ctx.fillStyle = "#052e16";
    ctx.fillRect(timerX + 10, timerY + 36, timerW - 20, 38);

    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 22px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${displayChronometer} s`, timerX + timerW / 2, timerY + 63);
  };

  const handleLaunchCart = () => {
    setSimTime(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSimTime(0);
  };

  return (
    <div className="simulation-page max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 mb-2">
              <Timer className="w-3.5 h-3.5" />
              <span>{isVN ? "Vật lí 10 • KNTT Bài 6 • CTST Bài 6" : "Physics 10 • KNTT Lesson 6 • CTST Lesson 6"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isVN ? simInfo.title : simInfo.titleEn}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {isVN
                ? "Thực hành phương án đo tốc độ tức thời và gia tốc trên máng nghiêng bằng Cổng quang điện và Đồng hồ hiện số MC-964. Khảo sát công thức v = d / Δt và hệ thức a = (vB² - vA²) / 2s."
                : "Practice measuring instantaneous velocity and acceleration using photogate sensors and MC-964 digital chronometer on an inclined track."}
            </p>
            <div className="mt-3">
              <SimulationVideoButton href="https://www.youtube.com/watch?v=dpihw-OiKYQ" />
            </div>
          </div>

          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="w-fit self-start sm:self-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{isVN ? "Luyện tập & Trắc nghiệm" : "Concept Quiz"}</span>
          </button>
        </div>

        {/* MC964 Timer Mode Switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 flex items-center mr-2">
            <Sliders className="w-3.5 h-3.5 mr-1 text-indigo-400" />
            {isVN ? "Chế độ đo MC-964:" : "Timer Mode:"}
          </span>

          <button
            onClick={() => {
              setTimerMode("MODE_A");
              handleReset();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              timerMode === "MODE_A"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-slate-800/70 text-slate-400 hover:text-white"
            }`}
          >
            {isVN ? "MODE A (Thời gian qua Cổng A: t_A)" : "MODE A (Gate A passage time: t_A)"}
          </button>

          <button
            onClick={() => {
              setTimerMode("MODE_B");
              handleReset();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              timerMode === "MODE_B"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-slate-800/70 text-slate-400 hover:text-white"
            }`}
          >
            {isVN ? "MODE B (Thời gian qua Cổng B: t_B)" : "MODE B (Gate B passage time: t_B)"}
          </button>

          <button
            onClick={() => {
              setTimerMode("MODE_AB");
              handleReset();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              timerMode === "MODE_AB"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-slate-800/70 text-slate-400 hover:text-white"
            }`}
          >
            {isVN ? "MODE A ↔ B (Thời gian giữa 2 cổng: t_AB)" : "MODE A ↔ B (Time between gates: t_AB)"}
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
                  <span>{isVN ? "Phòng thí nghiệm Cổng quang MC-964" : "Photogate MC-964 Lab View"}</span>
                </div>

                <button
                  onClick={handleLaunchCart}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isVN ? "Thả xe & Đo thời gian" : "Release & Measure"}</span>
                </button>
              </div>

              {/* Canvas Viewport */}
              <div className="w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 aspect-[16/10] relative">
                <canvas ref={canvasRef} width={760} height={460} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Measurement Data Table Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Table className="w-4 h-4 text-indigo-400" />
                  <span>{isVN ? "Bảng Nhật kí Đo thực nghiệm" : "Experimental Data Records"}</span>
                </h3>
                {dataLogs.length > 0 && (
                  <button
                    onClick={() => setDataLogs([])}
                    className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    {isVN ? "Xóa nhật kí" : "Clear Log"}
                  </button>
                )}
              </div>

              {dataLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/50 rounded-xl border border-slate-800">
                  {isVN
                    ? "Chưa có lượt đo nào. Nhấn «Thả xe & Đo thời gian» để thực hiện phép đo."
                    : "No data runs yet. Click 'Release & Measure' to record."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">{isVN ? "Lần" : "Run"}</th>
                        <th className="py-2.5 px-3">t_A (s)</th>
                        <th className="py-2.5 px-3">t_B (s)</th>
                        <th className="py-2.5 px-3">t_AB (s)</th>
                        <th className="py-2.5 px-3">v_A = d/t_A (m/s)</th>
                        <th className="py-2.5 px-3">v_B = d/t_B (m/s)</th>
                        <th className="py-2.5 px-3">a (m/s²)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {dataLogs.map((log) => (
                        <tr key={log.run} className="hover:bg-slate-800/30">
                          <td className="py-2 px-3 font-sans text-slate-400">#{log.run}</td>
                          <td className="py-2 px-3 text-indigo-300">{log.tA.toFixed(4)}</td>
                          <td className="py-2 px-3 text-sky-300">{log.tB.toFixed(4)}</td>
                          <td className="py-2 px-3 text-amber-300">{log.tAB.toFixed(4)}</td>
                          <td className="py-2 px-3 text-emerald-400 font-bold">{log.vA.toFixed(3)}</td>
                          <td className="py-2 px-3 text-emerald-300 font-bold">{log.vB.toFixed(3)}</td>
                          <td className="py-2 px-3 text-purple-300 font-bold">{log.a.toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Physical Principle Note */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1">
                <span className="font-bold text-amber-300 block">{isVN ? "Công thức cốt lõi (SGK KNTT &amp; CTST):" : "Core formulas (KNTT &amp; CTST textbooks):"}</span>
                <p className="text-slate-300">
                  • {isVN ? "Tốc độ tức thời tại cổng" : "Instantaneous speed at a gate"}: <strong className="text-emerald-400 font-mono">v = d / Δt</strong> ({isVN ? "d: bề rộng cọc chắn sáng" : "d: flag width"}).
                </p>
                <p className="text-slate-300">
                  • {isVN ? "Gia tốc chuyển động thẳng biến đổi đều" : "Uniform-acceleration relation"}:{" "}
                  <strong className="text-indigo-400 font-mono">a = (vB² - vA²) / (2s)</strong> hoặc{" "}
                  <strong className="text-indigo-400 font-mono">a = (vB - vA) / tAB</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Controls (1 Col) */}
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-indigo-400" />
                <span>{isVN ? "Thiết lập Dụng cụ Thí nghiệm" : "Apparatus Setup"}</span>
              </h2>

              {/* Gate Distance Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{isVN ? "Khoảng cách 2 cổng (s):" : "Gate Spacing (s):"}</span>
                  <span className="text-indigo-400 font-mono font-bold">{gateDistanceCm} cm</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={80}
                  step={5}
                  value={gateDistanceCm}
                  onChange={(e) => {
                    setGateDistanceCm(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Track Incline Angle */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{isVN ? "Góc nghiêng máng (α):" : "Incline Angle (α):"}</span>
                  <span className="text-amber-400 font-mono font-bold">{trackInclineDeg}°</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={20}
                  step={1}
                  value={trackInclineDeg}
                  onChange={(e) => {
                    setTrackInclineDeg(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Flag Shutter Width */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{isVN ? "Bề rộng lá chắn sáng (d):" : "Shutter Width (d):"}</span>
                  <span className="text-emerald-400 font-mono font-bold">{shutterWidthMm} mm</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={40}
                  step={5}
                  value={shutterWidthMm}
                  onChange={(e) => {
                    setShutterWidthMm(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>10 mm</span>
                  <span>{isVN ? "20 mm (Chuẩn)" : "20 mm (Standard)"}</span>
                  <span>40 mm</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <button
                  onClick={handleLaunchCart}
                  disabled={isRunning}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isVN ? "Thả xe" : "Release"}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Curriculum Reference Card */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>{isVN ? "Chuẩn SGK Đối chiếu" : "Curriculum Standard"}</span>
              </div>
              <p className="text-xs text-slate-400">
                • <strong>KNTT:</strong> {isVN ? "Bài 6: Thực hành đo tốc độ của vật chuyển động (Trang 31-33)" : "Lesson 6: Measuring the speed of a moving object (pp. 31–33)"}
              </p>
              <p className="text-xs text-slate-400">
                • <strong>CTST:</strong> {isVN ? "Bài 6: Thực hành đo tốc độ của vật chuyển động (Trang 36-39)" : "Lesson 6: Measuring the speed of a moving object (pp. 36–39)"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
