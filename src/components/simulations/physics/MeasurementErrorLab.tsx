import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  HelpCircle,
  Scale,
  Gauge,
  Layers,
  Sparkles,
  CheckCircle2,
  Table,
  Wind
} from "lucide-react";

export default function MeasurementErrorLab() {
  const simId = "measurement-error";
  const simInfo = simulationsData.find((s) => s.id === simId) || {
    id: "measurement-error",
    title: "Sai số thực nghiệm & Thí nghiệm Tháp nghiêng Pisa",
    titleEn: "Experimental Uncertainty & Pisa Tower Drop Lab",
    topic: "Sai số dụng cụ, sai số ngẫu nhiên, phương pháp thực nghiệm Galilei",
    topicEn: "Instrumental error, random uncertainty, Galileo experimental method"
  };

  const { recordEvent, language, t } = useAppProgress();
  const isVN = language === "VN";

  // Tab mode: 'pisa' (Galileo vs Aristotle) or 'inclined-error' (Steel ball inclined track uncertainty) or 'caliper' (Vernier Caliper)
  const [activeTab, setActiveTab] = useState<"pisa" | "inclined-error" | "caliper">("pisa");
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  // --- Mode 1: Galileo Tower of Pisa ---
  const [m1, setM1] = useState<number>(10); // kg (Heavy cannonball)
  const [m2, setM2] = useState<number>(1); // kg (Light sphere or wooden ball)
  const [airResistance, setAirResistance] = useState<boolean>(false);
  const [pisaHeight, setPisaHeight] = useState<number>(54); // meters (Pisa height)
  const [pisaTime, setPisaTime] = useState<number>(0);
  const [isPisaPlaying, setIsPisaPlaying] = useState<boolean>(false);

  // --- Mode 2: Steel Ball Inclined Track Uncertainty (Bài 3) ---
  const [trackLength, setTrackLength] = useState<number>(0.8); // 80 cm = 0.8m
  const [trackAngle, setTrackAngle] = useState<number>(10); // degrees
  const [instrumentError, setInstrumentError] = useState<number>(0.001); // 0.001s
  const [recordedTimes, setRecordedTimes] = useState<number[]>([1.328, 1.332, 1.325, 1.330, 1.329]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [rollTime, setRollTime] = useState<number>(0);

  // --- Mode 3: Vernier Caliper (Thước kẹp 0.02mm) ---
  const [caliperValue, setCaliperValue] = useState<number>(24.64); // mm

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    recordEvent({
      type: "simulation_started",
      simulationId: simId,
      topic: simInfo.topic
    });
  }, []);

  // Mode 1 calculations
  const g = 9.8;
  const rollingAccelerationFactor = 5 / 7; // solid sphere rolling without slipping
  const theoreticalFallTime = Math.sqrt((2 * pisaHeight) / g);

  // Mode 2 calculations
  const avgTime =
    recordedTimes.length > 0
      ? recordedTimes.reduce((a, b) => a + b, 0) / recordedTimes.length
      : 0;

  const deltaTimes = recordedTimes.map((t) => Math.abs(t - avgTime));
  const avgDeltaTime =
    deltaTimes.length > 0
      ? deltaTimes.reduce((a, b) => a + b, 0) / deltaTimes.length
      : 0;

  const totalTimeError = avgDeltaTime + instrumentError;
  const relativeTimeErrorPct = avgTime > 0 ? (totalTimeError / avgTime) * 100 : 0;

  const distanceError = 0.001; // 1 mm = 0.001m
  const relativeDistErrorPct = (distanceError / trackLength) * 100;

  const avgVelocity = avgTime > 0 ? trackLength / avgTime : 0;
  const totalVelocityRelativeErrorPct = relativeDistErrorPct + relativeTimeErrorPct;
  const deltaVelocity = (avgVelocity * totalVelocityRelativeErrorPct) / 100;

  // Animation Loop
  useEffect(() => {
    let lastTimestamp = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (activeTab === "pisa" && isPisaPlaying) {
        setPisaTime((prev) => {
          const next = prev + dt;
          if (next >= theoreticalFallTime + (airResistance ? 0.8 : 0.05)) {
            setIsPisaPlaying(false);
            return theoreticalFallTime + (airResistance ? 0.8 : 0.05);
          }
          return next;
        });
      }

      if (activeTab === "inclined-error" && isRolling) {
      const expectedTime = Math.sqrt((2 * trackLength) / (g * Math.sin((trackAngle * Math.PI) / 180) * rollingAccelerationFactor));
        setRollTime((prev) => {
          const next = prev + dt;
          if (next >= expectedTime) {
            setIsRolling(false);
            // Add a realistic measured value with small random Gaussian fluctuation
            const randomJitter = (Math.random() - 0.5) * 0.008;
            const newMeasurement = Number((expectedTime + randomJitter).toFixed(3));
            setRecordedTimes((current) => [...current.slice(-6), newMeasurement]);
            return expectedTime;
          }
          return next;
        });
      }

      // Draw Canvas
      drawCanvas();
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [activeTab, isPisaPlaying, isRolling, pisaTime, rollTime, airResistance, m1, m2, trackAngle, trackLength, caliperValue]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (activeTab === "pisa") {
      drawPisaScene(ctx, canvas.width, canvas.height);
    } else if (activeTab === "inclined-error") {
      drawInclinedTrackScene(ctx, canvas.width, canvas.height);
    } else if (activeTab === "caliper") {
      drawVernierCaliperScene(ctx, canvas.width, canvas.height);
    }
  };

  // --- Mode 1 Canvas: Leaning Tower of Pisa ---
  const drawPisaScene = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Sky background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, "#0f172a");
    bgGrad.addColorStop(1, "#1e293b");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const groundY = h - 45;

    // Ground
    ctx.fillStyle = "#334155";
    ctx.fillRect(0, groundY, w, 45);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(0, groundY, w, 4);

    // Tower base coordinates
    const towerX = 140;
    const towerTopY = 60;
    const towerW = 65;
    const towerH = groundY - towerTopY;

    // Leaning Tower of Pisa (Tilted architectural tower)
    ctx.save();
    ctx.translate(towerX, groundY);
    ctx.rotate(-0.07); // ~4 degree tilt

    // Draw tiers of the tower
    const tiers = 7;
    const tierH = towerH / tiers;
    for (let i = 0; i < tiers; i++) {
      const yTier = -towerH + i * tierH;
      ctx.fillStyle = i % 2 === 0 ? "#e2e8f0" : "#cbd5e1";
      ctx.fillRect(-towerW / 2, yTier, towerW, tierH - 2);

      // Classical arches
      ctx.fillStyle = "#475569";
      for (let arc = -towerW / 2 + 8; arc < towerW / 2 - 8; arc += 14) {
        ctx.beginPath();
        ctx.arc(arc + 5, yTier + tierH / 2, 4, Math.PI, 0);
        ctx.rect(arc + 1, yTier + tierH / 2, 8, tierH / 2 - 4);
        ctx.fill();
      }
    }

    // Top gallery & balcony where Galileo stands
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(-towerW / 2 - 6, -towerH - 8, towerW + 12, 8);

    // Galileo figure
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(towerW / 2 + 2, -towerH - 16, 5, 0, Math.PI * 2); // head
    ctx.fill();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(towerW / 2 + 2, -towerH - 11);
    ctx.lineTo(towerW / 2 + 2, -towerH);
    ctx.stroke();

    ctx.restore();

    // Falling Objects calculation
    const dropStartX1 = towerX + 75;
    const dropStartX2 = towerX + 130;
    const dropStartY = towerTopY + 10;
    const totalFallPx = groundY - dropStartY - 15;

    // Ball 1 (Heavy: 10kg)
    const k1 = airResistance ? 0.008 : 0;
    const effectiveG1 = airResistance ? g * (1 - (k1 / m1) * (pisaTime * g)) : g;
    const y1_norm = Math.min(1, (0.5 * Math.max(0, effectiveG1) * pisaTime * pisaTime) / pisaHeight);
    const ball1Y = dropStartY + y1_norm * totalFallPx;

    // Ball 2 (Light: 1kg or leaf)
    const k2 = airResistance ? 0.18 : 0;
    const dragRatio2 = Math.min(0.85, (k2 / m2) * pisaTime * 1.5);
    const effectiveG2 = airResistance ? g * (1 - dragRatio2) : g;
    const y2_norm = Math.min(1, (0.5 * Math.max(0, effectiveG2) * pisaTime * pisaTime) / pisaHeight);
    const ball2Y = dropStartY + y2_norm * totalFallPx;

    // Draw Drop Guides
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(dropStartX1, dropStartY);
    ctx.lineTo(dropStartX1, groundY);
    ctx.moveTo(dropStartX2, dropStartY);
    ctx.lineTo(dropStartX2, groundY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Ball 1 (Heavy Iron Ball - Indigo)
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    ctx.arc(dropStartX1, ball1Y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#c7d2fe";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${m1}kg`, dropStartX1, ball1Y + 4);

    // Draw Ball 2 (Lighter Ball - Amber / Emerald)
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(dropStartX2, ball2Y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fde68a";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText(`${m2}kg`, dropStartX2, ball2Y + 3);

    // Height & Timer overlay labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(isVN ? `Độ cao tháp: h = ${pisaHeight} m` : `Tower height: h = ${pisaHeight} m`, 20, 30);
    ctx.fillText(
      isVN
        ? `Môi trường: ${airResistance ? "Khí quyển (Có lực cản Fc)" : "Chân không (Bỏ qua lực cản)"}`
        : `Environment: ${airResistance ? "Air (With Drag)" : "Vacuum (Zero Drag)"}`,
      20,
      48
    );

    // Fall Time Live Counter
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "right";
    ctx.fillText(`t = ${pisaTime.toFixed(3)} s`, w - 25, 35);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(
      isVN ? `Lí thuyết: t = sqrt(2h/g) = ${theoreticalFallTime.toFixed(3)} s` : `Theory: t = sqrt(2h/g) = ${theoreticalFallTime.toFixed(3)} s`,
      w - 25,
      55
    );
  };

  // --- Mode 2 Canvas: Inclined Track & Photogate Uncertainty ---
  const drawInclinedTrackScene = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Dark background
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);

    const startX = 60;
    const startY = 120;
    const lengthPx = w - 180;
    const rad = (trackAngle * Math.PI) / 180;
    const endX = startX + lengthPx * Math.cos(rad);
    const endY = startY + lengthPx * Math.sin(rad);

    // Track stand / support pillar
    ctx.fillStyle = "#334155";
    ctx.fillRect(startX - 15, startY - 10, 15, h - startY - 20);

    // Inclined Track (Máng nghiêng hợp kim nhôm)
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

    // Centimeter Ruler Markings on track
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;
    for (let f = 0; f <= 1; f += 0.1) {
      const markX = startX + f * (endX - startX);
      const markY = startY + f * (endY - startY) - 6;
      ctx.beginPath();
      ctx.moveTo(markX, markY);
      ctx.lineTo(markX - 4 * Math.sin(rad), markY - 4 * Math.cos(rad));
      ctx.stroke();
    }

    // Photogates at Start (Cổng A) and End (Cổng B)
    const drawPhotogate = (gx: number, gy: number, label: string) => {
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 2;
      ctx.fillRect(gx - 8, gy - 35, 16, 32);
      ctx.strokeRect(gx - 8, gy - 35, 16, 32);

      // Red Infrared Beam
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(gx, gy - 28);
      ctx.lineTo(gx, gy - 8);
      ctx.stroke();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, gx, gy - 40);
    };

    const gateAX = startX + 0.1 * (endX - startX);
    const gateAY = startY + 0.1 * (endY - startY);
    const gateBX = startX + 0.9 * (endX - startX);
    const gateBY = startY + 0.9 * (endY - startY);

    drawPhotogate(gateAX, gateAY, "Cổng A");
    drawPhotogate(gateBX, gateBY, "Cổng B");

    // Distance dimension line between Gates
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(gateAX, gateAY - 55);
    ctx.lineTo(gateBX, gateBY - 55);
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`s = ${trackLength} m +/- 0.001 m`, (gateAX + gateBX) / 2, (gateAY + gateBY) / 2 - 62);

    // Steel Ball Rolling on Track
    const totalExpectedTime = Math.sqrt((2 * trackLength) / (g * Math.sin(rad) * rollingAccelerationFactor)) || 1;
    const progress = isRolling ? Math.min(1, rollTime / totalExpectedTime) : 0;
    const ballPosDist = 0.1 + progress * 0.8;
    const ballX = startX + ballPosDist * (endX - startX);
    const ballY = startY + ballPosDist * (endY - startY) - 13;

    // Ball gradient
    const ballGrad = ctx.createRadialGradient(ballX - 3, ballY - 3, 2, ballX, ballY, 11);
    ballGrad.addColorStop(0, "#f8fafc");
    ballGrad.addColorStop(0.5, "#94a3b8");
    ballGrad.addColorStop(1, "#334155");
    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // MC-964 Digital Chronometer Display Unit (Mockup UI)
    const timerW = 160;
    const timerH = 65;
    const timerX = w - timerW - 25;
    const timerY = 20;

    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.fillRect(timerX, timerY, timerW, timerH);
    ctx.strokeRect(timerX, timerY, timerW, timerH);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${isVN ? "ĐỒNG HỒ SỐ" : "DIGITAL TIMER"} MC-964`, timerX + 10, timerY + 16);

    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${rollTime.toFixed(3)} s`, timerX + timerW / 2, timerY + 45);
  };

  // --- Mode 3 Canvas: Vernier Caliper (Thước kẹp 0.02 mm) ---
  const drawVernierCaliperScene = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = "#0a0f1d";
    ctx.fillRect(0, 0, w, h);

    const originX = 60;
    const originY = 80;
    const mainScaleLen = w - 120;
    const mmScale = 6; // 6px = 1mm

    // Main Steel Bar (Thân thước chính)
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(originX, originY, mainScaleLen, 50);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.strokeRect(originX, originY, mainScaleLen, 50);

    // Fixed Jaw (Hàm kẹp cố định)
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX - 35, originY);
    ctx.lineTo(originX - 35, originY + 120);
    ctx.lineTo(originX, originY + 90);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Main Scale Graduations (0mm to 100mm)
    ctx.fillStyle = "#1e293b";
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1.2;
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";

    for (let mm = 0; mm <= 80; mm++) {
      const x = originX + mm * mmScale;
      if (x > originX + mainScaleLen - 10) break;

      const isCm = mm % 10 === 0;
      const is5mm = mm % 5 === 0;
      const lineLen = isCm ? 18 : is5mm ? 12 : 7;

      ctx.beginPath();
      ctx.moveTo(x, originY + 50);
      ctx.lineTo(x, originY + 50 - lineLen);
      ctx.stroke();

      if (isCm) {
        ctx.fillText(`${mm / 10}`, x, originY + 24);
      }
    }

    // Sliding Vernier (Du xích trượt)
    const vernierPosPx = originX + caliperValue * mmScale;
    const vernierW = 180;

    // Sliding Jaw
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(vernierPosPx, originY + 45, vernierW, 45);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.strokeRect(vernierPosPx, originY + 45, vernierW, 45);

    // Vernier Moving Jaw
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.moveTo(vernierPosPx, originY + 45);
    ctx.lineTo(vernierPosPx - 35, originY + 45);
    ctx.lineTo(vernierPosPx - 35, originY + 120);
    ctx.lineTo(vernierPosPx, originY + 90);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Vernier 50-division graduations (0.02 mm precision: 50 divisions span 49mm)
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 1.2;
    ctx.font = "12px sans-serif";
    for (let div = 0; div <= 10; div++) {
      // 10 main markers on vernier (each is 5 sub-divisions = 0.1 mm)
      const vX = vernierPosPx + div * 5 * (49 / 50) * mmScale;
      ctx.beginPath();
      ctx.moveTo(vX, originY + 45);
      ctx.lineTo(vX, originY + 45 + 14);
      ctx.stroke();

      ctx.fillStyle = "#dc2626";
      ctx.fillText(`${div}`, vX, originY + 72);
    }

    // Measured Object clamped in jaws
    const objectW = caliperValue * mmScale;
    if (objectW > 0) {
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(originX - 35, originY + 45, objectW, 40);
      ctx.strokeStyle = "#d97706";
      ctx.strokeRect(originX - 35, originY + 45, objectW, 40);
      ctx.fillStyle = "#000000";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(isVN ? "Vật đo" : "Specimen", originX - 35 + objectW / 2, originY + 68);
    }

    // Digital Readout Banner
    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    ctx.fillRect(w / 2 - 140, h - 75, 280, 55);
    ctx.strokeRect(w / 2 - 140, h - 75, 280, 55);

    ctx.fillStyle = "#a5b4fc";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(isVN ? "KẾT QUẢ ĐỌC THƯỚC KẸP (ĐCNN = 0,02 mm)" : "VERNIER CALIPER READING", w / 2, h - 55);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 20px monospace";
    ctx.fillText(`d = ${caliperValue.toFixed(2)} mm +/- 0.02 mm`, w / 2, h - 30);
  };

  const handlePisaLaunch = () => {
    setPisaTime(0);
    setIsPisaPlaying(true);
  };

  const handleRollTrack = () => {
    setRollTime(0);
    setIsRolling(true);
  };

  return (
    <div className="simulation-page max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>Vật lí 10 • KNTT Bài 1 &amp; Bài 3 • CTST Bài 1 &amp; Bài 3</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isVN ? simInfo.title : simInfo.titleEn}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {isVN
                ? "Khảo sát thực nghiệm sự rơi của Galilei tại Tháp Pisa, phương pháp xử lí sai số thực nghiệm với máng nghiêng & đồng hồ hiện số MC964, và kĩ thuật đọc thước kẹp chuẩn xác."
                : "Explore Galileo's Pisa tower drop verification, experimental uncertainty propagation with digital timer on inclined tracks, and vernier caliper readings."}
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

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab("pisa")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === "pisa"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-slate-800/70 text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isVN ? "1. Tháp Pisa (Galilei vs Aristotle)" : "1. Galileo Pisa Drop"}</span>
          </button>

          <button
            onClick={() => setActiveTab("inclined-error")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === "inclined-error"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-slate-800/70 text-slate-400 hover:text-white"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>{isVN ? "2. Máng nghiêng & Tính sai số (Bài 3)" : "2. Uncertainty & Inclined Track"}</span>
          </button>

          <button
            onClick={() => setActiveTab("caliper")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === "caliper"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-slate-800/70 text-slate-400 hover:text-white"
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{isVN ? "3. Thước kẹp du xích (0.02 mm)" : "3. Vernier Caliper"}</span>
          </button>
        </div>
      </div>

      {showQuiz ? (
        <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visualizer Canvas (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span>
                    {activeTab === "pisa"
                      ? isVN ? "Mô phỏng 2D Tháp nghiêng Pisa" : "2D Pisa Experiment"
                      : activeTab === "inclined-error"
                      ? isVN ? "Máng nghiêng & Đồng hồ đo MC-964" : "Inclined Track & Chronometer"
                      : isVN ? "Thước kẹp cơ khí" : "Vernier Caliper"}
                  </span>
                </div>

                {activeTab === "pisa" && (
                  <button
                    onClick={handlePisaLaunch}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isVN ? "Thả rơi từ tháp" : "Drop from tower"}</span>
                  </button>
                )}

                {activeTab === "inclined-error" && (
                  <button
                    onClick={handleRollTrack}
                    disabled={isRolling}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isVN ? "Đo lần tiếp theo" : "Take New Measure"}</span>
                  </button>
                )}
              </div>

              {/* Canvas Viewport */}
              <div className="w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 aspect-[16/10] relative">
                <canvas ref={canvasRef} width={760} height={460} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Bottom Real-Time Analytics & Formula Card */}
            {activeTab === "pisa" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isVN ? "Bản chất Vật lí & Kết luận của Galilei" : "Galileo's Insight & Physical Principle"}</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isVN
                    ? "Galilei đã bác bỏ luận điểm của Aristotle («Vật nặng rơi nhanh hơn vật nhẹ»). Trong môi trường chân không (không có lực cản Fc), mọi vật đều rơi tự do với cùng gia tốc trọng trường g, do đó thời gian rơi t = √(2h/g) hoàn toàn không phụ thuộc vào khối lượng m."
                    : "Galileo disproved Aristotle's intuitive assumption. In a vacuum with zero aerodynamic drag, all objects experience identical gravitational acceleration g, so fall time t = √(2h/g) is independent of mass."}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                    <span className="text-slate-400 block mb-1">Gia tốc trọng trường g:</span>
                    <span className="text-emerald-400 font-bold font-mono">9.80 m/s²</span>
                  </div>
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                    <span className="text-slate-400 block mb-1">Thời gian rơi lí thuyết:</span>
                    <span className="text-indigo-300 font-bold font-mono">{theoreticalFallTime.toFixed(3)} s</span>
                  </div>
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block mb-1">Vận tốc chạm đất:</span>
                    <span className="text-sky-300 font-bold font-mono">
                      {(g * theoreticalFallTime).toFixed(2)} m/s ({(g * theoreticalFallTime * 3.6).toFixed(1)} km/h)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "inclined-error" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Table className="w-4 h-4 text-indigo-400" />
                    <span>{isVN ? "Bảng số liệu & Xử lí sai số (SGK KNTT & CTST)" : "Experimental Error Processing Table"}</span>
                  </h3>
                  <button
                    onClick={() => setRecordedTimes([1.328, 1.332, 1.325, 1.330, 1.329])}
                    className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    {isVN ? "Đặt lại số liệu" : "Reset Data"}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Lần đo</th>
                        <th className="py-2.5 px-3">t (s)</th>
                        <th className="py-2.5 px-3">Δt = |t - t̄| (s)</th>
                        <th className="py-2.5 px-3">s (m)</th>
                        <th className="py-2.5 px-3">v = s/t (m/s)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {recordedTimes.map((tVal, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="py-2 px-3 font-sans text-slate-400">Lần {idx + 1}</td>
                          <td className="py-2 px-3 text-indigo-300 font-bold">{tVal.toFixed(3)}</td>
                          <td className="py-2 px-3 text-slate-400">{Math.abs(tVal - avgTime).toFixed(3)}</td>
                          <td className="py-2 px-3">{trackLength.toFixed(3)}</td>
                          <td className="py-2 px-3 text-emerald-400">{(trackLength / tVal).toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Statistical Summary Calculations */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                    <span className="text-slate-400 block mb-1">Thời gian trung bình t̄:</span>
                    <span className="text-indigo-300 font-mono font-bold">{avgTime.toFixed(3)} s</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Δt = {totalTimeError.toFixed(3)} s (δt = {relativeTimeErrorPct.toFixed(2)}%)
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                    <span className="text-slate-400 block mb-1">Vận tốc trung bình v̄:</span>
                    <span className="text-emerald-300 font-mono font-bold">{avgVelocity.toFixed(3)} m/s</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      δv = δs + δt = {totalVelocityRelativeErrorPct.toFixed(2)}%
                    </span>
                  </div>

                  <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-xl">
                    <span className="text-indigo-300 font-semibold block mb-1">Ghi kết quả đo v:</span>
                    <span className="text-amber-300 font-mono font-bold text-sm block">
                      v = {avgVelocity.toFixed(3)} ± {deltaVelocity.toFixed(3)} m/s
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Control Panel (1 Col) */}
          <div className="space-y-5">
            {activeTab === "pisa" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Gauge className="w-4 h-4 text-indigo-400" />
                  <span>{isVN ? "Thông số Tháp Pisa" : "Pisa Parameters"}</span>
                </h2>

                {/* Air Resistance Switch */}
                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      {isVN ? "Lực cản không khí (Fc)" : "Air Drag"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {airResistance ? (isVN ? "Bật (Khí quyển)" : "ON (Air)") : (isVN ? "Tắt (Chân không)" : "OFF (Vacuum)")}
                    </span>
                  </div>
                  <button
                    onClick={() => setAirResistance(!airResistance)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      airResistance ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"
                    }`}
                  >
                    {airResistance ? (isVN ? "Khí quyển" : "Air") : (isVN ? "Chân không" : "Vacuum")}
                  </button>
                </div>

                {/* Mass 1 Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{isVN ? "Khối lượng vật 1 (m₁):" : "Mass 1 (m₁):"}</span>
                    <span className="text-indigo-400 font-mono font-bold">{m1} kg</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={1}
                    value={m1}
                    onChange={(e) => setM1(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Mass 2 Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{isVN ? "Khối lượng vật 2 (m₂):" : "Mass 2 (m₂):"}</span>
                    <span className="text-amber-400 font-mono font-bold">{m2} kg</span>
                  </div>
                  <input
                    type="range"
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={m2}
                    onChange={(e) => setM2(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Tower Height */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{isVN ? "Độ cao đỉnh tháp (h):" : "Tower Height (h):"}</span>
                    <span className="text-sky-400 font-mono font-bold">{pisaHeight} m</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={80}
                    step={2}
                    value={pisaHeight}
                    onChange={(e) => setPisaHeight(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800 flex gap-2">
                  <button
                    onClick={handlePisaLaunch}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isVN ? "Thả rơi" : "Drop"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setPisaTime(0);
                      setIsPisaPlaying(false);
                    }}
                    className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "inclined-error" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Gauge className="w-4 h-4 text-indigo-400" />
                  <span>{isVN ? "Cấu hình Máng nghiêng" : "Inclined Track Settings"}</span>
                </h2>

                {/* Track Distance Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{isVN ? "Khoảng cách giữa 2 cổng s:" : "Distance s:"}</span>
                    <span className="text-indigo-400 font-mono font-bold">{trackLength.toFixed(2)} m</span>
                  </div>
                  <input
                    type="range"
                    min={0.4}
                    max={1.2}
                    step={0.05}
                    value={trackLength}
                    onChange={(e) => setTrackLength(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Angle Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{isVN ? "Góc nghiêng máng (α):" : "Incline angle (α):"}</span>
                    <span className="text-amber-400 font-mono font-bold">{trackAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={trackAngle}
                    onChange={(e) => setTrackAngle(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Instrument Uncertainty */}
                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-slate-200 block">
                    {isVN ? "Sai số dụng cụ đo:" : "Instrument Uncertainty:"}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    • Thước đo chiều dài: <span className="text-indigo-300 font-mono">Δs_dc = 1 mm = 0.001 m</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    • Đồng hồ MC-964: <span className="text-sky-300 font-mono">Δt_dc = 0.001 s</span>
                  </p>
                </div>

                <button
                  onClick={handleRollTrack}
                  disabled={isRolling}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isVN ? "Thả viên bi & Ghi số liệu" : "Roll Ball & Record"}</span>
                </button>
              </div>
            )}

            {activeTab === "caliper" && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Gauge className="w-4 h-4 text-indigo-400" />
                  <span>{isVN ? "Kẹp chi tiết cơ khí" : "Vernier Adjustment"}</span>
                </h2>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{isVN ? "Kích thước vật kẹp (d):" : "Clamped Object (d):"}</span>
                    <span className="text-indigo-400 font-mono font-bold">{caliperValue.toFixed(2)} mm</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={65}
                    step={0.02}
                    value={caliperValue}
                    onChange={(e) => setCaliperValue(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-amber-300 block">Quy tắc đọc Thước kẹp:</span>
                  <p className="text-slate-300 leading-relaxed">
                    1. <strong className="text-indigo-300">Phần nguyên:</strong> Đọc vạch milimét trên thân thước chính nằm ngay bên trái vạch số 0 của du xích (vd: <strong>{Math.floor(caliperValue)} mm</strong>).
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    2. <strong className="text-emerald-300">Phần thập phân:</strong> Tìm vạch trên du xích trùng khít với 1 vạch bất kì trên thân chính: nhân số thứ tự vạch với ĐCNN (0.02 mm) (vd: <strong>{(caliperValue - Math.floor(caliperValue)).toFixed(2)} mm</strong>).
                  </p>
                </div>
              </div>
            )}

            {/* Curriculum Reference Badge */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>{isVN ? "Chuẩn SGK Đối chiếu" : "Curriculum Standard"}</span>
              </div>
              <p className="text-xs text-slate-400">
                • <strong>KNTT:</strong> Bài 1 (tr. 7-11), Bài 3 (tr. 17-21)
              </p>
              <p className="text-xs text-slate-400">
                • <strong>CTST:</strong> Bài 1 (tr. 6-10), Bài 3 (tr. 18-23)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
