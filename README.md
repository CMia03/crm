# HR Manager - Système de Gestion des Ressources Humaines

Application complète de gestion des ressources humaines construite avec Next.js, TypeScript et shadcn/ui.

## 🚀 Fonctionnalités

### Dashboard
- Vue d'ensemble des statistiques clés
- Indicateurs de performance
- Activités récentes

### Gestion des Employés
- Liste complète des employés
- Ajout, modification et suppression d'employés
- Informations détaillées (contact, département, poste, salaire, etc.)
- Gestion des contacts d'urgence

### Gestion des Départements
- Création et gestion des départements
- Attribution de managers
- Suivi du budget par département
- Nombre d'employés par département

### Gestion des Postes
- Définition des postes et positions
- Niveaux (Junior, Intermédiaire, Senior, Manager)
- Fourchettes salariales
- Exigences et compétences requises

### Gestion des Congés
- Demandes de congés (vacances, maladie, personnel, etc.)
- Approbation/refus des demandes
- Calcul automatique du nombre de jours
- Suivi des statuts (en attente, approuvé, refusé)

### Évaluations de Performance
- Création d'évaluations périodiques
- Scores sur 5 critères (Performance, Communication, Esprit d'équipe, Initiative, Leadership)
- Points forts et points à améliorer
- Définition d'objectifs

### Formations
- Planification de formations
- Types : Technique, Compétences comportementales, Management
- Gestion des participants
- Suivi des statuts (programmée, terminée, annulée)

### Recrutements
- Création de postes à pourvoir
- Gestion des candidats
- Suivi des candidatures (en attente, entretien, embauché, refusé)
- Processus de recrutement complet

## 🛠️ Technologies

- **Next.js 16** - Framework React
- **TypeScript** - Typage statique
- **shadcn/ui** - Composants UI modernes
- **Tailwind CSS** - Styling
- **localStorage** - Persistance des données (simulation backend)

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Démarrer le serveur de production
npm start
```

## 📁 Structure du Projet

```
crm-r/
├── app/                    # Pages Next.js
│   ├── page.tsx           # Dashboard
│   ├── employees/         # Gestion des employés
│   ├── departments/       # Gestion des départements
│   ├── positions/         # Gestion des postes
│   ├── leaves/            # Gestion des congés
│   ├── evaluations/       # Évaluations
│   ├── trainings/         # Formations
│   └── recruitments/      # Recrutements
├── components/             # Composants React
│   ├── ui/                # Composants shadcn/ui
│   └── layout/            # Composants de layout
├── data/                  # Données JSON mockées
│   ├── employees.json
│   ├── departments.json
│   ├── positions.json
│   ├── leaves.json
│   ├── evaluations.json
│   ├── trainings.json
│   └── recruitments.json
└── lib/                   # Utilitaires
    ├── data.ts            # Gestion des données (localStorage)
    ├── types.ts           # Types TypeScript
    └── utils.ts           # Fonctions utilitaires
```

## 💾 Stockage des Données

Les données sont stockées dans le **localStorage** du navigateur, ce qui permet :
- La persistance des modifications entre les sessions
- Aucun backend requis
- Données initiales chargées depuis les fichiers JSON

Pour réinitialiser les données, supprimez les clés `hr_*` du localStorage de votre navigateur.

## 🎨 Design

L'application utilise **shadcn/ui** pour une interface moderne et cohérente :
- Composants accessibles
- Mode sombre/clair automatique
- Design responsive
- Animations fluides

## 📝 Notes

- Les données sont persistées localement dans le navigateur
- Les modifications sont sauvegardées automatiquement
- Les données initiales proviennent des fichiers JSON dans `/data`
- L'application fonctionne entièrement côté client (pas de backend)

## 🔄 Fonctionnalités Futures Possibles

- Export des données en CSV/PDF
- Calendrier intégré
- Notifications
- Graphiques et rapports avancés
- Authentification utilisateur
- Multi-utilisateurs avec rôles

## 📄 Licence

Ce projet est un exemple d'application de gestion RH.
