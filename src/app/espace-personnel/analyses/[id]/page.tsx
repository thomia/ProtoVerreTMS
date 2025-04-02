import { EspacePersonnelNavigation } from "@/components/espace-personnel/navigation"
import AnalyseDetail from "@/components/espace-personnel/analyse-detail"

export default function AnalyseDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Détail de l'Analyse</h1>
        
        <EspacePersonnelNavigation />
        
        <div className="mt-8">
          <AnalyseDetail id={params.id} />
        </div>
      </div>
    </div>
  )
}
