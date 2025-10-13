#!/usr/bin/env node

/**
 * 🚀 Script de démarrage pour Render
 * Bot LinkedIn Post Generator 24h/24 GRATUIT
 */

const { startBot } = require('./telegram_bot.js');

// Vérifier les variables d'environnement
console.log('🚀 Démarrage du Bot LinkedIn Post Generator sur Render...');
console.log('⏰ ' + new Date().toLocaleString());
console.log('');

// Vérifier la configuration
if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY manquante !');
    console.log('💡 Configurez les variables d\'environnement sur Render');
    process.exit(1);
}

if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN manquant !');
    console.log('💡 Configurez les variables d\'environnement sur Render');
    process.exit(1);
}

if (!process.env.TELEGRAM_CHAT_ID) {
    console.error('❌ TELEGRAM_CHAT_ID manquant !');
    console.log('💡 Configurez les variables d\'environnement sur Render');
    process.exit(1);
}

console.log('✅ Variables d\'environnement configurées');
console.log(`🔑 Bot Token: ${process.env.TELEGRAM_BOT_TOKEN.substring(0, 10)}...`);
console.log(`💬 Chat ID: ${process.env.TELEGRAM_CHAT_ID}`);
console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configurée' : 'Manquante'}`);
console.log(`🎨 Unsplash API: ${process.env.UNSPLASH_ACCESS_KEY ? 'Configurée' : 'Manquante'}`);
console.log('');

console.log('🤖 Démarrage du bot...');
console.log('🚀 Fonctionne 24h/24 sur Render !');
console.log('');

// Démarrer le bot
startBot().catch(error => {
    console.error('❌ Erreur démarrage bot:', error);
    process.exit(1);
});
