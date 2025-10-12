# 🚀 Guide de Déploiement - Bot LinkedIn Post Generator

## 📋 Prérequis

### 🔑 Clés API requises
- **GEMINI_API_KEY** : Clé API Gemini 2.5 Flash
- **TELEGRAM_BOT_TOKEN** : Token du bot Telegram
- **TELEGRAM_CHAT_ID** : ID de votre chat Telegram
- **UNSPLASH_ACCESS_KEY** : Clé API Unsplash (optionnel)

## 🐙 Déploiement sur GitHub

### 1. Créer un repository GitHub
```bash
# Initialiser le repo
git init
git add .
git commit -m "Initial commit: LinkedIn Post Generator Bot"
git branch -M main
git remote add origin https://github.com/votre-username/linkedin-post-generator.git
git push -u origin main
```

### 2. Configurer les secrets GitHub
Dans votre repository GitHub :
1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Ajoutez ces secrets :
   - `GEMINI_API_KEY` : Votre clé API Gemini
   - `TELEGRAM_BOT_TOKEN` : Token de votre bot Telegram
   - `TELEGRAM_CHAT_ID` : ID de votre chat
   - `UNSPLASH_ACCESS_KEY` : Clé Unsplash (optionnel)

### 3. Activer GitHub Actions
- Les workflows sont automatiquement activés
- Vérifiez dans l'onglet **Actions** de votre repo

## 🤖 Configuration du Bot Telegram

### 1. Créer un bot avec @BotFather
```
/newbot
Nom: LinkedIn Post Generator
Username: votre_bot_username
```

### 2. Récupérer le Chat ID
1. Envoyez un message à votre bot
2. Visitez : `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Copiez le `chat.id` de la réponse

### 3. Tester le bot
```bash
# Mode interactif
node telegram_bot.js

# Mode automatique (pour GitHub Actions)
node telegram_bot.js --auto
```

## ⏰ Planification automatique

### 📅 Horaires configurés
- **9h UTC (10h France)** : Post du matin
- **14h UTC (15h France)** : Post de l'après-midi

### 🔧 Modifier les horaires
Éditez `.github/workflows/auto-post.yml` :
```yaml
- cron: '0 8 * * *'  # 9h UTC
- cron: '0 13 * * *' # 14h UTC
```

## 📱 Utilisation du Bot

### Boutons disponibles
- **🤖 Générer un Post LinkedIn** : Crée un nouveau post
- **📊 Statistiques** : Affiche les stats de la BDD
- **ℹ️ Aide** : Guide d'utilisation

### Commandes
- `/start` : Démarrer le bot
- `/help` : Afficher l'aide
- `/generate` : Générer un post

## 🔧 Maintenance

### Vérifier les logs
1. Allez dans **Actions** de votre repo GitHub
2. Cliquez sur la dernière exécution
3. Vérifiez les logs pour détecter les erreurs

### Mettre à jour le code
```bash
git add .
git commit -m "Update: description des changements"
git push origin main
```

### Redémarrer le bot
- Le bot se redémarre automatiquement à chaque push
- Pour forcer un redémarrage, poussez un commit vide

## 🚨 Dépannage

### Erreurs courantes
1. **"GEMINI_API_KEY manquante"**
   - Vérifiez que le secret est configuré dans GitHub
   - Nom exact : `GEMINI_API_KEY`

2. **"Erreur Telegram"**
   - Vérifiez `TELEGRAM_BOT_TOKEN` et `TELEGRAM_CHAT_ID`
   - Assurez-vous que le bot peut envoyer des messages

3. **"Rate limit"**
   - Normal, le système gère automatiquement
   - Attendez quelques minutes

### Logs utiles
```bash
# Vérifier les logs GitHub Actions
gh run list
gh run view <run-id>
```

## 📊 Monitoring

### Statistiques disponibles
- Nombre total de posts générés
- Posts avec IA vs fallback
- Types de posts uniques
- Dates de génération

### Alertes
- Le bot envoie des messages d'erreur sur Telegram
- GitHub Actions notifie en cas d'échec

## 🔄 Mise à jour

### Mise à jour automatique
- Poussez les changements sur GitHub
- Les Actions se mettent à jour automatiquement

### Mise à jour manuelle
```bash
git pull origin main
npm install
node telegram_bot.js
```

## 📞 Support

### En cas de problème
1. Vérifiez les logs GitHub Actions
2. Testez le bot en mode manuel
3. Vérifiez la configuration des secrets

### Contact
- GitHub Issues pour les bugs
- Telegram pour les tests rapides

---

## 🎯 Résumé

✅ **Bot Telegram interactif** avec boutons
✅ **Génération automatique** 2x par jour
✅ **GitHub Actions** pour l'automatisation
✅ **Système anti-répétition** intégré
✅ **Images automatiques** avec Unsplash
✅ **Contenu authentique** avec Gemini 2.5 Flash

🚀 **Votre système est prêt pour la production !**
