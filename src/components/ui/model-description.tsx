import { motion } from "framer-motion";
import { AnimatedTitle } from "./animated-title";

export function ModelDescription() {
  return (
    <div className="w-full max-w-[100rem] mx-auto">
      <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-gray-50/80 to-gray-100/90 backdrop-blur-xl border border-gray-200/50 rounded-xl p-8 shadow-lg mx-[-16rem]">
        {/* Effet de gradient animé en arrière-plan */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-indigo-100/20 to-blue-100/20 animate-[shimmer_4s_infinite]" />
        
        {/* Contenu avec effet de profondeur */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8 items-center">
            {/* Description */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-center gap-3">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-400 via-indigo-400 to-blue-500 rounded-full" />
                <h1 className="text-4xl font-bold tracking-tighter text-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-indigo-600 to-gray-800">
                    Evaluez et anticipez les impacts du travail sur la santé
                  </span>
                </h1>
              </div>
              
              <div className="flex flex-col gap-4">
                <p className="text-xl md:text-2xl leading-relaxed text-gray-600 [text-wrap:balance] text-center">
                  Ce modèle dynamique et ludique illustre l'équilibre entre les contraintes physiques et mentales du travail (
                  <span className="font-bold text-blue-600">Robinet</span>
                  ), la capacité du corps à les absorber (
                  <span className="font-bold text-gray-700">Verre</span>
                  ), les possibilités et stratégies de récupération (
                  <span className="font-bold text-green-600">Paille</span>
                  ), et l'influence de l'environnement de travail sur cet ensemble (
                  <span className="font-bold text-purple-600">Bulle</span>
                  ).
                </p>
                <p className="text-2xl md:text-3xl font-semibold text-center bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 bg-clip-text text-transparent px-4 py-2">
                  Ajustez les paramètres de chaque composant et découvrez comment le modèle se comporte.
                </p>
              </div>
            </div>

            {/* Titre animé */}
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-50/90 to-white/80 backdrop-blur-xl border border-gray-200/50 p-6 shadow-md">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-indigo-100/20 to-blue-100/20 animate-[pulse_4s_infinite]" />
              <div className="relative">
                <AnimatedTitle />
              </div>
            </div>
          </div>
        </div>

        {/* Effets de brillance améliorés */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 via-indigo-200/10 to-transparent rounded-tl-xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-200/20 via-blue-200/10 to-transparent rounded-br-xl" />
      </div>
    </div>
  );
} 