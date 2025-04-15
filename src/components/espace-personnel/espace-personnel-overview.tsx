"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, PieChart, Activity, Users, Briefcase } from "lucide-react"

// Types pour les analyses
interface Analyse {
  id: string
  date: string
  poste: string
  tache: string
  score: {
    debit: number
    absorption: number
    recuperation: number
    environnement: number
    orage: number
  }
  scoreGlobal: number
}

// Données fictives pour la démonstration
const analysesDemo: Analyse[] = [
  {
    id: "1",
    date: "2025-03-15",
    poste: "Assemblage",
    tache: "Montage de composants",
    score: {
      debit: 75,
      absorption: 60,
      recuperation: 80,
      environnement: 65,
      orage: 40
    },
    scoreGlobal: 64
  },
  {
    id: "2",
    date: "2025-03-20",
    poste: "Emballage",
    tache: "Conditionnement produits",
    score: {
      debit: 65,
      absorption: 70,
      recuperation: 75,
      environnement: 80,
      orage: 30
    },
    scoreGlobal: 64
  },
  {
    id: "3",
    date: "2025-04-01",
    poste: "Contrôle Qualité",
    tache: "Inspection visuelle",
    score: {
      debit: 85,
      absorption: 75,
      recuperation: 70,
      environnement: 90,
      orage: 25
    },
    scoreGlobal: 69
  }
]

