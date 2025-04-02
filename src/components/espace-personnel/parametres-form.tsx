"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Bell, Lock, User } from "lucide-react"

export function ParametresForm() {
  const [activeTab, setActiveTab] = useState("profil")
  const [formState, setFormState] = useState({
    // Profil
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@example.com",
    telephone: "06 12 34 56 78",
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    weeklyReport: true,
    newAnalysisAlert: true,
    
    // Confidentialité
    dataSharing: false,
    anonymousStats: true,
    saveHistory: true
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, vous pouvez envoyer les données à votre API
    console.log("Données soumises:", formState)
    // Afficher un message de succès
    alert("Paramètres enregistrés avec succès !")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-slate-900/50 border border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Mes Paramètres
          </CardTitle>
          <CardDescription>
            Personnalisez votre expérience et gérez vos préférences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3 mb-8 bg-slate-800/50">
              <TabsTrigger 
                value="profil" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600/30"
              >
                <User className="h-4 w-4" />
                <span>Profil</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600/30"
              >
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger 
                value="confidentialite" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600/30"
              >
                <Lock className="h-4 w-4" />
                <span>Confidentialité</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Profil */}
            <TabsContent value="profil" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="nom">Nom</Label>
                  <Input 
                    id="nom" 
                    value={formState.nom} 
                    onChange={(e) => handleChange("nom", e.target.value)}
                    className="bg-slate-800/50 border-slate-700"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input 
                    id="prenom" 
                    value={formState.prenom} 
                    onChange={(e) => handleChange("prenom", e.target.value)}
                    className="bg-slate-800/50 border-slate-700"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formState.email} 
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="bg-slate-800/50 border-slate-700"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input 
                    id="telephone" 
                    value={formState.telephone} 
                    onChange={(e) => handleChange("telephone", e.target.value)}
                    className="bg-slate-800/50 border-slate-700"
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="text-base">Notifications par email</Label>
                    <p className="text-sm text-gray-400">Recevoir des notifications par email</p>
                  </div>
                  <Switch 
                    id="emailNotifications" 
                    checked={formState.emailNotifications} 
                    onCheckedChange={(checked) => handleChange("emailNotifications", checked)}
                  />
                </div>
                <Separator className="bg-slate-700" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications" className="text-base">Notifications par SMS</Label>
                    <p className="text-sm text-gray-400">Recevoir des notifications par SMS</p>
                  </div>
                  <Switch 
                    id="smsNotifications" 
                    checked={formState.smsNotifications} 
                    onCheckedChange={(checked) => handleChange("smsNotifications", checked)}
                  />
                </div>
                <Separator className="bg-slate-700" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyReport" className="text-base">Rapport hebdomadaire</Label>
                    <p className="text-sm text-gray-400">Recevoir un résumé hebdomadaire de vos analyses</p>
                  </div>
                  <Switch 
                    id="weeklyReport" 
                    checked={formState.weeklyReport} 
                    onCheckedChange={(checked) => handleChange("weeklyReport", checked)}
                  />
                </div>
                <Separator className="bg-slate-700" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newAnalysisAlert" className="text-base">Alerte nouvelle analyse</Label>
                    <p className="text-sm text-gray-400">Être alerté lorsqu'une nouvelle analyse est disponible</p>
                  </div>
                  <Switch 
                    id="newAnalysisAlert" 
                    checked={formState.newAnalysisAlert} 
                    onCheckedChange={(checked) => handleChange("newAnalysisAlert", checked)}
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Confidentialité */}
            <TabsContent value="confidentialite" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dataSharing" className="text-base">Partage de données</Label>
                    <p className="text-sm text-gray-400">Autoriser le partage de vos données avec des partenaires</p>
                  </div>
                  <Switch 
                    id="dataSharing" 
                    checked={formState.dataSharing} 
                    onCheckedChange={(checked) => handleChange("dataSharing", checked)}
                  />
                </div>
                <Separator className="bg-slate-700" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="anonymousStats" className="text-base">Statistiques anonymes</Label>
                    <p className="text-sm text-gray-400">Contribuer aux statistiques anonymes pour améliorer le service</p>
                  </div>
                  <Switch 
                    id="anonymousStats" 
                    checked={formState.anonymousStats} 
                    onCheckedChange={(checked) => handleChange("anonymousStats", checked)}
                  />
                </div>
                <Separator className="bg-slate-700" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="saveHistory" className="text-base">Historique des analyses</Label>
                    <p className="text-sm text-gray-400">Conserver l'historique de vos analyses</p>
                  </div>
                  <Switch 
                    id="saveHistory" 
                    checked={formState.saveHistory} 
                    onCheckedChange={(checked) => handleChange("saveHistory", checked)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-end">
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Enregistrer les modifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
