import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";

export default function WaveInterference() {
  const simId = "wave-interference";
  const simInfo = simulationsData.find(s => s.id === simId)!;
  const { language } = useAppProgress();
  const isVN = language === "VN";

  const [freq1, setFreq1] = useState(2);
  const [amp1, setAmp1] = useState(50);
  const [freq2, setFreq2] = useState(2);
  const [amp2, setAmp2] = useState(50);
  const [phaseDiff, setPhaseDiff] = useState(0); // in degrees
  const [showQuiz, setShowQuiz] = useState(false);
  const [time, setTime] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let lastTime: number;
    const loop = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = (currentTime - lastTime) / 1000;
      setTime(t => t + deltaTime);
      lastTime = currentTime;
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const w = canvas.width;
    const h = canvas.height;
    const midY = h / 2;
    
    // Draw Center Line
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.stroke();

    const phaseRad = (phaseDiff * Math.PI) / 180;
    const waveSpeed = 1; // m/s; x-axis represents 0.02 m per pixel
    const metersPerPixel = 0.02;
    const angularFrequency = (frequency: number) => 2 * Math.PI * frequency;
    const waveNumber = (frequency: number) => angularFrequency(frequency) / waveSpeed;

    // Draw combined wave
    ctx.beginPath();
    for(let x = 0; x < w; x++) {
      // Physical wave equation: y = A sin(kx - ωt + φ), with v = ω/k.
      const xMeters = x * metersPerPixel;
      const y1 = amp1 * Math.sin(waveNumber(freq1) * xMeters - angularFrequency(freq1) * time);
      const y2 = amp2 * Math.sin(waveNumber(freq2) * xMeters - angularFrequency(freq2) * time + phaseRad);
      
      const ySum = y1 + y2;
      
      if(x === 0) ctx.moveTo(x, midY - ySum);
      else ctx.lineTo(x, midY - ySum);
    }
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Wave 1 (faded)
    ctx.beginPath();
    for(let x = 0; x < w; x+=4) {
      const y1 = amp1 * Math.sin(waveNumber(freq1) * x * metersPerPixel - angularFrequency(freq1) * time);
      if(x === 0) ctx.moveTo(x, midY - y1);
      else ctx.lineTo(x, midY - y1);
    }
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw Wave 2 (faded)
    ctx.beginPath();
    for(let x = 0; x < w; x+=4) {
      const y2 = amp2 * Math.sin(waveNumber(freq2) * x * metersPerPixel - angularFrequency(freq2) * time + phaseRad);
      if(x === 0) ctx.moveTo(x, midY - y2);
      else ctx.lineTo(x, midY - y2);
    }
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 1.5;
    ctx.stroke();

  }, [freq1, amp1, freq2, amp2, phaseDiff, time]);

  // Determine interference type
  let interferenceType = isVN ? "Giao thoa phức hợp" : "Complex";
  if (freq1 === freq2) {
    if (phaseDiff === 0 || phaseDiff === 360) {
      interferenceType = isVN ? "Cực đại giao thoa (Đồng pha)" : "Fully Constructive";
    } else if (phaseDiff === 180) {
      interferenceType = amp1 === amp2 
        ? (isVN ? "Cực tiểu giao thoa (Triệt tiêu hoàn toàn)" : "Fully Destructive (Cancellation)")
        : (isVN ? "Giao thoa triệt tiêu một phần" : "Partially Destructive");
    }
  }

  return (
    <div className="simulation-page h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{isVN ? simInfo.title : simInfo.titleEn}</h1>
          <p className="text-slate-400 text-sm">{isVN ? simInfo.description : simInfo.descriptionEn}</p>
        </div>
        <button 
          onClick={() => setShowQuiz(true)}
          className="w-fit bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm cursor-pointer"
        >
          {isVN ? "Kiểm tra kiến thức" : "Take Quiz"}
        </button>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col relative">
          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 z-10 flex space-x-4">
             <div className="flex items-center"><span className="w-3 h-3 bg-indigo-400 rounded-full mr-2"></span> {isVN ? "Sóng 1" : "Wave 1"}</div>
             <div className="flex items-center"><span className="w-3 h-3 bg-rose-400 rounded-full mr-2"></span> {isVN ? "Sóng 2" : "Wave 2"}</div>
             <div className="flex items-center"><span className="w-3 h-3 bg-white rounded-full mr-2"></span> {isVN ? "Giao thoa tổng hợp" : "Superposition"}</div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 text-center z-10">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
              interferenceType.includes('Cực đại') || interferenceType.includes('Constructive') ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 
              interferenceType.includes('Cực tiểu') || interferenceType.includes('Destructive') ? 'bg-rose-500/20 text-rose-400 border-rose-500/50' : 
              'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              {interferenceType}
            </span>
          </div>

          <div className="flex-1 w-full relative">
            <canvas ref={canvasRef} width={800} height={400} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto pr-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-6">{isVN ? "Sóng 1 (Xanh dương)" : "Wave 1 (Blue)"}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium text-slate-400">{isVN ? "Tần số f₁" : "Frequency"}</label>
                  <span className="text-xs font-mono text-indigo-400">{freq1} Hz</span>
                </div>
                <input type="range" min="0.5" max="5" step="0.1" value={freq1} onChange={(e) => setFreq1(Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium text-slate-400">{isVN ? "Biên độ A₁" : "Amplitude"}</label>
                  <span className="text-xs font-mono text-indigo-400">{amp1}</span>
                </div>
                <input type="range" min="10" max="100" value={amp1} onChange={(e) => setAmp1(Number(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-6">{isVN ? "Sóng 2 (Đỏ hồng)" : "Wave 2 (Red)"}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium text-slate-400">{isVN ? "Tần số f₂" : "Frequency"}</label>
                  <span className="text-xs font-mono text-rose-400">{freq2} Hz</span>
                </div>
                <input type="range" min="0.5" max="5" step="0.1" value={freq2} onChange={(e) => setFreq2(Number(e.target.value))} className="w-full accent-rose-500 cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium text-slate-400">{isVN ? "Biên độ A₂" : "Amplitude"}</label>
                  <span className="text-xs font-mono text-rose-400">{amp2}</span>
                </div>
                <input type="range" min="10" max="100" value={amp2} onChange={(e) => setAmp2(Number(e.target.value))} className="w-full accent-rose-500 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-4">{isVN ? "Góc lệch pha (Δφ)" : "Phase & Alignment"}</h3>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-medium text-slate-400">{isVN ? "Hiệu số pha" : "Phase Difference"} (Δφ)</label>
                <span className="text-xs font-mono text-emerald-400">{phaseDiff}°</span>
              </div>
              <input type="range" min="0" max="360" value={phaseDiff} onChange={(e) => setPhaseDiff(Number(e.target.value))} className="w-full accent-emerald-500 cursor-pointer" />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>{isVN ? "Cùng pha (0°)" : "In Phase (0°)"}</span>
                <span>{isVN ? "Ngược pha (180°)" : "Anti-Phase (180°)"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
