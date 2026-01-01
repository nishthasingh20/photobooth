import { useRef, useEffect, useState } from "react";
import { Camera, CameraOff, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CameraFilters, { FilterType, applyFilterWithDimensions } from "./CameraFilters";

interface CameraSectionProps {
  onCapture: (imageData: string) => void;
  canCapture: boolean;
}

const CameraSection = ({ onCapture, canCapture }: CameraSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("none");

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      setStream(mediaStream);
      setIsCameraOn(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Failed to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !canCapture) return;

    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Save context state
      ctx.save();
      
      // Mirror the image for selfie-style
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);
      
      // Restore context state
      ctx.restore();
      
      // Apply selected filter
      if (selectedFilter !== "none") {
        applyFilterWithDimensions(ctx, canvas, selectedFilter);
      }
      
      const imageData = canvas.toDataURL("image/jpeg", 0.9);
      onCapture(imageData);
    }

    setTimeout(() => setIsCapturing(false), 200);
  };

  // Handle video stream assignment and playback
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          videoRef.current.play().catch((err) => {
            console.error("Error playing video:", err);
          });
        }
      };
    } else if (!stream && videoRef.current) {
      videoRef.current.srcObject = null;
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // Get CSS filter for video preview
  const getVideoFilter = (): string => {
    switch (selectedFilter) {
      case "vintage":
        return "sepia(0.5) saturate(1.2) contrast(1.1) brightness(1.05)";
      case "blackwhite":
        return "grayscale(100%)";
      case "blue":
        return "hue-rotate(-10deg) saturate(0.9) brightness(1.1) contrast(0.95)";
      case "grains":
        return "contrast(1.15) brightness(1.05) saturate(0.95)";
      case "peachy":
        return "saturate(1.5) contrast(1.3)";
      case "none":
      default:
        return "none";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="camera-container aspect-[4/3] w-full relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-200 ${
            isCapturing ? "brightness-150" : ""
          } ${isCameraOn ? "z-10" : "z-0 opacity-0"}`}
          style={{ 
            transform: "scaleX(-1)",
            filter: getVideoFilter(),
          }}
        />
        {!isCameraOn && (
          <div className="absolute inset-0 z-20 flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-arctic to-golden/30">
            <CameraOff className="h-16 w-16 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Camera is off</p>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Filter Selector */}
      {isCameraOn && (
        <div className={`w-full rounded-xl bg-card/50 p-3 border border-border/50 transition-all duration-300 overflow-hidden ${
          isCameraOn ? "animate-slide-down opacity-100" : "max-h-0 opacity-0"
        }`}>
          <h4 className="text-sm font-semibold text-foreground mb-3 text-center">
            Select a filter
          </h4>
          <CameraFilters 
            selectedFilter={selectedFilter} 
            onFilterChange={setSelectedFilter} 
          />
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <Button
          variant={isCameraOn ? "secondary" : "default"}
          size="lg"
          onClick={isCameraOn ? stopCamera : startCamera}
          className="gap-2 rounded-xl px-6"
        >
          {isCameraOn ? (
            <>
              <CameraOff className="h-4 w-4" />
              Turn Off
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              Turn On
            </>
          )}
        </Button>

        <Button
          variant="default"
          size="lg"
          onClick={capturePhoto}
          disabled={!isCameraOn || !canCapture}
          className="btn-capture gap-2 rounded-xl bg-peach px-8 text-foreground hover:bg-peach/90 disabled:opacity-40"
        >
          <Circle className="h-4 w-4 fill-current" />
          Capture
        </Button>
      </div>
    </div>
  );
};

export default CameraSection;
