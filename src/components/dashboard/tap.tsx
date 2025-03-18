"use client"

interface TapComponentProps {
  isOpen: boolean
}

export default function TapComponent({ isOpen }: TapComponentProps) {
  return (
    <div className="relative">
      {/* Base du robinet */}
      <div className="w-16 h-8 bg-gray-700 rounded-t-lg" />
      
      {/* Corps du robinet */}
      <div className="w-6 h-16 bg-gray-600 mx-auto relative">
        {/* Bouton du robinet */}
        <div className={`absolute -right-5 top-1/3 w-5 h-5 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'} border border-gray-800`} />
        
        {/* Sortie d'eau */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-400 rounded-full">
          {/* Goutte d'eau */}
          {isOpen && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-4 bg-blue-400 rounded-full animate-bounce" />
          )}
        </div>
      </div>
      
      {/* Étiquette du robinet */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-bold">
        <span className="text-base bg-white/80 px-2 py-1 rounded-md text-gray-800 shadow-sm">Robinet</span>
      </div>
    </div>
  )
} 