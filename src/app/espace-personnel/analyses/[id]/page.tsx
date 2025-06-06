import { EspacePersonnelNavigation } from "@/components/espace-personnel/navigation"
import AnalyseDetail from "@/components/espace-personnel/analyse-detail"
import type { Metadata } from "next"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Analyse ${id} | ProtoVerreTMS`,
    description: `Détails de l'analyse ${id} dans l'espace personnel`
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Détail de l'Analyse</h1>
        
        <EspacePersonnelNavigation />
        
        <div className="mt-8">
          <AnalyseDetail id={id} />
        </div>
      </div>
    </div>
  )
}
