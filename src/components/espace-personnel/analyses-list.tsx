"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileText, ArrowRight, Calendar, Briefcase, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

// Types pour les analyses
interface Analyse {
  id: string
  date: string
  poste: string
  tache: string
  duree: string
  score: {
    debit: number
    absorption: number
    recuperation: number
    environnement: number
  }
}

// Données fictives pour la démonstration
const analysesDemo: Analyse[] = [
  {
    id: "1",
    date: "2025-03-15",
    poste: "Assemblage",
    tache: "Montage de composants",
    duree: "2h30",
    score: {
      debit: 75,
      absorption: 60,
      recuperation: 80,
      environnement: 65
    }
  },
  {
    id: "2",
    date: "2025-03-20",
    poste: "Emballage",
    tache: "Conditionnement produits",
    duree: "1h45",
    score: {
      debit: 65,
      absorption: 70,
      recuperation: 75,
      environnement: 80
    }
  },
  {
    id: "3",
    date: "2025-04-01",
    poste: "Contrôle Qualité",
    tache: "Inspection visuelle",
    duree: "3h15",
    score: {
      debit: 85,
      absorption: 75,
      recuperation: 70,
      environnement: 90
    }
  },
  {
    id: "4",
    date: "2025-04-01",
    poste: "Maintenance",
    tache: "Entretien équipements",
    duree: "4h00",
    score: {
      debit: 60,
      absorption: 65,
      recuperation: 85,
      environnement: 75
    }
  },
  {
    id: "5",
    date: "2025-04-02",
    poste: "Assemblage",
    tache: "Soudure composants",
    duree: "2h00",
    score: {
      debit: 70,
      absorption: 55,
      recuperation: 75,
      environnement: 60
    }
  }
]

export default function AnalysesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  
  // Filtrer les analyses en fonction du terme de recherche
  const filteredAnalyses = analysesDemo.filter(analyse => 
    analyse.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analyse.tache.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Fonction pour calculer le score global
  const calculateGlobalScore = (scores: { debit: number, absorption: number, recuperation: number, environnement: number }) => {
    return Math.round((scores.debit + scores.absorption + scores.recuperation + scores.environnement) / 4)
  }
  
  // Fonction pour déterminer la couleur en fonction du score
  const getScoreColor = (score: number) => {
    if (score < 50) return "text-red-500"
    if (score < 70) return "text-yellow-500"
    if (score < 85) return "text-green-400"
    return "text-green-300"
  }
  
  // Fonction pour voir le détail d'une analyse
  const viewAnalyseDetail = (id: string) => {
    router.push(`/espace-personnel/analyses/${id}`)
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Mes Analyses</CardTitle>
        <CardDescription className="text-gray-400">
          Consultez et gérez toutes vos analyses de postes et tâches
        </CardDescription>
        
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher par poste ou tâche..."
            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredAnalyses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Aucune analyse ne correspond à votre recherche</p>
            </div>
          ) : (
            filteredAnalyses.map(analyse => {
              const globalScore = calculateGlobalScore(analyse.score)
              const scoreColorClass = getScoreColor(globalScore)
              
              return (
                <div 
                  key={analyse.id} 
                  className="bg-slate-800/30 p-4 rounded-lg hover:bg-slate-800/50 transition-all duration-300 cursor-pointer"
                  onClick={() => viewAnalyseDetail(analyse.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center mb-1">
                        <Briefcase className="h-4 w-4 mr-2 text-blue-400" />
                        <h3 className="text-lg font-medium text-white">{analyse.poste}</h3>
                      </div>
                      <p className="text-sm text-gray-400 mb-1">{analyse.tache}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(analyse.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {analyse.duree}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex flex-col items-center mr-6">
                        <span className="text-sm text-gray-400">Score global</span>
                        <span className={`text-xl font-bold ${scoreColorClass}`}>{globalScore}%</span>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
