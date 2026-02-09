import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Zap, Activity } from 'lucide-react';
import { identifyGrail } from '../services/geminiService';
import { emitToastShow, emitAchievement } from '../eventBus';
import { playScanStart, playScanComplete, playError } from '../lib/sounds';
import { SCAN_STATUS_MESSAGES } from '../constants';
import { ScannerHUD } from './ScannerHUD';
import { ForensicReportPanel } from './ForensicReportPanel';
import type { IdentificationResult } from '../types';

export interface ScannerProps {
  onResult: (r: IdentificationResult) => void;
}

const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.85;

/** Resize a data URL image to fit within MAX_DIMENSION, returns JPEG data URL */
const resizeImage = (dataUrl: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
      if (scale === 1) {
        resolve(dataUrl);
        return;
      }
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      const ctx = c.getContext('2d');
      if (!ctx) { resolve(dataUrl); return; }
      ctx.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/jpeg', JPEG_QUALITY));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });

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
    playScanStart();
    try {
      const data = await identifyGrail(base64);
      navigator.vibrate?.(200);
      playScanComplete();
      setResult(data);
      onResult(data);
      if (data.isAuthentic && data.confidence > 0.8) emitAchievement(data.name);
    } catch {
      playError();
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
    reader.onloadend = async () => {
      const raw = reader.result;
      if (typeof raw !== 'string') return;
      try {
        const b64 = await resizeImage(raw);
        setPreview(b64);
        setCameraMode(false);
        doScan(b64);
      } catch {
        emitToastShow({ variant: 'error', title: 'Invalid Image', message: 'Could not process this image file.' });
      }
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

      // First-frame watchdog: if no frames after 5s, suggest Upload instead
      const video = videoRef.current;
      if (video) {
        const watchdog = setTimeout(() => {
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            ms.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
            video.srcObject = null;
            setCameraMode(false);
            emitToastShow({
              variant: 'error',
              title: 'No Video Signal',
              message: 'Camera opened but no frames received. Try "Upload Evidence" instead.',
            });
          }
        }, 5000);
        // Clear watchdog if component unmounts or camera stops before timeout
        const origStop = streamRef.current;
        const onTrackEnded = () => clearTimeout(watchdog);
        origStop?.getTracks().forEach((t) => t.addEventListener('ended', onTrackEnded, { once: true }));
      }
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Camera blocked — tap the lock icon in your address bar to allow.'
          : err instanceof DOMException && err.name === 'NotFoundError'
            ? 'No camera found on this device.'
            : 'Enable camera in browser settings.';
      emitToastShow({
        variant: 'error',
        title: 'Camera Error',
        message: msg,
      });
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;

    // Guard: video must have valid dimensions (not ready on slow mobile init)
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      emitToastShow({
        variant: 'error',
        title: 'Camera Not Ready',
        message: 'Wait a moment for the camera to initialize.',
      });
      return;
    }

    const canvas = canvasRef.current;
    // Scale down to MAX_DIMENSION for mobile compatibility + smaller payload
    const scale = Math.min(1, MAX_DIMENSION / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const b64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
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
        className={`relative aspect-[4/5] rounded-[48px] overflow-hidden border-2 bg-black flex items-center justify-center transition-all duration-500 ${scanning ? 'scan-border-glow shadow-[0_0_60px_rgba(43,243,192,0.15),0_40px_100px_rgba(0,0,0,0.6)]' : 'border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]'}`}
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
                <Zap size={48} aria-hidden="true" />
              </div>
            </div>
            <div className="space-y-4 w-full">
              <button
                onClick={startCamera}
                className="hv-btn w-full py-5 bg-[#2BF3C0] text-black font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(43,243,192,0.3)] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2BF3C0] focus-visible:-outline-offset-2"
              >
                <Camera size={20} aria-hidden="true" /> Start Live Scan
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
                <Upload size={18} className="opacity-60" aria-hidden="true" /> Upload Evidence
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
            <div className="absolute inset-12 border border-white/10 rounded-3xl pointer-events-none" aria-hidden="true">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#2BF3C0] -translate-x-1 -translate-y-1" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#2BF3C0] translate-x-1 -translate-y-1" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#2BF3C0] -translate-x-1 translate-y-1" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#2BF3C0] translate-x-1 translate-y-1" />
            </div>
            {/* Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
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
              aria-hidden="true"
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
                    <Activity size={14} className="text-[#2BF3C0] animate-pulse" aria-hidden="true" />
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
