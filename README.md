# 🤖 Test Gemini 2.5 Flash Standalone

Ce dossier contient tous les fichiers nécessaires pour exécuter le test Gemini 2.5 Flash avec envoi Telegram.

## 📁 Fichiers inclus

- `test_gemini_complete.js` - Test principal
- `generate_authentic_varied_posts.js` - Générateur de posts avec IA
- `database.js` - Base de données SQLite
- `image_system.js` - Système de recherche d'images
- `test_telegram_simple.js` - Fonctions Telegram
- `fallback_posts.js` - Posts de fallback
- `package.json` - Dépendances NPM

## 🚀 Installation

```bash
cd gemini_test_standalone
npm install
```

## 🔧 Configuration

```bash
export GEMINI_API_KEY="votre_clé_gemini"
```

## ▶️ Exécution

```bash
npm test
# ou
node test_gemini_complete.js
```

## 📱 Fonctionnalités

- ✅ Génération de posts authentiques avec Gemini 2.5 Flash
- ✅ Recherche d'images intelligentes
- ✅ Envoi automatique sur Telegram
- ✅ Sauvegarde en base de données
- ✅ Évitement des répétitions
- ✅ Tronquage automatique pour Telegram

## 🎯 Résultat

Le test génère un post LinkedIn authentique et l'envoie sur Telegram avec une image pertinente.
