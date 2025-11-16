# ✅ Configuration LinkedIn API - Votre Application

## 📋 Informations de votre Application

Votre application LinkedIn est déjà créée et configurée ! Voici les détails :

- **Client ID**: `VOTRE_CLIENT_ID`
- **Client Secret**: `VOTRE_CLIENT_SECRET`
- **Type**: Standalone app
- **Créée le**: 12 octobre 2025

## ✅ Permissions (Scopes) Configurées

Votre application a déjà les permissions nécessaires :

- ✅ `w_member_social` - **Créer, modifier et supprimer des posts, commentaires et réactions** (ESSENTIEL pour publier)
- ✅ `openid` - Utiliser votre nom et photo
- ✅ `profile` - Utiliser votre nom et photo
- ✅ `email` - Utiliser l'adresse email principale
- ✅ `r_events` - Récupérer les événements de votre organisation
- ✅ `rw_events` - Gérer les événements de votre organisation

**Parfait !** Vous avez tout ce qu'il faut pour publier des posts.

## 🚀 Prochaines Étapes

### 1. Créer le fichier .env

Créez un fichier `.env` à la racine du projet avec ce contenu :

```bash
# LinkedIn API
LINKEDIN_CLIENT_ID=VOTRE_CLIENT_ID
LINKEDIN_CLIENT_SECRET=VOTRE_CLIENT_SECRET
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback

# Ces tokens seront générés automatiquement
LINKEDIN_ACCESS_TOKEN=
LINKEDIN_REFRESH_TOKEN=
LINKEDIN_PERSON_ID=
```

**⚠️ Important** : Ajoutez `.env` à votre `.gitignore` pour ne pas commiter vos secrets !

### 2. Configurer l'URL de Redirection dans LinkedIn

1. Allez sur **https://www.linkedin.com/developers/apps**
2. Connectez-vous si nécessaire
3. Cliquez sur votre application (celle avec le Client ID: `78adz8e0zbd9dn`)
4. Cliquez sur l'onglet **"Auth"**
5. Dans **"Authorized redirect URLs for your app"**, ajoutez :
   ```
   http://localhost:3000/auth/linkedin/callback
   ```
4. Cliquez sur **"Update"**

### 3. Obtenir un Access Token

Exécutez le script d'authentification :

```bash
node linkedin_auth.js
```

Le script va :
1. ✅ Générer une URL d'autorisation avec vos identifiants
2. ✅ Démarrer un serveur local sur le port 3000
3. ✅ Vous demander d'ouvrir l'URL dans votre navigateur
4. ✅ Vous connecter à LinkedIn et autoriser l'application
5. ✅ Échanger le code contre un access token
6. ✅ Sauvegarder automatiquement les tokens dans `.env`

### 4. Vérifier la Configuration

Après l'authentification, votre fichier `.env` devrait contenir :

```bash
LINKEDIN_CLIENT_ID=VOTRE_CLIENT_ID
LINKEDIN_CLIENT_SECRET=VOTRE_CLIENT_SECRET
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback
LINKEDIN_ACCESS_TOKEN=AQT... (token long)
LINKEDIN_REFRESH_TOKEN=AQT... (token long)
LINKEDIN_PERSON_ID=urn:li:person:xxxxx
```

### 5. Tester la Publication

1. Démarrez votre bot Telegram :
   ```bash
   node telegram_bot.js
   ```

2. Générez un post avec le bouton "🤖 Générer un Post"

3. Cliquez sur "🔗 Publier sur LinkedIn"

4. Le post devrait être publié automatiquement ! 🎉

## 🔍 Dépannage

### Erreur "redirect_uri_mismatch"

- Vérifiez que l'URL de redirection dans LinkedIn correspond exactement à celle dans `.env`
- L'URL doit être : `http://localhost:3000/auth/linkedin/callback`

### Erreur "invalid_client"

- Vérifiez que le Client ID et Client Secret sont corrects dans `.env`
- Pas d'espaces avant/après les valeurs

### Token expiré (après 60 jours)

- Exécutez à nouveau : `node linkedin_auth.js`
- Ou utilisez le refresh token automatiquement

### Permission refusée

- Vérifiez que `w_member_social` est bien dans les scopes
- Vérifiez que "Share on LinkedIn" est approuvé dans Products

## 📚 Ressources

- **Portail développeurs** : https://www.linkedin.com/developers/apps/78adz8e0zbd9dn
- **Documentation API** : https://learn.microsoft.com/en-us/linkedin/
- **Guide complet** : Voir `LINKEDIN_API_SETUP.md`

## ✅ Checklist

- [x] Application LinkedIn créée
- [x] Client ID et Secret obtenus
- [x] Permissions `w_member_social` configurées
- [ ] Fichier `.env` créé avec les identifiants
- [ ] URL de redirection configurée dans LinkedIn
- [ ] Access token obtenu via `node linkedin_auth.js`
- [ ] Test de publication réussi

Une fois toutes les cases cochées, vous êtes prêt ! 🚀

