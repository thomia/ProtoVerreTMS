"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Briefcase, Calendar, Clock, Activity, Edit, Trash2, Download } from "lucide-react"

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
  notes?: string
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
    },
    notes: "L'opérateur a signalé une fatigue au niveau des poignets après 1h30 de travail. La récupération est bonne mais l'absorption pourrait être améliorée avec une meilleure ergonomie du poste."
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
    },
    notes: "Bonne performance générale. L'environnement est bien adapté mais le débit pourrait être optimisé avec un réagencement des outils."
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
    },
    notes: "Excellente performance au niveau du débit et de l'environnement. La récupération est le point faible, suggérant des pauses plus fréquentes."
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
    },
    notes: "L'absorption est problématique en raison de la posture requise pour la soudure. Recommandation d'ajouter un support ajustable."
  }
]

export default function AnalyseDetail({ id }: { id: string }) {
  const router = useRouter()
  const [analyse, setAnalyse] = useState<Analyse | null>(null)
  const [activeTab, setActiveTab] = useState("apercu")
  
  // Simuler le chargement des données
  useEffect(() => {
    // Dans une application réelle, vous feriez un appel API ici
    const analyseFound = analysesDemo.find(a => a.id === id)
    setAnalyse(analyseFound || null)
  }, [id])
  
  // Fonction pour calculer le score global
  const calculateGlobalScore = (scores: { debit: number, absorption: number, recuperation: number, environnement: number }) => {
    return Math.round((scores.debit + scores.absorption + scores.recuperation + scores.environnement) / 4)
  }
  
  // Fonction pour déterminer la couleur en fonction du score
  const getScoreColor = (score: number): string => {
    if (score < 50) return "text-red-500"
    if (score < 70) return "text-yellow-500"
    if (score < 85) return "text-green-400"
    return "text-green-300"
  }
  
  // Fonction pour retourner à la liste des analyses
  const handleRetour = () => {
    router.push("/espace-personnel/analyses")
  }
  
  if (!analyse) {
    return (
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-slate-700/50">
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-gray-400 mb-4">Analyse non trouvée ou en cours de chargement...</p>
            <Button 
              variant="outline" 
              onClick={handleRetour}
              className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux analyses
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const globalScore = calculateGlobalScore(analyse.score)
  const scoreColorClass = getScoreColor(globalScore)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          onClick={handleRetour}
          className="text-gray-400 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>
      
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-slate-700/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-white flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-blue-400" />
                {analyse.poste} - {analyse.tache}
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(analyse.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {analyse.duree}
                  </div>
                </div>
              </CardDescription>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-slate-800 hover:bg-slate-700 text-blue-400 border-slate-700"
              >
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-slate-800 hover:bg-slate-700 text-red-400 border-slate-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-slate-800 hover:bg-slate-700 text-green-400 border-slate-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="bg-slate-800/50">
              <TabsTrigger 
                value="apercu" 
                className="transition-all duration-300 data-[state=active]:bg-blue-600/30"
              >
                Aperçu
              </TabsTrigger>
              <TabsTrigger 
                value="details" 
                className="transition-all duration-300 data-[state=active]:bg-blue-600/30"
              >
                Détails
              </TabsTrigger>
              <TabsTrigger 
                value="recommandations" 
                className="transition-all duration-300 data-[state=active]:bg-blue-600/30"
              >
                Recommandations
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          <TabsContent value="apercu" className="mt-0">
            <div className="space-y-6">
              {/* Score global */}
              <div className="bg-slate-800/30 p-6 rounded-lg text-center">
                <h3 className="text-lg font-medium text-white mb-2">Score Global</h3>
                <div className={`text-4xl font-bold ${scoreColorClass}`}>
                  {globalScore}%
                </div>
              </div>
              
              {/* Scores détaillés */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/30 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-blue-400 mb-1">Débit</h4>
                  <div className={`text-2xl font-bold ${getScoreColor(analyse.score.debit)}`}>
                    {analyse.score.debit}%
                  </div>
                </div>
                
                <div className="bg-slate-800/30 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Absorption</h4>
                  <div className={`text-2xl font-bold ${getScoreColor(analyse.score.absorption)}`}>
                    {analyse.score.absorption}%
                  </div>
                </div>
                
                <div className="bg-slate-800/30 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-green-400 mb-1">Récupération</h4>
                  <div className={`text-2xl font-bold ${getScoreColor(analyse.score.recuperation)}`}>
                    {analyse.score.recuperation}%
                  </div>
                </div>
                
                <div className="bg-slate-800/30 p-4 rounded-lg text-center">
                  <h4 className="text-sm font-medium text-purple-400 mb-1">Environnement</h4>
                  <div className={`text-2xl font-bold ${getScoreColor(analyse.score.environnement)}`}>
                    {analyse.score.environnement}%
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              {analyse.notes && (
                <div className="bg-slate-800/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Notes</h3>
                  <p className="text-gray-300">{analyse.notes}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="mt-0">
            <div className="space-y-6">
              <div className="bg-slate-800/30 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-4">Détails de l'analyse</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Poste de travail</h4>
                      <p className="text-white">{analyse.poste}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Tâche</h4>
                      <p className="text-white">{analyse.tache}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Date d'analyse</h4>
                      <p className="text-white">{new Date(analyse.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Durée de la tâche</h4>
                      <p className="text-white">{analyse.duree}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-700/50">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Détail des scores</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-blue-400">Débit</span>
                          <span className={`text-sm font-medium ${getScoreColor(analyse.score.debit)}`}>{analyse.score.debit}%</span>
                        </div>
                        <div className="w-full bg-slate-700/30 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${analyse.score.debit}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-400">Absorption</span>
                          <span className={`text-sm font-medium ${getScoreColor(analyse.score.absorption)}`}>{analyse.score.absorption}%</span>
                        </div>
                        <div className="w-full bg-slate-700/30 rounded-full h-2">
                          <div 
                            className="bg-gray-500 h-2 rounded-full" 
                            style={{ width: `${analyse.score.absorption}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-green-400">Récupération</span>
                          <span className={`text-sm font-medium ${getScoreColor(analyse.score.recuperation)}`}>{analyse.score.recuperation}%</span>
                        </div>
                        <div className="w-full bg-slate-700/30 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${analyse.score.recuperation}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-purple-400">Environnement</span>
                          <span className={`text-sm font-medium ${getScoreColor(analyse.score.environnement)}`}>{analyse.score.environnement}%</span>
                        </div>
                        <div className="w-full bg-slate-700/30 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${analyse.score.environnement}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recommandations" className="mt-0">
            <div className="space-y-6">
              <div className="bg-slate-800/30 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-4">Recommandations</h3>
                
                <div className="space-y-4">
                  {analyse.score.debit < 70 && (
                    <div className="p-3 border-l-4 border-blue-500 bg-blue-500/10 rounded-r-lg">
                      <h4 className="text-sm font-medium text-blue-400 mb-1">Amélioration du débit</h4>
                      <p className="text-gray-300 text-sm">
                        Optimisez le flux de travail en réorganisant les outils et les matériaux pour minimiser les mouvements inutiles. 
                        Envisagez une formation supplémentaire pour améliorer l'efficacité des gestes.
                      </p>
                    </div>
                  )}
                  
                  {analyse.score.absorption < 70 && (
                    <div className="p-3 border-l-4 border-gray-500 bg-gray-500/10 rounded-r-lg">
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Amélioration de la capacité d'absorption</h4>
                      <p className="text-gray-300 text-sm">
                        Améliorez l'ergonomie du poste de travail pour réduire la fatigue. Vérifiez la posture de l'opérateur et 
                        ajustez la hauteur des surfaces de travail. Envisagez des équipements de soutien ergonomiques.
                      </p>
                    </div>
                  )}
                  
                  {analyse.score.recuperation < 70 && (
                    <div className="p-3 border-l-4 border-green-500 bg-green-500/10 rounded-r-lg">
                      <h4 className="text-sm font-medium text-green-400 mb-1">Amélioration de la récupération</h4>
                      <p className="text-gray-300 text-sm">
                        Instaurez des pauses plus fréquentes mais plus courtes. Encouragez des exercices d'étirement pendant les pauses.
                        Assurez-vous que l'environnement de pause est propice à la détente.
                      </p>
                    </div>
                  )}
                  
                  {analyse.score.environnement < 70 && (
                    <div className="p-3 border-l-4 border-purple-500 bg-purple-500/10 rounded-r-lg">
                      <h4 className="text-sm font-medium text-purple-400 mb-1">Amélioration de l'environnement</h4>
                      <p className="text-gray-300 text-sm">
                        Optimisez l'éclairage et la ventilation du poste de travail. Réduisez les nuisances sonores et les distractions.
                        Assurez-vous que la température ambiante est confortable pour le type de travail effectué.
                      </p>
                    </div>
                  )}
                  
                  {Object.values(analyse.score).every(score => score >= 70) && (
                    <div className="p-3 border-l-4 border-green-500 bg-green-500/10 rounded-r-lg">
                      <h4 className="text-sm font-medium text-green-400 mb-1">Excellent travail !</h4>
                      <p className="text-gray-300 text-sm">
                        Tous les paramètres sont à un bon niveau. Continuez à surveiller régulièrement et à maintenir ces bonnes pratiques.
                        Envisagez de documenter ce poste comme référence pour d'autres postes similaires.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  )
}
