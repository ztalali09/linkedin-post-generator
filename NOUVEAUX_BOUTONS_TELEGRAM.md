# 🎮 Nouveaux Boutons Telegram - Guide d'Utilisation

## ✅ Boutons Ajoutés

### 1. 📋 **Choisir un Sujet**
Permet de sélectionner manuellement le sujet du post parmi les sujets disponibles.

**Fonctionnement :**
- Récupère les sujets disponibles via `getTrendingTopics()`
- Filtre les sujets déjà traités
- Affiche jusqu'à 10 sujets avec leurs angles et priorités
- Chaque sujet est un bouton cliquable
- Génère le post avec le sujet sélectionné

**Avantages :**
- ✅ Contrôle total sur le sujet choisi
- ✅ Voir tous les sujets disponibles avant de choisir
- ✅ Évite les sujets déjà traités automatiquement

---

### 2. ✏️ **Reformuler le Texte**
Permet de demander à Gemini de reformuler et améliorer le texte du post actuel.

**Fonctionnement :**
- Utilise le texte du dernier post généré
- Envoie une requête à Gemini avec le contexte (type, sujet, angle)
- Gemini reformule le texte en gardant le même message
- Améliore la clarté, l'impact et l'engagement
- Met à jour le post avec le nouveau texte

**Avantages :**
- ✅ Améliore automatiquement le texte
- ✅ Garde le même message et angle
- ✅ Optimise pour LinkedIn
- ✅ Peut améliorer l'accroche

---

## 📋 Nouveau Clavier Après Génération

Après avoir généré un post, vous verrez maintenant :

```
┌─────────────────────────────────┐
│ 🔄 Changer la Photo  │ ✏️ Reformuler │
├─────────────────────────────────┤
│ 📋 Choisir un Sujet  │ 🤖 Nouveau Post │
├─────────────────────────────────┤
│ 📊 Statistiques     │ ℹ️ Aide         │
└─────────────────────────────────┘
```

---

## 🎯 Comment Utiliser

### Utiliser "Choisir un Sujet"

1. **Cliquer sur "📋 Choisir un Sujet"**
2. **Voir la liste des sujets** avec :
   - Le titre du sujet
   - L'angle d'approche
   - La priorité (1-5)
3. **Cliquer sur le numéro du sujet** souhaité
4. **Attendre la génération** du post avec ce sujet
5. **Recevoir le post** avec image et statistiques

**Exemple :**
```
📋 Sujets disponibles (5) :

1. Apprendre Vue.js pour développeurs
   Angle: Comparaison avec React et avantages pour débutants...
   Priorité: 4/5

2. Stage développeur web à Belfort
   Angle: Opportunités locales et entreprises...
   Priorité: 5/5

3. Git : essentiel pour tous les projets
   Angle: Partage d'expérience et conseils pratiques...
   Priorité: 3/5

💡 Sélectionnez un sujet ci-dessous :
```

---

### Utiliser "Reformuler le Texte"

1. **Générer un post** (ou avoir un post récent)
2. **Cliquer sur "✏️ Reformuler le Texte"**
3. **Attendre** que Gemini reformule (quelques secondes)
4. **Recevoir le nouveau texte** amélioré
5. **Le post est mis à jour** avec le nouveau texte

**Exemple de reformulation :**

**Avant :**
```
J'ai appris Vue.js cette semaine. C'est cool.
J'ai fait un projet avec. C'est bien.
```

**Après (reformulé) :**
```
🎯 Ma première semaine avec Vue.js : mon retour

Après avoir testé React et Vue.js, j'ai choisi Vue.js pour mon projet.

3 raisons de ce choix :
→ Syntaxe plus simple et intuitive
→ Documentation claire et complète
→ Performance excellente pour des projets moyens

Résultat : projet terminé 2 jours plus tôt que prévu !

Quel framework préférez-vous pour débuter ?
```

---

## 🔧 Détails Techniques

### Fonction `chooseTopic()`
- Récupère les topics via `getTrendingTopics()`
- Filtre les topics déjà traités (BDD)
- Crée des boutons dynamiques (max 10)
- Stocke les topics dans `availableTopics`

### Fonction `generatePostWithTopic()`
- Génère un post avec le topic sélectionné
- Utilise `findBestStructureForTopic()` pour la structure
- Génère le contenu avec `generatePostContent()`
- Recherche une image avec le système multi-APIs
- Stocke le post dans `lastGeneratedPost`

### Fonction `reformulateText()`
- Utilise `callGeminiAPI()` avec prompt spécialisé
- Parse la réponse avec parsing robuste
- Met à jour `lastGeneratedPost.json.content`
- Peut mettre à jour les suggestions d'images

---

## 📊 Callbacks Gérés

Nouveaux callbacks ajoutés :

1. **`choose_topic`** → Affiche la liste des sujets
2. **`select_topic_0`** → Génère post avec sujet index 0
3. **`select_topic_1`** → Génère post avec sujet index 1
4. ... (jusqu'à `select_topic_9`)
5. **`reformulate_text`** → Reformule le texte actuel
6. **`back_to_menu`** → Retour au menu principal

---

## 🎯 Cas d'Usage

### Scénario 1 : Choisir un sujet spécifique
```
1. Cliquer "📋 Choisir un Sujet"
2. Voir la liste
3. Choisir "Stage développeur web à Belfort"
4. Générer le post avec ce sujet
```

### Scénario 2 : Améliorer un texte
```
1. Générer un post
2. Lire le texte
3. Si le texte n'est pas optimal
4. Cliquer "✏️ Reformuler le Texte"
5. Recevoir le texte amélioré
```

### Scénario 3 : Combiner les deux
```
1. Choisir un sujet spécifique
2. Générer le post
3. Si le texte n'est pas parfait
4. Reformuler le texte
5. Si l'image ne convient pas
6. Changer la photo
```

---

## ⚠️ Notes Importantes

### Pour "Choisir un Sujet" :
- Les sujets sont filtrés (déjà traités exclus)
- Maximum 10 sujets affichés
- Si tous les sujets sont traités, générez un nouveau post
- Les sujets sont stockés temporairement dans `availableTopics`

### Pour "Reformuler le Texte" :
- Nécessite un post récent (`lastGeneratedPost`)
- Utilise Gemini 2.0 Flash (consomme des tokens)
- Le texte reformulé remplace l'ancien
- Les hashtags sont conservés si présents
- L'image reste la même (utilisez "Changer la Photo" si besoin)

---

## 🚀 Améliorations Futures Possibles

1. **Sauvegarder plusieurs versions** du texte reformulé
2. **Comparer avant/après** la reformulation
3. **Choisir le style** de reformulation (plus professionnel, plus engageant, etc.)
4. **Filtrer les sujets** par priorité ou type
5. **Rechercher** dans les sujets disponibles

---

## ✅ Tout est Prêt !

Les nouveaux boutons sont intégrés et fonctionnels. Vous pouvez maintenant :
- ✅ Choisir précisément le sujet de votre post
- ✅ Reformuler et améliorer le texte automatiquement
- ✅ Avoir plus de contrôle sur la génération

**Testez maintenant depuis votre bot Telegram !** 🎉

