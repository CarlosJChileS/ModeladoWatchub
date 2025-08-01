import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  SkipBack,
  SkipForward,
  Settings,
  Maximize
} from 'lucide-react';
import { StreamingSource } from '@/services/streamingService';

interface VideoPlayerProps {
  source?: StreamingSource;
  title: string;
  episode?: string;
  onClose?: () => void;
  onProgress?: (progress: number) => void;
  startTime?: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  source,
  title,
  episode,
  onClose,
  onProgress,
  startTime = 0
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Default video URL for demo
  const videoUrl = source?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Video container */}
      <section 
        className="relative flex-1 bg-black cursor-none group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControls(false)}
        aria-label="Video player controls"
      >
        {/* Real video element for demo */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={videoUrl}
          onLoadedMetadata={() => {
            setIsLoading(false);
            setDuration(videoRef.current?.duration || 0);
            if (videoRef.current) {
              videoRef.current.volume = volume;
            }
          }}
          onTimeUpdate={() => {
            if (videoRef.current) {
              setCurrentTime(videoRef.current.currentTime);
              onProgress?.(videoRef.current.currentTime);
            }
          }}
          onEnded={() => setIsPlaying(false)}
          muted={isMuted}
        >
          <track
            kind="captions"
            src=""
            srcLang="es"
            label="Español"
            default
          />
        </video>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg">Cargando: {title}</p>
              {episode && <p className="text-sm text-white/80">{episode}</p>}
            </div>
          </div>
        )}

        {/* Fallback when no video available */}
        {!videoUrl && (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center text-white/60">
              <Play className="w-24 h-24 mx-auto mb-4" />
              <p className="text-lg">Reproduciendo: {title}</p>
              {episode && <p className="text-sm">{episode}</p>}
              <p className="text-sm text-white/40 mt-2">Video de demostración</p>
            </div>
          </div>
        )}

        {/* Top bar */}
        <div className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ← Volver
            </Button>
            <div className="text-white text-right">
              <h1 className="text-xl font-semibold">{title}</h1>
              {episode && <p className="text-sm text-white/80">{episode}</p>}
            </div>
          </div>
        </div>

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            onClick={togglePlay}
            className="rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 w-20 h-20"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </Button>
        </div>

        {/* Bottom controls */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Progress bar */}
          <div className="mb-4">
            <Progress value={progress} className="h-1 bg-white/20" />
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-white rounded-full" />
                </div>
              </div>

              <div className="text-white text-sm">
                {currentTime} / {duration}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <Settings className="w-5 h-5" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};