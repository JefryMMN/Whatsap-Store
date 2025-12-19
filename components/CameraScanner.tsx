
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { processDocumentScan } from '../services/geminiService';
import { ScanRecord } from '../types';

interface CameraScannerProps {
  onComplete: (record: ScanRecord) => void;
  onCancel: () => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onComplete, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access required for Snapshot protocol.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsProcessing(true);
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvasRef.current.toDataURL('image/jpeg');
    const base64Clean = base64.split(',')[1];

    const result = await processDocumentScan(base64Clean);
    
    if (result) {
      const record: ScanRecord = {
        id: Math.random().toString(36).substr(2, 9),
        originalImage: base64,
        processedImage: base64, // In a real app, we'd apply a B&W filter here
        extractedText: result.extractedText,
        fileName: result.suggestedFileName || 'snapshot-scan.pdf',
        timestamp: Date.now(),
        status: 'processed'
      };
      onComplete(record);
    } else {
      setError("Protocol mismatch: OCR extraction failed.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-fade-in">
      <div className="relative w-full h-full max-w-[500px] flex flex-col bg-white border-8 border-black">
        {/* Header */}
        <div className="p-6 flex justify-between items-center bg-white border-b-4 border-black">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-black text-xs">S</div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">SCANNER.PROTOCOL</span>
          </div>
          <button onClick={onCancel} className="text-black font-black uppercase text-xs tracking-widest hover:opacity-50 transition-opacity">Abort</button>
        </div>

        {/* Viewfinder */}
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
          {error ? (
            <div className="text-center p-12 text-white">
               <div className="text-4xl mb-4">⚠️</div>
               <p className="text-xs font-black uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className={`w-full h-full object-cover grayscale opacity-60 ${isProcessing ? 'blur-md' : ''}`}
              />
              {/* Perspective Guides */}
              {!isProcessing && (
                <div className="absolute inset-10 border-2 border-dashed border-white/40 pointer-events-none">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                </div>
              )}
            </>
          )}

          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
               <div className="w-16 h-1 bg-white mb-8 animate-pulse shadow-[0_0_15px_white]"></div>
               <span className="text-white font-black uppercase tracking-[0.5em] text-xs">DISTILLING OCR...</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-12 bg-white border-t-4 border-black flex items-center justify-center">
          <button 
            disabled={isProcessing || !!error}
            onClick={captureImage}
            className="w-20 h-20 rounded-full border-8 border-black flex items-center justify-center active:scale-90 transition-transform disabled:opacity-20"
          >
            <div className="w-12 h-12 bg-black rounded-full"></div>
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraScanner;
