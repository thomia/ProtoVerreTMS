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
  }
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
      environnement: 65
    }
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
      environnement: 80
    }
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
      environnement: 90
    }
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
      environnement: Math.round(analysesDemo.reduce((acc, analyse) => acc + analyse.score.environnement, 0) / analysesDemo.length)
    }
  }
  
  // Obtenir la liste des postes uniques
  const postes = Array.from(new Set(analysesDemo.map(a => a.poste)))
  
  // Obtenir la liste des tâches uniques
  const taches = Array.from(new Set(analysesDemo.map(a => a.tache)))

  return (
    <div className="space-y-8">
      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-blue-400 flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Débit Moyen
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
              Absorption Moyenne
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
              Récupération Moyenne
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
              Environnement Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statsGlobales.scoresMoyens.environnement}%</div>
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
                  environnement: Math.round(analysesDuPoste.reduce((acc, a) => acc + a.score.environnement, 0) / analysesDuPoste.length)
                }
                
                return (
                  <div key={poste} className="bg-slate-800/30 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-3">{poste}</h3>
                    <div className="grid grid-cols-4 gap-4">
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
                  environnement: Math.round(analysesDeTache.reduce((acc, a) => acc + a.score.environnement, 0) / analysesDeTache.length)
                }
                
                return (
                  <div key={tache} className="bg-slate-800/30 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-white mb-3">{tache}</h3>
                    <div className="grid grid-cols-4 gap-4">
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
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dernières analyses */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Dernières Analyses</CardTitle>
          <CardDescription className="text-gray-400">
            Les analyses les plus récentes
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {analysesDemo.map(analyse => (
              <div key={analyse.id} className="bg-slate-800/30 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-2 md:mb-0">
                  <h4 className="text-lg font-medium text-white">{analyse.poste}</h4>
                  <p className="text-sm text-gray-400">{analyse.tache} - {new Date(analyse.date).toLocaleDateString('fr-FR')}</p>
                </div>
                
                <div className="flex items-center space-x-4">
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
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
