import { EspacePersonnelNavigation } from "@/components/espace-personnel/navigation"
import { ParametresForm } from "@/components/espace-personnel/parametres-form"

export default function ParametresPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Paramètres
      </h1>
      
      <EspacePersonnelNavigation />
      
      <div className="mt-8">
        <ParametresForm />
      </div>
    </div>
  )
}
