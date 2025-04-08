import { EspacePersonnelNavigation } from "@/components/espace-personnel/navigation"
import AnalysesList from "@/components/espace-personnel/analyses-list"

export default function AnalysesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Mes Analyses</h1>
        
        <EspacePersonnelNavigation />
        
        <div className="mt-8">
          <AnalysesList />
        </div>
      </div>
    </div>
  )
}
