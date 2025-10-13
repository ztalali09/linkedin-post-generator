#!/bin/bash

# 🚀 Script de déploiement automatique du bot GitHub Actions
# Fonctionne 24h/24 sans machine allumée !

echo "🚀 Déploiement du Bot LinkedIn Post Generator (GitHub Actions)"
echo "⏰ $(date)"
echo ""

# Vérifier les variables d'environnement
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ GEMINI_API_KEY manquante !"
    echo "💡 Configurez les variables d'environnement"
    exit 1
fi

if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ TELEGRAM_BOT_TOKEN manquant !"
    echo "💡 Configurez les variables d'environnement"
    exit 1
fi

if [ -z "$TELEGRAM_CHAT_ID" ]; then
    echo "❌ TELEGRAM_CHAT_ID manquant !"
    echo "💡 Configurez les variables d'environnement"
    exit 1
fi

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN manquant !"
    echo "💡 Créez un token GitHub :"
    echo "   1. Allez sur https://github.com/settings/tokens"
    echo "   2. Generate new token → Personal access token"
    echo "   3. Sélectionnez 'repo' (accès complet aux repositories)"
    echo "   4. Copiez le token et ajoutez-le comme GITHUB_TOKEN"
    exit 1
fi

echo "✅ Variables d'environnement configurées"
echo "🔑 Bot Token: ${TELEGRAM_BOT_TOKEN:0:10}..."
echo "💬 Chat ID: $TELEGRAM_CHAT_ID"
echo "🐙 GitHub Repo: ztalali09/linkedin-post-generator"
echo "🔑 GitHub Token: ${GITHUB_TOKEN:0:10}..."
echo ""

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

echo "🤖 Démarrage du bot webhook handler..."
echo "🚀 Fonctionne 24h/24 via GitHub Actions !"
echo ""

# Démarrer le bot webhook handler
node telegram_webhook_handler.js