export function EspacePersonnelDashboard() {
  const [viewType, setViewType] = useState("postes")
  
  // Calculer les statistiques globales
  const statsGlobales = {
    nombreAnalyses: analysesDemo.length,
    scoresMoyens: {
      debit: Math.round(analysesDemo.reduce((acc, analyse) => acc + analyse.score.debit, 0) / analysesDemo.length),
      absorption: Math.round(analysesDemo.reduce((acc, analyse) => acc + analyse.score.absorption, 0) / analysesDemo.length),
      recuperation: Math.round(analysesDemo.reduce((acc, analyse) => acc + analyse.score.recuperation, 0) / analysesDemo.length),
      environnement: Math.round(analysesDemo.reduce((acc, analyse) => acc + analyse.score.environnement, 0) / analysesDemo.length),
      orage: Math.round(analysesDemo.reduce((acc, analyse) => acc + analyse.score.orage, 0) / analysesDemo.length)
    }
  }
  
  // Obtenir la liste des postes uniques
  const postes = Array.from(new Set(analysesDemo.map(a => a.poste)))
  
  // Obtenir la liste des tâches uniques
  const taches = Array.from(new Set(analysesDemo.map(a => a.tache)))

  // Calculer le score global pour chaque analyse
  const analysesAvecScoreGlobal = analysesDemo.map(analyse => {
    const scoreGlobal = Math.round(
      (analyse.score.debit + 
      analyse.score.absorption + 
      analyse.score.recuperation + 
      analyse.score.environnement + 
      analyse.score.orage) / 5
    );
    return { ...analyse, scoreGlobal };
  });

  // Trier les analyses par date (les plus récentes d'abord)
  const analysesTries = [...analysesAvecScoreGlobal].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Espace Personnel</h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Total analyses:</span>
          <span className="text-xl font-bold text-white">{statsGlobales.nombreAnalyses}</span>
        </div>
      </div>

      {/* Statistiques globales simplifiées */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-blue-400 flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Débit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statsGlobales.scoresMoyens.debit}%</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-400 flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Absorption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statsGlobales.scoresMoyens.absorption}%</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-green-400 flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Récupération
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statsGlobales.scoresMoyens.recuperation}%</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-purple-400 flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Environnement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statsGlobales.scoresMoyens.environnement}%</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-orange-400 flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Orage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statsGlobales.scoresMoyens.orage}%</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Vue par poste ou par tâche */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Analyses par {viewType === "postes" ? "Poste" : "Tâche"}</CardTitle>
          <CardDescription className="text-gray-400">
            Vue d'ensemble des analyses regroupées par {viewType === "postes" ? "poste de travail" : "type de tâche"}
          </CardDescription>
          
          <div className="mt-2">
            <Tabs value={viewType} onValueChange={setViewType} className="w-full">
              <TabsList className="bg-slate-800/50">
                <TabsTrigger 
                  value="postes" 
                  className="flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] data-[state=active]:bg-blue-600/30"
                >
                  <Briefcase className={`h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    viewType === "postes" ? "text-white scale-100" : "text-gray-400 scale-90"
                  }`} />
                  <span>Par Poste</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="taches" 
                  className="flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] data-[state=active]:bg-blue-600/30"
                >
                  <Users className={`h-4 w-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    viewType === "taches" ? "text-white scale-100" : "text-gray-400 scale-90"
                  }`} />
                  <span>Par Tâche</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        
        <CardContent>
          {viewType === "postes" ? (
            <div className="space-y-6">
              {postes.map(poste => {
                // Filtrer les analyses pour ce poste
                const analysesDuPoste = analysesDemo.filter(a => a.poste === poste)
                
                // Calculer les scores moyens pour ce poste
                const scoresMoyens = {
                  debit: Math.round(analysesDuPoste.reduce((acc, a) => acc + a.score.debit, 0) / analysesDuPoste.length),
                  absorption: Math.round(analysesDuPoste.reduce((acc, a) => acc + a.score.absorption, 0) / analysesDuPoste.length),
                  recuperation: Math.round(analysesDuPoste.reduce((acc, a) => acc + a.score.recuperation, 0) / analysesDuPoste.length),
                  environnement: Math.round(analysesDuPoste.reduce((acc, a) => acc + a.score.environnement, 0) / analysesDuPoste.length),
                  orage: Math.round(analysesDuPoste.reduce((acc, a) => acc + a.score.orage, 0) / analysesDuPoste.length)
                }
                
                return (
                  <div key={poste} className="bg-slate-800/30 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-3">{poste}</h3>
                    <div className="grid grid-cols-5 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-blue-400">Débit</span>
                        <span className="text-xl font-bold text-white">{scoresMoyens.debit}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-400">Absorption</span>
                        <span className="text-xl font-bold text-white">{scoresMoyens.absorption}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-green-400">Récupération</span>
                        <span className="text-xl font-bold text-white">{scoresMoyens.recuperation}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-purple-400">Environnement</span>
                        <span className="text-xl font-bold text-white">{scoresMoyens.environnement}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-orange-400">Orage</span>
                        <span className="text-xl font-bold text-white">{scoresMoyens.orage}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {taches.map(tache => {
                // Filtrer les analyses pour cette tâche
                const analysesDeTache = analysesDemo.filter(a => a.tache === tache)
                
                // Calculer les scores moyens pour cette tâche
                const scoresMoyens = {
                  debit: Math.round(analysesDeTache.reduce((acc, a) => acc + a.score.debit, 0) / analysesDeTache.length),
                  absorption: Math.round(analysesDeTache.reduce((acc, a) => acc + a.score.absorption, 0) / analysesDeTache.length),
                  recuperation: Math.round(analysesDeTache.reduce((acc, a) => acc + a.score.recuperation, 0) / analysesDeTache.length),
                  environnement: Math.round(analysesDeTache.reduce((acc, a) => acc + a.score.environnement, 0) / analysesDeTache.length),
                  orage: Math.round(analysesDeTache.reduce((acc, a) => acc + a.score.orage, 0) / analysesDeTache.length)
                }
                
                return (
                  <div key={tache} className="bg-slate-800/30 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-3">{tache}</h3>
                    <div className="grid grid-cols-5 gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-blue-400">Débit</span>
                        <span className="text-xl font-bold text-white">{scoresMoyens.debit}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-400">Absorption</span>
                        <span className="text-xl font-bold text-white">{scoresMoyens.absorption}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-green-400">Récupération</span>
                        <span className="text-xl font-bold text-white">{scoresMoyens.recuperation}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-purple-400">Environnement</span>
                        <span className="text-xl font-bold text-white">{scoresMoyens.environnement}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-orange-400">Orage</span>
                        <span className="text-xl font-bold text-white">{scoresMoyens.orage}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Liste des analyses */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Mes Analyses</CardTitle>
          <CardDescription className="text-gray-400">
            Consultez toutes vos analyses
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {analysesTries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Aucune analyse disponible</p>
              </div>
            ) : (
              analysesTries.map(analyse => (
                <div key={analyse.id} className="bg-slate-800/30 p-4 rounded-lg hover:bg-slate-800/50 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-medium text-white">{analyse.poste}</h3>
                      <p className="text-sm text-gray-400">{analyse.tache} - {new Date(analyse.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-blue-400">Débit</span>
                        <span className="text-sm font-bold text-white">{analyse.score.debit}%</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-400">Absorption</span>
                        <span className="text-sm font-bold text-white">{analyse.score.absorption}%</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-green-400">Récupération</span>
                        <span className="text-sm font-bold text-white">{analyse.score.recuperation}%</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-purple-400">Environnement</span>
                        <span className="text-sm font-bold text-white">{analyse.score.environnement}%</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-orange-400">Orage</span>
                        <span className="text-sm font-bold text-white">{analyse.score.orage}%</span>
                      </div>
                      <div className="flex flex-col items-center ml-4 pl-4 border-l border-gray-700">
                        <span className="text-xs text-white">Score global</span>
                        <span className="text-lg font-bold text-white">{analyse.scoreGlobal}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
