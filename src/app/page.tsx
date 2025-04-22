import Dashboard from '@/components/dashboard/dashboard-new';
import Link from 'next/link';
import { UserCircle } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start p-0 bg-black">
      <div className="relative w-full bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/2 via-transparent to-transparent" />
        <div className="relative w-full max-w-[2000px] mx-auto px-8 py-6">
          <Dashboard />
          
          {/* Bouton d'accès à l'espace personnel */}
          <div className="flex justify-center mt-8 mb-4">
            <Link 
              href="/espace-personnel" 
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <UserCircle className="h-6 w-6" />
              <span className="text-lg font-medium">Accéder à mon Espace Personnel</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer avec mentions légales */}
      <footer className="w-full py-4 px-6 border-t border-gray-800/30 bg-black backdrop-blur-sm mt-auto">
        <div className="max-w-[2000px] mx-auto flex flex-col items-center text-xs text-gray-400 space-y-2">
          <div className="flex items-center space-x-2">
            <span> 2024 ProtoVerreTMS</span>
            <span>•</span>
            <span>Tous droits réservés</span>
            <span>•</span>
            <span>Développé par Thomas REL</span>
          </div>
          <div className="text-center">
            <p>Logiciel protégé - Reproduction interdite</p>
            <p className="text-[10px] mt-1">Tous droits de propriété intellectuelle réservés</p>
          </div>
        </div>
      </footer>
    </main>
  )
}