"use client"

import React, { useState, useEffect } from 'react'
import { BaseSettingsHeader } from '@/components/ui/base-settings-header'
import BaseSettingsForm from './base-settings-form'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'

interface SettingsTemplateProps {
  title: string
  description?: string
  currentValue: number
  scoreType: 'tap' | 'glass' | 'straw' | 'bubble' | 'storm'
  onValueChange: (value: number) => void
  getValueDescription: (value: number) => string
  children: React.ReactNode
  tabs?: {
    id: string
    label: string
    content: React.ReactNode
  }[]
}

export function SettingsTemplate({
  title,
  description,
  currentValue,
  scoreType,
  onValueChange,
  getValueDescription,
  children,
  tabs
}: SettingsTemplateProps) {
  const [autoSave, setAutoSave] = useState(false)
  const [activeTab, setActiveTab] = useState(tabs && tabs.length > 0 ? tabs[0].id : '')

  // Charger les préférences de sauvegarde automatique
  useEffect(() => {
    const savedAutoSave = getLocalStorage(`${scoreType}AutoSave`)
    if (savedAutoSave !== null) {
      setAutoSave(savedAutoSave === 'true')
    }
  }, [scoreType])

  // Gérer le changement d'état de la sauvegarde automatique
  const handleAutoSaveChange = (checked: boolean) => {
    setAutoSave(checked)
    setLocalStorage(`${scoreType}AutoSave`, checked.toString())
  }

  // Gérer la soumission du formulaire
  const handleSubmit = () => {
    // Émettre un événement pour notifier les autres composants
    const eventName = `${scoreType}UpdateEvent`
    const eventDetail = scoreType === 'tap' 
      ? { flowRate: currentValue }
      : scoreType === 'glass'
        ? { capacity: currentValue }
        : scoreType === 'straw'
          ? { recoveryCapacity: currentValue }
          : scoreType === 'bubble'
            ? { environmentScore: currentValue }
            : { intensity: currentValue }
    
    const event = new CustomEvent(eventName, { detail: eventDetail })
    window.dispatchEvent(event)
    
    // Sauvegarder dans localStorage
    const storageKey = scoreType === 'tap' 
      ? 'flowRate'
      : scoreType === 'glass'
        ? 'glassCapacity'
        : scoreType === 'straw'
          ? 'absorptionRate'
          : scoreType === 'bubble'
            ? 'environmentScore'
            : 'stormIntensity'
    
    setLocalStorage(storageKey, currentValue.toString())
    emitStorageEvent()
  }

  return (
    <div className="space-y-6">
      <BaseSettingsHeader
        title={title}
        description={description}
        currentValue={currentValue}
        getValueDescription={getValueDescription}
        scoreType={scoreType}
      />

      {tabs && tabs.length > 0 ? (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className={`data-[state=active]:${
                  scoreType === 'tap' ? 'bg-blue-900/50 text-blue-300' :
                  scoreType === 'glass' ? 'bg-gray-800/50 text-white' :
                  scoreType === 'straw' ? 'bg-green-900/50 text-green-300' :
                  scoreType === 'bubble' ? 'bg-purple-900/50 text-purple-300' :
                  'bg-amber-900/50 text-amber-300'
                }`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {tabs.map(tab => (
            <TabsContent key={tab.id} value={tab.id}>
              <Card className="border-gray-800 bg-gray-950/50">
                <CardContent className="pt-6">
                  <BaseSettingsForm
                    title={title}
                    currentValue={currentValue}
                    getValueDescription={getValueDescription}
                    onSubmit={handleSubmit}
                    scoreType={scoreType}
                    showSaveMessage={true}
                    autoSave={autoSave}
                    onAutoSaveChange={handleAutoSaveChange}
                    hideHeader={true}
                  >
                    {tab.content}
                  </BaseSettingsForm>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card className="border-gray-800 bg-gray-950/50">
          <CardContent className="pt-6">
            <BaseSettingsForm
              title={title}
              currentValue={currentValue}
              getValueDescription={getValueDescription}
              onSubmit={handleSubmit}
              scoreType={scoreType}
              showSaveMessage={true}
              autoSave={autoSave}
              onAutoSaveChange={handleAutoSaveChange}
              hideHeader={true}
            >
              {children}
            </BaseSettingsForm>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
