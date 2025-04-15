"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Plus, Trash2, Upload, Volume2, VolumeX, Activity, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import GlassComponent from "@/components/dashboard/glass-component"
import TapComponent from "@/components/dashboard/tap-component"
import StrawComponent from "@/components/dashboard/straw-component"
import StormComponent from "@/components/dashboard/storm-component"
import { EnvironmentParticles } from "@/components/dashboard/environment-particles"

// Types pour les paramètres du modèle du verre
interface TaskParameters {
  flowRate: number;         // Débit (0-100)
  glassCapacity: number;    // Capacité du verre (0-100)
  absorptionRate: number;   // Taux d'absorption (0-100)
  environmentScore: number; // Score environnemental (0-100)
  stormIntensity: number;   // Intensité de l'orage (0-100)
}

// Type pour les tâches avec paramètres
interface Task {
  id: number;
  name: string;
  start: number;
  end: number;
  color: string;
  parameters: TaskParameters;
}

export default function VideoTaskEditor() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [tasks, setTasks] = useState<Array<Task>>([])
  const [selectedTask, setSelectedTask] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
    }
  }

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSkipBack = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5)
    }
  }

  const handleSkipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5)
    }
  }

  // Update current time when video is playing
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  // Set video duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  // Add a new task
  const addTask = () => {
    const newTask: Task = {
      id: Date.now(),
      name: `Tâche ${tasks.length + 1}`,
      start: currentTime,
      end: Math.min(currentTime + 10, duration),
      color: "#ADD8E6",
      parameters: {
        flowRate: 50,
        glassCapacity: 50,
        absorptionRate: 50,
        environmentScore: 50,
        stormIntensity: 50,
      },
    }
    setTasks([...tasks, newTask])
    setSelectedTask(newTask.id)
  }

  // Delete selected task
  const deleteTask = () => {
    if (selectedTask !== null) {
      setTasks(tasks.filter((task) => task.id !== selectedTask))
      setSelectedTask(null)
    }
  }

  // Mettre à jour les paramètres d'une tâche
  const updateTaskParameters = (taskId: number, paramName: keyof TaskParameters, value: number) => {
    if (taskId !== null) {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              parameters: { 
                ...task.parameters, 
                [paramName]: value 
              } 
            } 
          : task
      ));
    }
  };

  // Obtenir les paramètres de la tâche actuelle en fonction de la position de lecture
  const getCurrentTaskParameters = (): TaskParameters => {
    const currentTask = tasks.find(task => 
      currentTime >= task.start && currentTime <= task.end
    );
    
    return currentTask?.parameters || {
      flowRate: 0,
      glassCapacity: 50,
      absorptionRate: 0,
      environmentScore: 0,
      stormIntensity: 0
    };
  };

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Get current task based on playback position
  const getCurrentTask = () => {
    return tasks.find((task) => currentTime >= task.start && currentTime <= task.end) || null;
  };

  useEffect(() => {
    const currentTask = getCurrentTask();
    if (currentTask) {
      setSelectedTask(currentTask.id);
    }
  }, [currentTime, tasks]);

  // Handle timeline click to seek
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (timelineRef.current && videoRef.current) {
      const rect = timelineRef.current.getBoundingClientRect()
      const clickPosition = (e.clientX - rect.left) / rect.width
      videoRef.current.currentTime = clickPosition * duration
    }
  }

  // Handle progress bar click to seek
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickPosition = (e.clientX - rect.left) / rect.width
      videoRef.current.currentTime = clickPosition * duration
    }
  }

  // Fonction pour déplacer une tâche
  const moveTask = (e: React.MouseEvent<HTMLDivElement>, taskId: number) => {
    e.stopPropagation()

    if (timelineRef.current) {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return

      const rect = timelineRef.current.getBoundingClientRect()
      const taskWidth = ((task.end - task.start) / duration) * rect.width

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newPosition = ((moveEvent.clientX - rect.left - taskWidth / 2) / rect.width) * duration
        const taskDuration = task.end - task.start

        // Ensure task stays within timeline bounds
        const newStart = Math.max(0, Math.min(duration - taskDuration, newPosition))
        const newEnd = newStart + taskDuration

        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, start: newStart, end: newEnd } : t)))
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }
  }

  // Fonction pour redimensionner une tâche (début)
  const resizeTaskStart = (e: React.MouseEvent<HTMLDivElement>, taskId: number) => {
    e.stopPropagation()

    if (timelineRef.current) {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return

      const rect = timelineRef.current.getBoundingClientRect()

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newStart = ((moveEvent.clientX - rect.left) / rect.width) * duration

        // Ensure start doesn't exceed end - 1
        const adjustedStart = Math.max(0, Math.min(task.end - 1, newStart))

        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, start: adjustedStart } : t)))
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }
  }

  // Fonction pour redimensionner une tâche (fin)
  const resizeTaskEnd = (e: React.MouseEvent<HTMLDivElement>, taskId: number) => {
    e.stopPropagation()

    if (timelineRef.current) {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return

      const rect = timelineRef.current.getBoundingClientRect()

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newEnd = ((moveEvent.clientX - rect.left) / rect.width) * duration

        // Ensure end doesn't go below start + 1
        const adjustedEnd = Math.min(duration, Math.max(task.start + 1, newEnd))

        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, end: adjustedEnd } : t)))
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }
  }

  // Fonction pour renommer une tâche
  const renameTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const newName = prompt("Entrez un nouveau nom pour cette tâche:", task.name)
    if (newName !== null) {
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, name: newName } : t)))
    }
  }

  return (
    <div className="p-6 text-white">
      {!videoSrc ? (
        <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-gray-500 rounded-lg">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-400 mb-4">Téléchargez une vidéo pour commencer l'analyse</p>
          <label htmlFor="video-upload">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              onClick={() => document.getElementById('video-upload')?.click()}
            >
              Sélectionner une vidéo
            </Button>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Grille principale */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Colonne de gauche - Vidéo */}
            <div className="bg-slate-900/80 rounded-lg p-4">
              {videoSrc ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    className="w-full rounded-lg"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                  ></video>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-slate-700 rounded-lg">
                  <Upload className="h-12 w-12 text-slate-500 mb-4" />
                  <p className="text-slate-400 mb-4">Déposez votre vidéo ici ou cliquez pour parcourir</p>
                  <Button variant="outline" size="sm" className="relative">
                    Parcourir
                    <input
                      type="file"
                      accept="video/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                    />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Colonne de droite - Modèle du verre et paramètres */}
            <div className="bg-slate-900/80 rounded-lg p-4 flex flex-col">
              {/* Visualisation du modèle du verre */}
              <div className="bg-slate-950/50 p-4 rounded-lg flex-grow">
                {selectedTask ? (
                  <>
                    <div className="flex flex-col items-center justify-end relative" style={{ height: '800px', paddingBottom: '5px' }}>
                      {/* Bulle (environnement) */}
                      <div className="absolute inset-0 z-10">
                        <EnvironmentParticles 
                          score={tasks.find(t => t.id === selectedTask)?.parameters.environmentScore || 0}
                          isPaused={false}
                        />
                      </div>
                      
                      {/* Robinet avec filet d'eau intégré - Repositionné plus bas */}
                      <div className="relative z-20 mt-[350px]">
                        <TapComponent 
                          flowRate={tasks.find(t => t.id === selectedTask)?.parameters.flowRate || 0} 
                          onFlowRateChange={() => {}}
                          hideDebitLabel={true}
                        />
                      </div>
                      
                      {/* Orage - positionné entre le robinet et le verre */}
                      <div className="relative z-20 scale-90 mt-[-80px] mb-[50px] ml-[-80px]">
                        <StormComponent 
                          intensity={tasks.find(t => t.id === selectedTask)?.parameters.stormIntensity || 0} 
                          onIntensityChange={() => {}}
                          hideIntensityLabel={true} 
                        />
                      </div>
                      
                      {/* Verre avec paille */}
                      <div className="scale-100 mt-[-20px] relative z-10 mb-0">
                        <div className="relative">
                          <GlassComponent 
                            fillLevel={tasks.find(t => t.id === selectedTask)?.parameters.flowRate || 0} 
                            absorptionRate={tasks.find(t => t.id === selectedTask)?.parameters.absorptionRate || 0}
                            width={tasks.find(t => t.id === selectedTask)?.parameters.glassCapacity || 50}
                            hideColorLegend={true}
                          />
                          
                          {/* Paille positionnée dans le verre */}
                          <div className="absolute top-[-230px] right-[-5px] z-20">
                            <StrawComponent 
                              absorptionRate={tasks.find(t => t.id === selectedTask)?.parameters.absorptionRate || 0} 
                              setAbsorptionRate={() => {}} 
                              isInsideGlass={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[650px]">
                    <p className="text-slate-400 text-center">
                      Sélectionnez une tâche pour visualiser le modèle du verre
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Barre de contrôle inférieure - Contient les contrôles vidéo et les paramètres */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Contrôles vidéo */}
            <div className="bg-slate-900/60 rounded-lg p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="h-8 w-8"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSkipBack}
                  className="h-8 w-8"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-xs font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={[volume * 100]}
                  min={0}
                  max={100}
                  step={1}
                  className="w-24 [&_[role=slider]]:h-2 [&_[role=slider]]:w-2"
                  onValueChange={(value) => setVolume(value[0] / 100)}
                />
              </div>
            </div>
            
            {/* Contrôles des paramètres - Version compacte en bas */}
            {selectedTask && (
              <div className="bg-slate-900/60 rounded-lg p-2">
                {/* Titre de la tâche */}
                <h3 className="text-lg font-medium text-center mb-3 text-white">
                  Tâche: {tasks.find(t => t.id === selectedTask)?.name}
                </h3>
                
                <div className="grid grid-cols-5 gap-2">
                  {/* Débit */}
                  <div className="relative bg-slate-800/60 p-2 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-blue-400" />
                        <label className="text-xs font-medium">Débit</label>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 rounded-full hover:bg-slate-700"
                        onClick={() => alert("Paramètres avancés du débit")}
                      >
                        <Settings className="h-3 w-3 text-blue-400" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Slider
                        value={[tasks.find(t => t.id === selectedTask)?.parameters.flowRate || 0]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => updateTaskParameters(selectedTask, 'flowRate', value[0])}
                        className="[&_[role=slider]]:h-2 [&_[role=slider]]:w-2 [&_[role=slider]]:bg-blue-400"
                      />
                      <span className="text-xs font-medium text-blue-400 w-6 text-right">
                        {tasks.find(t => t.id === selectedTask)?.parameters.flowRate}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Capacité du verre */}
                  <div className="relative bg-slate-800/60 p-2 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-green-400" />
                        <label className="text-xs font-medium">Capacité</label>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 rounded-full hover:bg-slate-700"
                        onClick={() => alert("Paramètres avancés de la capacité")}
                      >
                        <Settings className="h-3 w-3 text-green-400" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Slider
                        value={[tasks.find(t => t.id === selectedTask)?.parameters.glassCapacity || 0]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => updateTaskParameters(selectedTask, 'glassCapacity', value[0])}
                        className="[&_[role=slider]]:h-2 [&_[role=slider]]:w-2 [&_[role=slider]]:bg-green-400"
                      />
                      <span className="text-xs font-medium text-green-400 w-6 text-right">
                        {tasks.find(t => t.id === selectedTask)?.parameters.glassCapacity}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Taux d'absorption */}
                  <div className="relative bg-slate-800/60 p-2 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-purple-400" />
                        <label className="text-xs font-medium">Absorption</label>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 rounded-full hover:bg-slate-700"
                        onClick={() => alert("Paramètres avancés de l'absorption")}
                      >
                        <Settings className="h-3 w-3 text-purple-400" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Slider
                        value={[tasks.find(t => t.id === selectedTask)?.parameters.absorptionRate || 0]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => updateTaskParameters(selectedTask, 'absorptionRate', value[0])}
                        className="[&_[role=slider]]:h-2 [&_[role=slider]]:w-2 [&_[role=slider]]:bg-purple-400"
                      />
                      <span className="text-xs font-medium text-purple-400 w-6 text-right">
                        {tasks.find(t => t.id === selectedTask)?.parameters.absorptionRate}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Score environnemental */}
                  <div className="relative bg-slate-800/60 p-2 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-yellow-400" />
                        <label className="text-xs font-medium">Environnement</label>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 rounded-full hover:bg-slate-700"
                        onClick={() => alert("Paramètres avancés de l'environnement")}
                      >
                        <Settings className="h-3 w-3 text-yellow-400" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Slider
                        value={[tasks.find(t => t.id === selectedTask)?.parameters.environmentScore || 0]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => updateTaskParameters(selectedTask, 'environmentScore', value[0])}
                        className="[&_[role=slider]]:h-2 [&_[role=slider]]:w-2 [&_[role=slider]]:bg-yellow-400"
                      />
                      <span className="text-xs font-medium text-yellow-400 w-6 text-right">
                        {tasks.find(t => t.id === selectedTask)?.parameters.environmentScore}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Intensité de l'orage */}
                  <div className="relative bg-slate-800/60 p-2 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-orange-400" />
                        <label className="text-xs font-medium">Orage</label>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 rounded-full hover:bg-slate-700"
                        onClick={() => alert("Paramètres avancés de l'orage")}
                      >
                        <Settings className="h-3 w-3 text-orange-400" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Slider
                        value={[tasks.find(t => t.id === selectedTask)?.parameters.stormIntensity || 0]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => updateTaskParameters(selectedTask, 'stormIntensity', value[0])}
                        className="[&_[role=slider]]:h-2 [&_[role=slider]]:w-2 [&_[role=slider]]:bg-orange-400"
                      />
                      <span className="text-xs font-medium text-orange-400 w-6 text-right">
                        {tasks.find(t => t.id === selectedTask)?.parameters.stormIntensity}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Timeline et contrôles des tâches */}
          <div className="mt-4 bg-slate-900/80 rounded-lg p-4">
            {/* Timeline */}
            <div ref={timelineRef} className="relative h-20 mx-0 mt-1 cursor-pointer bg-slate-900/80 rounded-lg p-2" onClick={handleTimelineClick}>
              {/* Background grid */}
              <div className="absolute top-0 left-0 right-0 bottom-0 grid grid-cols-10 gap-0">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="border-l border-slate-700 h-full"></div>
                ))}
              </div>

              {/* Time markers */}
              {duration > 0 &&
                Array.from({ length: Math.ceil(duration / 50) + 1 }).map((_, index) => (
                  <div
                    key={index}
                    className="absolute text-xs text-gray-400"
                    style={{ left: `${((index * 50) / duration) * 100}%`, top: "-12px" }}
                  >
                    {index * 50}
                  </div>
                ))}

              {/* Task segments */}
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`absolute h-10 flex items-center justify-center text-white text-xs cursor-move ${
                    selectedTask === task.id ? "border-2 border-white" : ""
                  }`}
                  style={{
                    left: `${(task.start / Math.max(duration, 1)) * 100}%`,
                    width: `${((task.end - task.start) / Math.max(duration, 1)) * 100}%`,
                    backgroundColor: "#FF9800",
                    top: "4px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedTask(task.id)
                  }}
                  onMouseDown={(e) => moveTask(e, task.id)}
                >
                  <div
                    className="truncate px-2"
                    onDoubleClick={(e) => {
                      e.stopPropagation()
                      renameTask(task.id)
                    }}
                  >
                    {task.name}
                  </div>
                  {/* Keyframe markers and resize handles */}
                  <div
                    className="absolute -bottom-1 left-0 w-3 h-3 bg-[#FF9800] transform rotate-45 cursor-w-resize"
                    onMouseDown={(e) => resizeTaskStart(e, task.id)}
                  ></div>
                  <div
                    className="absolute -bottom-1 right-0 w-3 h-3 bg-[#FF9800] transform rotate-45 cursor-e-resize"
                    onMouseDown={(e) => resizeTaskEnd(e, task.id)}
                  ></div>
                </div>
              ))}

              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-blue-500"
                style={{
                  left: `${(currentTime / Math.max(duration, 1)) * 100}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full -mt-1 -ml-[5px]"></div>
              </div>

              {/* Scrubber bar */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-500"
                  style={{ width: `${(currentTime / Math.max(duration, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Contrôles des tâches */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-2 rounded-lg">
              <Button
                variant="outline"
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white border-none flex items-center gap-1"
                onClick={addTask}
              >
                <Plus className="h-4 w-4" />
                Ajouter une tâche
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white border-none flex items-center gap-1"
                onClick={deleteTask}
                disabled={selectedTask === null}
              >
                <Trash2 className="h-4 w-4" />
                Supprimer une tâche
              </Button>
              
              <div className="ml-auto flex items-center gap-2 text-sm">
                <span>Start: </span>
                <Input
                  type="number"
                  className="w-16 h-8 bg-slate-700 text-white border-slate-600"
                  value={selectedTask ? tasks.find((t) => t.id === selectedTask)?.start.toFixed(0) || 0 : 0}
                  onChange={(e) => {
                    if (selectedTask !== null) {
                      const newStart = Number(e.target.value)
                      setTasks(
                        tasks.map((task) =>
                          task.id === selectedTask
                            ? { ...task, start: newStart, end: Math.max(task.end, newStart + 1) }
                            : task,
                        ),
                      )
                    }
                  }}
                />
                <span>End: </span>
                <Input
                  type="number"
                  className="w-16 h-8 bg-slate-700 text-white border-slate-600"
                  value={selectedTask ? tasks.find((t) => t.id === selectedTask)?.end.toFixed(0) || 0 : 0}
                  onChange={(e) => {
                    if (selectedTask !== null) {
                      const newEnd = Number(e.target.value)
                      setTasks(
                        tasks.map((task) =>
                          task.id === selectedTask
                            ? { ...task, end: newEnd, start: Math.min(task.start, newEnd - 1) }
                            : task,
                        ),
                      )
                    }
                  }}
                />
                <span>Position: {formatTime(currentTime)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
