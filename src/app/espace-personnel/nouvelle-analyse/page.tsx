import { EspacePersonnelNavigation } from "@/components/espace-personnel/navigation"
import NouvelleAnalyseForm from "@/components/espace-personnel/nouvelle-analyse-form"

export default function NouvelleAnalysePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Nouvelle Analyse</h1>
        
        <EspacePersonnelNavigation />
        
        <div className="mt-8">
          <NouvelleAnalyseForm />
        </div>
      </div>
    </div>
  )
}
