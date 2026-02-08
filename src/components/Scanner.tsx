import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Zap, Activity } from 'lucide-react';
import { identifyGrail } from '../services/geminiService';
import { emitToastShow, emitAchievement } from '../eventBus';
import { SCAN_STATUS_MESSAGES } from '../constants';
import { ScannerHUD } from './ScannerHUD';
import { ForensicReportPanel } from './ForensicReportPanel';
import type { IdentificationResult } from '../types';

export interface ScannerProps {
  onResult: (r: IdentificationResult) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onResult }) => {
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusIdx, setScanStatusIdx] = useState(0);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [cameraMode, setCameraMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup media stream on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Progress bar
  useEffect(() => {
    if (!scanning) {
      setScanProgress(0);
      return;
    }
    const interval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [scanning]);

  // Status cycling
  useEffect(() => {
    if (!scanning) {
      setScanStatusIdx(0);
      return;
    }
    const interval = setInterval(
      () => setScanStatusIdx((i) => (i + 1) % SCAN_STATUS_MESSAGES.length),
      1500
    );
    return () => clearInterval(interval);
  }, [scanning]);

  const doScan = async (base64: string) => {
    setScanning(true);
    setResult(null);
    try {
      const data = await identifyGrail(base64);
      setResult(data);
      onResult(data);
      if (data.isAuthentic && data.confidence > 0.8) emitAchievement(data.name);
    } catch {
      emitToastShow({
        variant: 'error',
        title: 'Scan Failed',
        message: 'Intelligence network error.',
      });
    } finally {
      setScanning(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      emitToastShow({ variant: 'error', title: 'Too Large', message: 'Max 10MB images.' });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setPreview(b64);
      setCameraMode(false);
      doScan(b64);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const ms = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } },
      });
      streamRef.current = ms;
      if (videoRef.current) videoRef.current.srcObject = ms;
      setCameraMode(true);
    } catch {
      emitToastShow({
        variant: 'error',
        title: 'Camera Error',
        message: 'Enable camera in settings.',
      });
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const b64 = canvas.toDataURL('image/jpeg');
    setPreview(b64);
    setCameraMode(false);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    doScan(b64);
  };

  const reset = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCameraMode(false);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div
        className={`relative aspect-[4/5] rounded-[48px] overflow-hidden border bg-black flex items-center justify-center transition-all duration-500 ${scanning ? 'border-[#2BF3C0]/40 shadow-[0_0_60px_rgba(43,243,192,0.15),0_40px_100px_rgba(0,0,0,0.6)]' : 'border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]'}`}
      >
        <canvas ref={canvasRef} className="hidden" />

        {!preview && !cameraMode && (
          <div className="flex flex-col items-center gap-8 p-12 text-center w-full max-w-xs">
            <div className="relative">
              <div
                className="absolute inset-0 bg-[#2BF3C0] blur-3xl opacity-20 animate-pulse pointer-events-none"
                aria-hidden="true"
              />
              <div className="relative w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center text-[#2BF3C0]">
                <Zap size={48} />
              </div>
            </div>
            <div className="space-y-4 w-full">
              <button
                onClick={startCamera}
                className="hv-btn w-full py-5 bg-[#2BF3C0] text-black font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(43,243,192,0.3)] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2BF3C0] focus-visible:-outline-offset-2"
              >
                <Camera size={20} /> Start Live Scan
              </button>
              <div className="flex items-center gap-4">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                  OR
                </span>
                <div className="h-px bg-white/10 flex-1" />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="hv-btn w-full py-5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2BF3C0] focus-visible:-outline-offset-2"
              >
                <Upload size={18} className="opacity-60" /> Upload Evidence
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFile}
              className="hidden"
              accept="image/*"
            />
          </div>
        )}

        {cameraMode && (
          <div className="absolute inset-0">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-12 border border-white/10 rounded-3xl pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#2BF3C0] -translate-x-1 -translate-y-1" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#2BF3C0] translate-x-1 -translate-y-1" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#2BF3C0] -translate-x-1 translate-y-1" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#2BF3C0] translate-x-1 translate-y-1" />
            </div>
            {/* Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-16 h-16 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-[#2BF3C0]/60" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-4 bg-[#2BF3C0]/60" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-4 bg-[#2BF3C0]/60" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-px w-4 bg-[#2BF3C0]/60" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-[#2BF3C0]/80" />
              </div>
            </div>
            <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
              <button
                onClick={captureFrame}
                aria-label="Capture photo"
                className="hv-btn w-24 h-24 rounded-full border-4 border-white p-1 active:scale-95 pointer-events-auto bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2BF3C0] focus-visible:-outline-offset-2"
              >
                <div className="w-full h-full rounded-full bg-white" />
              </button>
            </div>
            <button
              onClick={reset}
              className="hv-btn absolute top-8 left-8 px-5 py-3 rounded-2xl bg-black/60 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2BF3C0] focus-visible:-outline-offset-2"
            >
              Abort
            </button>
          </div>
        )}

        {preview && (
          <div className="absolute inset-0">
            <img
              src={preview}
              className={`w-full h-full object-cover transition-all duration-1000 ${scanning ? 'grayscale contrast-150 brightness-50 blur-[2px] scale-105' : ''}`}
              alt="Scan"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(43,243,192,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(43,243,192,0.2) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.1,
              }}
            />

            {scanning && (
              <>
                {/* HUD overlay */}
                <ScannerHUD progress={scanProgress} phase={SCAN_STATUS_MESSAGES[scanStatusIdx]} />

                {/* Corner brackets — forensic targeting frame */}
                <div className="absolute inset-8 pointer-events-none z-20" aria-hidden="true">
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#2BF3C0] -translate-x-1 -translate-y-1 animate-pulse" />
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-[#2BF3C0] translate-x-1 -translate-y-1 animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-[#2BF3C0] -translate-x-1 translate-y-1 animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#2BF3C0] translate-x-1 translate-y-1 animate-pulse" />
                </div>

                {/* CSS scanline — thick with heavy glow */}
                <div
                  className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2BF3C0] to-transparent shadow-[0_0_40px_#2BF3C0,0_0_80px_rgba(43,243,192,0.3)] z-20 animate-[scanline_2s_ease-in-out_infinite] pointer-events-none"
                  aria-hidden="true"
                />

                {/* Progress panel */}
                <div className="absolute bottom-16 left-8 right-8 z-40 bg-black/60 border border-white/10 backdrop-blur-2xl p-5 rounded-3xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Activity size={14} className="text-[#2BF3C0] animate-pulse" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                          Neural_Core
                        </span>
                        <span className="text-[10px] font-black text-[#2BF3C0] font-mono">
                          {scanProgress}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2BF3C0] transition-all"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <p
                    key={scanStatusIdx}
                    className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#2BF3C0]/60 animate-pulse"
                  >
                    {SCAN_STATUS_MESSAGES[scanStatusIdx]}
                  </p>
                </div>
              </>
            )}

            {!scanning && result && <ForensicReportPanel result={result} onReset={reset} />}
          </div>
        )}
      </div>
    </div>
  );
};
