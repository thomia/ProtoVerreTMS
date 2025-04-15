import { EspacePersonnelNavigation } from "@/components/espace-personnel/navigation"
import { EspacePersonnelDashboard } from "@/components/espace-personnel/espace-personnel-overview"

export default function EspacePersonnelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Espace Personnel</h1>
        
        <EspacePersonnelNavigation />
        
        <div className="mt-8">
          <EspacePersonnelDashboard />
        </div>
      </div>
    </div>
  )
}
