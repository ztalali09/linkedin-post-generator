# 🧠 Moteur de Recommandation Prédictif - LinkedIn Score

## 📊 Formule de Scoring

Le système calcule un **LinkedIn Score** pour chaque sujet proposé selon la formule :

```
LinkedIn Score = (Pertinence × 0.35) 
               + (Engagement Estimé × 0.30)
               + (Actualité × 0.20)
               + (Diversité × 0.15)
```

### Composantes du Score

#### 1. **Pertinence (35%)**
- **Priorité du sujet** : Basé sur la priorité assignée par Gemini (1-5)
  - Priorité 5 = 1.0 (100%)
  - Priorité 4 = 0.8 (80%)
  - Priorité 3 = 0.6 (60%)
  - Priorité 2 = 0.4 (40%)
  - Priorité 1 = 0.2 (20%)

- **Compétences techniques mentionnées** : Détecte Vue.js, Node.js, TypeScript, Express, PostgreSQL, etc.
  - Plus de technologies mentionnées = score plus élevé
  - Maximum : 3 technologies = 100%

- **Mots-clés liés au profil** : Stage, étudiant, projet, freelance, BUT, informatique, etc.
  - Maximum : 4 mots-clés = 100%

#### 2. **Engagement Estimé (30%)**
- **Performance par type de post** :
  - `internship_search` : 90% (recherche stage = très engageant)
  - `project_showcase` : 85% (présentation visuelle)
  - `project_completed` : 80%
  - `personal_reflection` : 80%
  - `project_milestone` : 75%
  - `personal_challenge` : 75%
  - `learning_certification` : 75%
  - `learning_skill` : 70%
  - `tech_event` : 70%
  - `learning_concept` : 65%
  - `tech_news` : 60%

- **Mots engageants** : Bonus +10% si le sujet contient des mots comme "appris", "découvert", "terminé", "réussi", "challenge", etc.

- **Format visuel** : Bonus +5% pour les posts visuels (project_showcase)

#### 3. **Actualité (20%)**
- **Base** : 70% (sujets générés par Gemini sont récents)
- **Mots-clés d'actualité** : "nouveau", "récent", "2025", "cette semaine", "actuel", etc.
  - Si présent : 90%
- **Mention dans relevance** : Si le champ "relevance" mentionne "semaine", "récent", "actualité"
  - Si présent : 95%

#### 4. **Diversité (15%)**
- **Base** : 80%
- **Pénalité par type** : -20% par utilisation récente du même type de format
- **Pénalité par similarité** : -15% par sujet similaire récent (au moins 2 mots-clés en commun)
- **Minimum** : 20% (même si très répétitif)

## 🎯 Utilisation

Le système calcule automatiquement le LinkedIn Score pour chaque sujet généré et affiche :

```
📊 LinkedIn Scores calculés :
   1. Score: 82.5% - "Premier projet Vue.js terminé..."
      └─ Pertinence: 85% | Engagement: 80% | Actualité: 90% | Diversité: 75%
   2. Score: 78.3% - "Nouvelle certification obtenue..."
      └─ Pertinence: 75% | Engagement: 75% | Actualité: 85% | Diversité: 80%
   3. Score: 72.1% - "Actualité tech de la semaine..."
      └─ Pertinence: 70% | Engagement: 60% | Actualité: 95% | Diversité: 70%
```

Le système sélectionne ensuite parmi les **3 meilleurs scores** pour maintenir la diversité.

## 🚀 Amélioration Future : Machine Learning (Optionnel)

Pour ajouter du Machine Learning et prédire l'engagement réel :

### Structure de données pour ML

```python
features = [
    'domain_category',      # Catégorie du domaine (projet, apprentissage, veille, personnel)
    'format_type',          # Type de format (project_completed, learning_skill, etc.)
    'technical_level',      # Niveau technique (basé sur technologies mentionnées)
    'has_visual',           # Présence d'image (0 ou 1)
    'post_length',          # Longueur du post en caractères
    'hashtag_count',        # Nombre de hashtags
    'day_of_week',          # Jour de la semaine (0-6)
    'time_of_day',          # Heure de publication (0-23)
    'priority',             # Priorité du sujet (1-5)
    'relevance_score',      # Score de pertinence calculé
    'recency_score',        # Score d'actualité calculé
    'diversity_score'       # Score de diversité calculé
]

target = 'engagement_rate'  # Taux d'engagement réel (likes + comments + shares) / vues
```

### Exemple d'implémentation

```python
# Après avoir collecté des données d'engagement réelles
from sklearn.ensemble import RandomForestRegressor
import pandas as pd

# Charger les données historiques
df = pd.read_csv('posts_history.csv')

# Préparer les features
X = df[features]
y = df['engagement_rate']

# Entraîner le modèle
model = RandomForestRegressor(n_estimators=100)
model.fit(X, y)

# Prédire l'engagement d'un nouveau sujet
new_subject_features = {
    'domain_category': 'project',
    'format_type': 'project_completed',
    'technical_level': 3,
    'has_visual': 1,
    'post_length': 1200,
    'hashtag_count': 4,
    'day_of_week': 2,  # Mercredi
    'time_of_day': 9,  # 9h
    'priority': 5,
    'relevance_score': 0.85,
    'recency_score': 0.90,
    'diversity_score': 0.75
}

predicted_engagement = model.predict([list(new_subject_features.values())])[0]
```

### Intégration dans le système actuel

Pour intégrer le ML, il faudrait :

1. **Collecter des données d'engagement** :
   - Ajouter des colonnes dans la BDD : `likes`, `comments`, `shares`, `views`
   - Mettre à jour ces métriques après publication sur LinkedIn

2. **Exporter les données** :
   - Créer une fonction pour exporter les posts + métriques en CSV
   - Inclure toutes les features nécessaires

3. **Entraîner le modèle** :
   - Script Python pour entraîner le modèle
   - Sauvegarder le modèle (pickle ou format similaire)

4. **Intégrer la prédiction** :
   - Charger le modèle dans Node.js (via child_process ou API Python)
   - Remplacer `estimateEngagement()` par la prédiction ML

## 📈 Avantages du Système Actuel

Même sans ML, le système actuel offre :

✅ **Sélection intelligente** : Les meilleurs sujets sont priorisés  
✅ **Équilibre optimal** : Pertinence + Engagement + Actualité + Diversité  
✅ **Adaptation automatique** : S'adapte à votre historique  
✅ **Transparence** : Affichage des scores et breakdown pour debug  
✅ **Prêt pour ML** : Structure prête pour ajouter du ML plus tard  

## 🔍 Exemple de Sortie

```
📡 Recherche des actualités de la semaine...
✅ 5 sujets d'actualité trouvés

📊 LinkedIn Scores calculés :
   1. Score: 82.5% - "Premier projet Vue.js terminé avec système RPG..."
      └─ Pertinence: 85% | Engagement: 80% | Actualité: 90% | Diversité: 75%
   2. Score: 78.3% - "Nouvelle certification TypeScript obtenue..."
      └─ Pertinence: 75% | Engagement: 75% | Actualité: 85% | Diversité: 80%
   3. Score: 72.1% - "Actualité tech de la semaine : Node.js 20..."
      └─ Pertinence: 70% | Engagement: 60% | Actualité: 95% | Diversité: 70%

🎯 Sujet sélectionné : Premier projet Vue.js terminé... (Priorité: 5/5 | LinkedIn Score: 82.5%)
```

Le système choisit automatiquement le sujet avec le meilleur score tout en maintenant la diversité !

