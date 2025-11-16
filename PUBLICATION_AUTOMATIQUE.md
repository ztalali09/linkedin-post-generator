# ⏰ Publication Automatique LinkedIn avec Notification Telegram

## 🎯 Fonctionnalité

Le système publie automatiquement des posts sur LinkedIn à **9h et 14h**, **du lundi au vendredi uniquement** (pas le weekend), et vous envoie une notification Telegram à chaque publication.

## 🚀 Utilisation

### Option 1 : Script Local

```bash
node auto_post_scheduler.js
```

Le script va :
- ✅ Générer un post avec Gemini
- ✅ Publier automatiquement sur LinkedIn
- ✅ Envoyer une notification Telegram avec le post et le lien LinkedIn
- ✅ Publier à **9h et 14h**, **du lundi au vendredi uniquement**

### Option 2 : GitHub Actions (Recommandé pour 24/7)

Le workflow `.github/workflows/auto-post.yml` est configuré pour publier :
- **9h** : Post du matin
- **14h** : Post de l'après-midi
- **Du lundi au vendredi uniquement** (pas le weekend)

Pour activer :
1. Allez dans votre repo GitHub → **Actions**
2. Le workflow se déclenche automatiquement aux horaires configurés
3. Vous recevrez une notification Telegram à chaque publication

## ⚙️ Configuration

### Variables d'environnement

Dans votre `.env` :

```bash
# Publication LinkedIn automatique
AUTO_PUBLISH_LINKEDIN=true  # true pour publier, false pour seulement Telegram
```

### Horaires de publication

Les horaires sont fixés à **9h et 14h** (heure locale). Pour les modifier, éditez `auto_post_scheduler.js` :

```javascript
const CONFIG = {
  postTimes: [9, 14], // Modifier ici (ex: [8, 12, 18] pour 8h, 12h, 18h)
  // ...
};
```

## 📱 Notifications Telegram

À chaque publication, vous recevrez sur Telegram :
- ✅ Le contenu du post généré
- ✅ L'image (si disponible)
- ✅ Le lien vers le post LinkedIn (si publié)
- ✅ Les statistiques (type, longueur, etc.)

## 🔧 Modifier les horaires GitHub Actions

Éditez `.github/workflows/auto-post.yml` :

```yaml
schedule:
  - cron: '0 9 * * 1-5'   # 9h, du lundi au vendredi
  - cron: '0 14 * * 1-5'  # 14h, du lundi au vendredi
  - cron: '0 18 * * 1-5'  # 18h, du lundi au vendredi (ajouter)
```

Format cron : `minute heure jour mois jour-semaine`
- `1-5` = lundi à vendredi (exclut le weekend)
- `0-6` = tous les jours

## 🛑 Arrêter le script local

Appuyez sur `Ctrl+C` pour arrêter proprement le planificateur.

## 📊 Exemple de Notification Telegram

```
🤖 Post LinkedIn Généré Automatiquement

📄 Type: project_completed
📏 Longueur: 450 caractères
🖼️  Image: ✅

✅ Publié sur LinkedIn !
🔗 Voir le post

📝 Contenu:
[Contenu du post...]
```

## ✅ Checklist

- [x] Script de publication automatique créé
- [x] Notification Telegram intégrée
- [x] Publication LinkedIn automatique
- [x] Configuration flexible (intervalle)
- [x] GitHub Actions mis à jour

## 🎉 C'est Prêt !

Lancez simplement :
```bash
node auto_post_scheduler.js
```

Et le système publiera automatiquement sur LinkedIn avec notifications Telegram ! 🚀

