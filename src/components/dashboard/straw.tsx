"use client"

interface StrawComponentProps {
  isActive: boolean
}

export default function StrawComponent({ isActive }: StrawComponentProps) {
  return (
    <div className="relative">
      {/* Paille */}
      <div className={`w-5 h-32 rounded-full ${isActive ? 'bg-red-500' : 'bg-red-300'} relative overflow-hidden`}>
        {/* Rayures de la paille */}
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-white/20" />
        
        {/* Courbure de la paille */}
        <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full border-3 border-red-500 border-b-transparent border-r-transparent transform rotate-45" />
      </div>
      
      {/* Étiquette de la paille */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-bold">
        <span className="text-base bg-white/80 px-2 py-1 rounded-md text-red-800 shadow-sm">Paille</span>
      </div>
    </div>
  )
} 