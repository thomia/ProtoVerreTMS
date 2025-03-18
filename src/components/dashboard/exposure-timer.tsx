import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

interface ExposureTimerProps {
  onReset: () => void;
  onTogglePause: () => void;
}

export function ExposureTimer({ onReset, onTogglePause }: ExposureTimerProps) {
  const [exposureTime, setExposureTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setExposureTime(prev => prev + 1);
    }, 1000); // 1 seconde = 1 minute dans notre simulation

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
    onTogglePause();
  };

  const handleReset = () => {
    setExposureTime(0);
    setIsPaused(false);
    onReset();
  };

  return (
    <div className="flex items-center gap-4 bg-[#1a1f2e] px-4 py-2 rounded-lg border border-slate-700/50">
      <div className="text-sm text-gray-300">
        Temps d'exposition : <span className="font-medium text-white">{exposureTime} minute{exposureTime > 1 ? 's' : ''}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={handlePauseToggle}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-white transition-colors"
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4" />
              Reprendre
            </>
          ) : (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Réinitialiser
        </button>
      </div>
    </div>
  );
} 