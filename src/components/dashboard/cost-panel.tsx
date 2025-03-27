import { BookOpen, EuroIcon } from "lucide-react";
import Link from "next/link";

interface CostPanelProps {
  bodyParts: {
    name: string;
    angle: number;
    risk: "low" | "medium" | "high";
    hasHistory: boolean;
  }[];
  accidentRisk: number;
  tmsRisk: number;
}

export function CostPanel({ bodyParts, accidentRisk, tmsRisk }: CostPanelProps) {
  return (
    <div className="space-y-6">
      {/* Première colonne - Ressources utiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
            <h2 className="text-2xl font-bold text-white text-center">Ressources utiles</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-white mb-3 text-center">Tableaux des maladies professionnelles</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <Link 
                  href="https://www.inrs.fr/publications/bdd/mp/tableau.html?refINRS=RG%2057"
                  className="text-xl text-blue-400 hover:text-blue-300 hover:underline text-center"
                  target="_blank"
                >
                  Tableau 57 - Affections périarticulaires
                </Link>
                <Link 
                  href="https://www.inrs.fr/publications/bdd/mp/tableau.html?refINRS=RG%2079"
                  className="text-xl text-blue-400 hover:text-blue-300 hover:underline text-center"
                  target="_blank"
                >
                  Tableau 79 - Lésions chroniques du ménisque
                </Link>
                <Link 
                  href="https://www.inrs.fr/publications/bdd/mp/tableau.html?refINRS=RG%2069"
                  className="text-xl text-blue-400 hover:text-blue-300 hover:underline text-center"
                  target="_blank"
                >
                  Tableau 69 - Vibrations et chocs transmis au système main/bras
                </Link>
                <Link 
                  href="https://www.inrs.fr/publications/bdd/mp/tableau.html?refINRS=RG%2098"
                  className="text-xl text-blue-400 hover:text-blue-300 hover:underline text-center"
                  target="_blank"
                >
                  Tableau 98 - Lésions des nerfs périphériques
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-white mb-3 text-center">Documentation complémentaire</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <Link 
                  href="https://www.inrs.fr/risques/tms-troubles-musculosquelettiques/ce-qu-il-faut-retenir.html"
                  className="text-xl text-blue-400 hover:text-blue-300 hover:underline text-center"
                  target="_blank"
                >
                  INRS - Troubles musculosquelettiques (TMS)
                </Link>
                <Link 
                  href="https://travail-emploi.gouv.fr/sante-au-travail/prevention-des-risques-pour-la-sante-au-travail/article/troubles-musculo-squelettiques"
                  className="text-xl text-blue-400 hover:text-blue-300 hover:underline text-center"
                  target="_blank"
                >
                  Ministère du Travail - Guide de prévention
                </Link>
                <Link 
                  href="https://www.ameli.fr/entreprise/sante-travail/risques/troubles-musculosquelettiques-tms"
                  className="text-xl text-blue-400 hover:text-blue-300 hover:underline text-center"
                  target="_blank"
                >
                  Ameli - Prévention des TMS en entreprise
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Deuxième colonne - Impact financier */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <EuroIcon className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-medium text-white text-center">Impact financier des accidents</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-white mb-2 flex items-center gap-2 justify-center">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                Coûts directs
              </h4>
              <ul className="space-y-2 text-xl text-gray-300 text-center">
                <li className="flex items-start gap-2 justify-center">
                  <span className="text-xl mt-1">•</span>
                  <span>Indemnités journalières (60% du salaire brut)</span>
                </li>
                <li className="flex items-start gap-2 justify-center">
                  <span className="text-xl mt-1">•</span>
                  <span>Frais médicaux et pharmaceutiques</span>
                </li>
                <li className="flex items-start gap-2 justify-center">
                  <span className="text-xl mt-1">•</span>
                  <span>Rentes en cas d'incapacité permanente</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white mb-2 flex items-center gap-2 justify-center">
                <div className="w-3 h-3 rounded-full bg-orange-400" />
                Coûts indirects
              </h4>
              <ul className="space-y-2 text-xl text-gray-300 text-center">
                <li className="flex items-start gap-2 justify-center">
                  <span className="text-xl mt-1">•</span>
                  <span>Augmentation des cotisations AT/MP</span>
                </li>
                <li className="flex items-start gap-2 justify-center">
                  <span className="text-xl mt-1">•</span>
                  <span>Remplacement et formation</span>
                </li>
                <li className="flex items-start gap-2 justify-center">
                  <span className="text-xl mt-1">•</span>
                  <span>Baisse de productivité</span>
                </li>
              </ul>

              <div className="mt-8" style={{ transform: 'translateX(-50%)' }}>
                <div className="flex items-center justify-center gap-8">
                  <span className="text-5xl">!</span>
                  <span className="text-xl text-yellow-400/90 text-justify">Les coûts indirects peuvent représenter jusqu'à 3 fois le montant des coûts directs, impactant significativement la performance de l'entreprise.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}