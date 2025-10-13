#!/bin/bash

# 🤖 Script de démarrage automatique du bot LinkedIn Post Generator
# Pour GitHub Codespaces - Bot 24h/24 GRATUIT

echo "🚀 Démarrage du Bot LinkedIn Post Generator sur GitHub Codespaces..."
echo "⏰ $(date)"
echo ""

# Vérifier les variables d'environnement
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ GEMINI_API_KEY manquante !"
    echo "💡 Configurez les variables d'environnement dans Codespaces"
    exit 1
fi

if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ TELEGRAM_BOT_TOKEN manquant !"
    echo "💡 Configurez les variables d'environnement dans Codespaces"
    exit 1
fi

if [ -z "$TELEGRAM_CHAT_ID" ]; then
    echo "❌ TELEGRAM_CHAT_ID manquant !"
    echo "💡 Configurez les variables d'environnement dans Codespaces"
    exit 1
fi

echo "✅ Variables d'environnement configurées"
echo "🔑 Bot Token: ${TELEGRAM_BOT_TOKEN:0:10}..."
echo "💬 Chat ID: $TELEGRAM_CHAT_ID"
echo ""

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

echo "🤖 Démarrage du bot..."
echo "🚀 Fonctionne 24h/24 sur GitHub Codespaces !"
echo ""

# Démarrer le bot
node telegram_bot.js
