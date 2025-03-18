import { BackgroundBeamsWithCollisionDemo } from "@/components/ui/background-beams-demo";
import Link from "next/link";

export default function BeamsDemoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Démonstration des Beams</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
      
      <div className="flex-1">
        <BackgroundBeamsWithCollisionDemo />
      </div>
    </div>
  );
} 