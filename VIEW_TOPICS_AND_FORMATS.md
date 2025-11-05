# 📊 Voir les Sujets et Formats de Posts

## 🔍 Comment voir les sujets traités par votre système

### 1. Afficher les sujets récents traités

```javascript
const { showTreatedTopics } = require('./generate_authentic_varied_posts.js');

// Afficher les 30 derniers sujets traités
await showTreatedTopics(30);
```

### 2. Afficher la répartition des formats utilisés

```javascript
const { showFormatDistribution } = require('./generate_authentic_varied_posts.js');

// Voir la répartition des formats sur les 50 derniers posts
await showFormatDistribution(50);
```

### 3. Voir les domaines de sujets explorés

```javascript
const { showTopicDomains } = require('./generate_authentic_varied_posts.js');

// Afficher tous les domaines de sujets que le système explore
showTopicDomains();
```

## 🎯 Domaines de Sujets Explorés

Votre système génère dynamiquement des sujets basés sur **9 domaines** :

1. **Tendances tech actuelles** (frameworks, langages, outils)
2. **Actualités des entreprises tech locales** (Belfort, Franche-Comté)
3. **Nouvelles de l'industrie** (Alstom, Peugeot, SNCF, transport, énergie)
4. **Éducation et carrière dev** (recrutement, stages, formations)
5. **Freelancing et business** (tendances, conseils, outils)
6. **Green Tech et développement durable**
7. **Événements tech et meetups** (local et national)
8. **Success stories de jeunes développeurs**
9. **Challenges techniques et solutions innovantes**

## 📈 Variété des Formats

Le système évite automatiquement les formats récemment utilisés :

- ✅ **11 formats différents** disponibles
- ✅ **Répartition optimisée** : Projets (35%), Apprentissage (30%), Veille (20%), Personnel (15%)
- ✅ **Pénalisation automatique** : Les formats récemment utilisés ont 30% moins de chance d'être sélectionnés
- ✅ **Historique tracké** : Les 10 derniers formats utilisés sont pris en compte

## 🚀 Exemple d'utilisation complète

```javascript
const {
  showTreatedTopics,
  showFormatDistribution,
  showTopicDomains,
  showDatabaseStats
} = require('./generate_authentic_varied_posts.js');

async function viewAllInfo() {
  // 1. Voir les domaines explorés
  showTopicDomains();
  
  // 2. Voir les sujets traités
  await showTreatedTopics(30);
  
  // 3. Voir la répartition des formats
  await showFormatDistribution(50);
  
  // 4. Voir les stats générales
  await showDatabaseStats();
}

viewAllInfo();
```

## 📝 Formats Disponibles

### Projets (35%)
- `project_completed` : Projet terminé avec stack technique
- `project_milestone` : Étape importante d'un projet
- `project_showcase` : Présentation visuelle d'un projet

### Apprentissage (30%)
- `learning_skill` : Nouvelle compétence acquise
- `learning_concept` : Concept technique expliqué simplement
- `learning_certification` : Certification obtenue

### Veille (20%)
- `tech_news` : Actualité tech commentée
- `tech_event` : Participation à un événement tech

### Personnel (15%)
- `personal_reflection` : Réflexion sur le parcours
- `personal_challenge` : Défi surmonté
- `internship_search` : Recherche de stage

