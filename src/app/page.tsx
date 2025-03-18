import Dashboard from '@/components/dashboard/dashboard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-0 overflow-hidden bg-gray-950">
      <div className="relative w-full bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
        <div className="relative container mx-auto px-4 py-6">
          <Dashboard />
        </div>
      </div>
      
      {/* Footer avec mentions légales */}
      <footer className="w-full py-4 px-6 border-t border-gray-800 bg-gray-950/80 backdrop-blur-sm mt-auto">
        <div className="container mx-auto flex flex-col items-center text-xs text-gray-400 space-y-2">
          <div className="flex items-center space-x-2">
            <span>© 2024 ProtoVerreTMS™</span>
            <span>•</span>
            <span>Tous droits réservés</span>
            <span>•</span>
            <span>Développé par Thomas REL</span>
          </div>
          <div className="text-center">
            <p>Logiciel protégé - Reproduction interdite</p>
            <p className="text-[10px] mt-1">Marque et design déposés - INPI - Tous droits de propriété intellectuelle réservés</p>
          </div>
        </div>
      </footer>
    </main>
  )
} 