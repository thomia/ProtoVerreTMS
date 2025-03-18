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
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-6 h-6 text-gray-400" />
        <h2 className="text-xl font-bold text-white">Ressources utiles</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-base font-medium text-white mb-3">Tableaux des maladies professionnelles</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <Link 
              href="https://www.inrs.fr/publications/bdd/mp/tableau.html?refINRS=RG%2057"
              className="text-blue-400 hover:text-blue-300 hover:underline text-sm"
              target="_blank"
            >
              Tableau 57 - Affections périarticulaires
            </Link>
            <Link 
              href="https://www.inrs.fr/publications/bdd/mp/tableau.html?refINRS=RG%2079"
              className="text-blue-400 hover:text-blue-300 hover:underline text-sm"
              target="_blank"
            >
              Tableau 79 - Lésions chroniques du ménisque
            </Link>
            <Link 
              href="https://www.inrs.fr/publications/bdd/mp/tableau.html?refINRS=RG%2069"
              className="text-blue-400 hover:text-blue-300 hover:underline text-sm"
              target="_blank"
            >
              Tableau 69 - Vibrations et chocs transmis au système main/bras
            </Link>
            <Link 
              href="https://www.inrs.fr/publications/bdd/mp/tableau.html?refINRS=RG%2098"
              className="text-blue-400 hover:text-blue-300 hover:underline text-sm"
              target="_blank"
            >
              Tableau 98 - Affections chroniques du rachis lombaire
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium text-white mb-3">Documentation complémentaire</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <Link 
              href="https://www.inrs.fr/risques/tms-troubles-musculosquelettiques/ce-qu-il-faut-retenir.html"
              className="text-blue-400 hover:text-blue-300 hover:underline text-sm"
              target="_blank"
            >
              INRS - Troubles musculosquelettiques (TMS)
            </Link>
            <Link 
              href="https://travail-emploi.gouv.fr/sante-au-travail/prevention-des-risques-pour-la-sante-au-travail/article/troubles-musculo-squelettiques"
              className="text-blue-400 hover:text-blue-300 hover:underline text-sm"
              target="_blank"
            >
              Ministère du Travail - Guide de prévention
            </Link>
            <Link 
              href="https://www.ameli.fr/entreprise/sante-travail/risques/troubles-musculosquelettiques-tms"
              className="text-blue-400 hover:text-blue-300 hover:underline text-sm"
              target="_blank"
            >
              Ameli - Prévention des TMS en entreprise
            </Link>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <EuroIcon className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-medium text-white">Impact financier des accidents</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                Coûts directs
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span>Indemnités journalières (60% du salaire brut)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span>Frais médicaux et pharmaceutiques</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span>Rentes en cas d'incapacité permanente</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                Coûts indirects
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span>Augmentation des cotisations AT/MP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span>Remplacement et formation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span>Baisse de productivité</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4 text-sm text-yellow-400/90">
            <span className="text-xs">!</span>
            <span> Les coûts indirects peuvent représenter jusqu'à 3 fois le montant des coûts directs, impactant significativement la performance de l'entreprise.</span>
          </div>
        </div>
      </div>
    </div>
  );
} 