# ProtoVerre TMS

Un tableau de bord interactif avec un verre qui se remplit, une paille et un robinet.

## Description

ProtoVerre TMS est une application SaaS qui présente un tableau de bord interactif avec trois éléments principaux:

1. **Un verre** - Qui peut se remplir et se vider
2. **Une paille** - Qui permet d'aspirer le contenu du verre
3. **Un robinet** - Qui permet de remplir le verre

Chaque élément est cliquable et mène à une page de paramètres dédiée où l'utilisateur peut configurer son comportement.

## Fonctionnalités

- Tableau de bord visuel avec des éléments interactifs
- Animation de remplissage du verre
- Pages de paramètres pour chaque élément
- Simulation de remplissage et de vidage du verre

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

## Licence

MIT 