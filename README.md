# ProtoVerre TMS

## Avis de Copyright et Propriété Intellectuelle

© 2024 Thomas RELOT. Tous droits réservés.

Ce projet est protégé par les lois sur la propriété intellectuelle et le droit d'auteur. Toute utilisation non autorisée est strictement interdite.

## Description

ProtoVerre TMS est une application SaaS qui présente un tableau de bord interactif avec trois éléments principaux:

1. **Un verre** - Qui peut se remplir et se vider
2. **Une paille** - Qui permet d'aspirer le contenu du verre
3. **Un robinet** - Qui permet de remplir le verre
4. **Une bulle** - Qui permet d'imager l'environnement de travail et influer sur le débit de remplissage du verre

Chaque élément est paramétrable et mène à une page dédiée où l'utilisateur peut configurer son comportement.

## Fonctionnalités

- Tableau de bord visuel avec des éléments interactifs
- Animation et comportement dynamique de chaque composant
- Pages de paramètres pour chaque composant

## Technologies utilisées

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React
- Shadcn UI

## Installation

1. Clonez ce dépôt
2. Installez les dépendances:

```bash
npm install
```

3. Lancez le serveur de développement:

```bash
npm run dev
```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Structure du projet

```
src/
├── app/                    # Pages de l'application
│   ├── glass-settings/     # Page de paramètres du verre
│   ├── straw-settings/     # Page de paramètres de la paille
│   ├── tap-settings/       # Page de paramètres du robinet
│   └── page.tsx            # Page d'accueil avec le tableau de bord
├── components/             # Composants React
│   ├── dashboard/          # Composants du tableau de bord
│   │   ├── dashboard.tsx   # Composant principal du tableau de bord
│   │   ├── glass.tsx       # Composant du verre
│   │   ├── straw.tsx       # Composant de la paille
│   │   └── tap.tsx         # Composant du robinet
│   ├── settings/           # Formulaires de paramètres
│   │   ├── glass-settings-form.tsx
│   │   ├── straw-settings-form.tsx
│   │   └── tap-settings-form.tsx
│   └── theme-provider.tsx  # Fournisseur de thème
├── lib/                    # Utilitaires et fonctions
└── styles/                 # Styles CSS
    └── globals.css         # Styles globaux
```

## Protection Légale

Ce logiciel est protégé par :
- Une licence MIT restrictive
- Des droits d'auteur
- Des restrictions d'utilisation commerciale

Voir les fichiers suivants pour plus de détails :
- `LICENSE` : Conditions d'utilisation restrictives
- `COPYRIGHT` : Avis de droit d'auteur détaillé
- `CONTRIBUTING.md` : Règles de contribution

## Contact

Pour toute demande concernant l'utilisation, la licence ou la collaboration :
- Auteur : Thomas RELOT
- Email : thomas.relot@gmail.com

## Protection du Logiciel

### Mesures de Protection

1. **Protection Juridique**
   - Dépôt APP (Agence de Protection des Programmes)
   - Copyright international
   - Licence restrictive personnalisée

2. **Protection Technique**
   - Code source minifié et obfusqué en production
   - Authentification et autorisation strictes
   - Monitoring des accès et des utilisations

3. **Droits Réservés**
   - Droits moraux : paternité du code et intégrité
   - Droits patrimoniaux : exploitation commerciale
   - Droits de modification et d'adaptation

4. **Restrictions d'Utilisation**
   - Interdiction de décompilation
   - Interdiction de modification
   - Interdiction de distribution

### Mentions Légales

1. **Propriété Intellectuelle**
   - Logiciel déposé à l'INPI
   - Marque "ProtoVerreTMS" protégée
   - Algorithmes propriétaires

2. **Confidentialité**
   - Code source confidentiel
   - Méthodes de calcul protégées
   - Documentation interne privée

3. **Sanctions**
   - Poursuites civiles et pénales
   - Dommages et intérêts
   - Cessation immédiate d'utilisation

### Protection des Droits

En cas de violation des droits de propriété intellectuelle :
1. Mise en demeure immédiate
2. Actions en contrefaçon
3. Demande de dommages et intérêts
4. Retrait des copies non autorisées

## Avertissement

Toute utilisation, reproduction ou modification non autorisée de ce logiciel est strictement interdite et peut faire l'objet de poursuites légales. 
