# 🔐 Configuration des Secrets GitHub

## 📋 Secrets requis

Vous devez configurer ces secrets dans votre repository GitHub :

### 1. Aller dans les paramètres du repository
- Allez sur : https://github.com/ztalali09/linkedin-post-generator
- Cliquez sur **Settings** (onglet en haut)
- Dans le menu de gauche, cliquez sur **Secrets and variables** → **Actions**

### 2. Ajouter les secrets suivants

#### 🔑 GEMINI_API_KEY
- **Nom** : `GEMINI_API_KEY`
- **Valeur** : `AIzaSyA1ds3nwuFrlw4xmTWz25FvWZJiO5qnAGE`
- **Description** : Clé API Gemini 2.5 Flash pour la génération de contenu

#### 🤖 TELEGRAM_BOT_TOKEN
- **Nom** : `TELEGRAM_BOT_TOKEN`
- **Valeur** : `8432791411:AAGRitXf4h7FOZNTvOJD08vuNGcByV3fFfA`
- **Description** : Token du bot Telegram

#### 💬 TELEGRAM_CHAT_ID
- **Nom** : `TELEGRAM_CHAT_ID`
- **Valeur** : `7828724589`
- **Description** : ID du chat Telegram pour recevoir les posts

#### 🎨 UNSPLASH_ACCESS_KEY (optionnel)
- **Nom** : `UNSPLASH_ACCESS_KEY`
- **Valeur** : `wRcMCC950Uor09pS2ool-Xbtw6ROp22UbMKXdCSkweI`
- **Description** : Clé API Unsplash pour les images

## 🚀 Test de la configuration

### 1. Vérifier que les secrets sont configurés
- Allez dans l'onglet **Actions** de votre repository
- Vous devriez voir le workflow "🤖 Auto Post LinkedIn Generator"

### 2. Tester manuellement
- Cliquez sur le workflow
- Cliquez sur **Run workflow**
- Sélectionnez la branche `main`
- Cliquez sur **Run workflow**

### 3. Vérifier les logs
- Cliquez sur l'exécution en cours
- Vérifiez que tous les secrets sont détectés
- Le post devrait être envoyé sur Telegram

## ⏰ Planification automatique

### Horaires configurés
- **9h UTC (10h France)** : Post du matin
- **14h UTC (15h France)** : Post de l'après-midi

### Modifier les horaires
Si vous voulez changer les horaires, éditez le fichier `.github/workflows/auto-post.yml` :
```yaml
- cron: '0 8 * * *'  # 9h UTC = 10h France
- cron: '0 13 * * *' # 14h UTC = 15h France
```

## 🔧 Maintenance

### Vérifier les logs
1. Allez dans **Actions** de votre repository
2. Cliquez sur la dernière exécution
3. Vérifiez les logs pour détecter les erreurs

### Redémarrer le bot
- Le bot se redémarre automatiquement à chaque push
- Pour forcer un redémarrage, poussez un commit vide

## 📞 Support

### En cas de problème
1. Vérifiez que tous les secrets sont configurés
2. Testez le workflow manuellement
3. Vérifiez les logs GitHub Actions

### Contact
- GitHub Issues pour les bugs
- Telegram pour les tests rapides

---

## ✅ Checklist de déploiement

- [ ] Repository GitHub créé
- [ ] Secrets configurés (GEMINI_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
- [ ] Workflow GitHub Actions activé
- [ ] Test manuel réussi
- [ ] Posts automatiques programmés (9h et 14h)
- [ ] Bot Telegram fonctionnel

🎉 **Votre système est maintenant déployé et automatisé !**
