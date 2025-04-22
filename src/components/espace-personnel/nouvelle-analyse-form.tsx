"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, FileText, Clock, Calendar, Activity, Save, Video, FormInput } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VideoTaskEditor from "./video-task-editor"

export default function NouvelleAnalyseForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    poste: "",
    tache: "",
    duree: "",
    date: new Date().toISOString().split('T')[0],
    scores: {
      debit: 50,
      absorption: 50,
      recuperation: 50,
      environnement: 50,
      orage: 50
    }
  })
  
  // Liste des postes prédéfinis (à adapter selon vos besoins)
  const postes = [
    "Assemblage",
    "Emballage",
    "Contrôle Qualité",
    "Maintenance",
    "Logistique",
    "Production",
    "Autre"
  ]
  
  // Gérer les changements dans le formulaire
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  // Gérer les changements de scores
  const handleScoreChange = (scoreType: 'debit' | 'absorption' | 'recuperation' | 'environnement' | 'orage', value: number[]) => {
    setFormData(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [scoreType]: value[0]
      }
    }))
  }
  
  // Soumettre le formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Ici, vous pourriez enregistrer les données dans une base de données
    console.log("Données de l'analyse:", formData)
    
    // Rediriger vers la liste des analyses
    router.push("/espace-personnel/analyses")
  }
  
  // Fonction pour obtenir la classe de couleur en fonction de la valeur
  const getColorClass = (value: number): string => {
    if (value < 40) return "text-red-500"
    if (value < 60) return "text-yellow-500"
    if (value < 80) return "text-green-400"
    return "text-green-300"
  }

  return (
    <Tabs defaultValue="form" className="w-full">
      <TabsList className="grid grid-cols-2 mb-6 bg-slate-800/50 border border-slate-700/50">
        <TabsTrigger value="form" className="flex items-center gap-2 data-[state=active]:bg-slate-700/50">
          <FormInput className="h-4 w-4" />
          Formulaire standard
        </TabsTrigger>
        <TabsTrigger value="video" className="flex items-center gap-2 data-[state=active]:bg-slate-700/50">
          <Video className="h-4 w-4" />
          Analyse vidéo
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="form">
        <form onSubmit={handleSubmit}>
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Créer une nouvelle analyse</CardTitle>
              <CardDescription className="text-gray-400">
                Renseignez les informations concernant le poste et la tâche à analyser
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-blue-400" />
                    <Label htmlFor="poste" className="text-white">Poste de travail</Label>
                  </div>
                  <Select 
                    onValueChange={(value) => handleChange("poste", value)}
                    value={formData.poste}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="Sélectionner un poste" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      {postes.map(poste => (
                        <SelectItem key={poste} value={poste} className="hover:bg-slate-700">
                          {poste}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-400" />
                    <Label htmlFor="tache" className="text-white">Description de la tâche</Label>
                  </div>
                  <Input 
                    id="tache" 
                    placeholder="Décrivez la tâche à analyser"
                    className="bg-slate-800/50 border-slate-700 text-white"
                    value={formData.tache}
                    onChange={(e) => handleChange("tache", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-400" />
                    <Label htmlFor="duree" className="text-white">Durée de la tâche</Label>
                  </div>
                  <Input 
                    id="duree" 
                    placeholder="Ex: 2h30"
                    className="bg-slate-800/50 border-slate-700 text-white"
                    value={formData.duree}
                    onChange={(e) => handleChange("duree", e.target.value)}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-400" />
                    <Label htmlFor="date" className="text-white">Date de l'analyse</Label>
                  </div>
                  <Input 
                    id="date" 
                    type="date"
                    className="bg-slate-800/50 border-slate-700 text-white"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                  />
                </div>
              </div>
              
              {/* Paramètres de l'analyse */}
              <div className="pt-6 border-t border-slate-700/50">
                <h3 className="text-lg font-medium text-white mb-4">Paramètres de l'analyse</h3>
                
                <div className="space-y-6">
                  {/* Débit */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-blue-400" />
                        <Label className="text-white">Débit</Label>
                      </div>
                      <span className={`text-lg font-medium ${getColorClass(formData.scores.debit)}`}>
                        {formData.scores.debit}%
                      </span>
                    </div>
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      className="[&_[role=slider]]:bg-blue-400"
                      value={[formData.scores.debit]}
                      onValueChange={(value) => handleScoreChange('debit', value)}
                    />
                  </div>
                  
                  {/* Capacité d'absorption */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-gray-400" />
                        <Label className="text-white">Capacité d'absorption</Label>
                      </div>
                      <span className={`text-lg font-medium ${getColorClass(formData.scores.absorption)}`}>
                        {formData.scores.absorption}%
                      </span>
                    </div>
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      className="[&_[role=slider]]:bg-gray-400"
                      value={[formData.scores.absorption]}
                      onValueChange={(value) => handleScoreChange('absorption', value)}
                    />
                  </div>
                  
                  {/* Récupération */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-green-400" />
                        <Label className="text-white">Récupération</Label>
                      </div>
                      <span className={`text-lg font-medium ${getColorClass(formData.scores.recuperation)}`}>
                        {formData.scores.recuperation}%
                      </span>
                    </div>
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      className="[&_[role=slider]]:bg-green-400"
                      value={[formData.scores.recuperation]}
                      onValueChange={(value) => handleScoreChange('recuperation', value)}
                    />
                  </div>
                  
                  {/* Environnement */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-purple-400" />
                        <Label className="text-white">Environnement</Label>
                      </div>
                      <span className={`text-lg font-medium ${getColorClass(formData.scores.environnement)}`}>
                        {formData.scores.environnement}%
                      </span>
                    </div>
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      className="[&_[role=slider]]:bg-purple-400"
                      value={[formData.scores.environnement]}
                      onValueChange={(value) => handleScoreChange('environnement', value)}
                    />
                  </div>
                  
                  {/* Orage */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-orange-400" />
                        <Label className="text-white">Orage</Label>
                      </div>
                      <span className={`text-lg font-medium ${getColorClass(formData.scores.orage)}`}>
                        {formData.scores.orage}%
                      </span>
                    </div>
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      className="[&_[role=slider]]:bg-orange-400"
                      value={[formData.scores.orage]}
                      onValueChange={(value) => handleScoreChange('orage', value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end pt-6 border-t border-slate-700/50">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Enregistrer l'analyse
              </Button>
            </CardFooter>
          </Card>
        </form>
      </TabsContent>
      
      <TabsContent value="video">
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/80 border-slate-700/50 p-0 overflow-hidden">
          <VideoTaskEditor />
        </Card>
      </TabsContent>
    </Tabs>
  )
}
