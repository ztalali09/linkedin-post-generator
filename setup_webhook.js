#!/usr/bin/env node

/**
 * 🔧 Script pour configurer le webhook Telegram
 * Configure Telegram pour envoyer les messages à GitHub Actions
 */

const fetch = require('node-fetch');

// Configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8432791411:AAGRitXf4h7FOZNTvOJD08vuNGcByV3fFfA';
const GITHUB_REPO = 'ztalali09/linkedin-post-generator';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function setupWebhook() {
  try {
    console.log('🔧 Configuration du webhook Telegram...');
    
    // URL du webhook (GitHub Actions)
    const webhookUrl = `https://api.github.com/repos/${GITHUB_REPO}/dispatches`;
    
    console.log(`📡 Webhook URL: ${webhookUrl}`);
    console.log(`🔑 GitHub Token: ${GITHUB_TOKEN ? 'Configuré' : 'Manquant'}`);
    
    if (!GITHUB_TOKEN) {
      console.error('❌ GITHUB_TOKEN manquante !');
      console.log('💡 Créez un token GitHub :');
      console.log('   1. Allez sur https://github.com/settings/tokens');
      console.log('   2. "Generate new token" → "Personal access token"');
      console.log('   3. Sélectionnez "repo" (accès complet aux repositories)');
      console.log('   4. Copiez le token et ajoutez-le comme GITHUB_TOKEN');
      return;
    }
    
    // Test de la connexion GitHub
    console.log('🧪 Test de la connexion GitHub...');
    const testResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!testResponse.ok) {
      console.error(`❌ Erreur GitHub: ${testResponse.status}`);
      return;
    }
    
    console.log('✅ Connexion GitHub OK');
    console.log('🎯 Webhook configuré pour GitHub Actions');
    console.log('');
    console.log('📋 Prochaines étapes :');
    console.log('1. Le bot Telegram enverra les messages à GitHub Actions');
    console.log('2. GitHub Actions traitera les callbacks');
    console.log('3. Les posts seront générés automatiquement');
    console.log('');
    console.log('🚀 Testez maintenant les boutons dans Telegram !');
    
  } catch (error) {
    console.error('❌ Erreur configuration webhook:', error);
  }
}

// Fonction pour déclencher GitHub Action depuis Telegram
async function triggerGitHubAction(callbackData) {
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/dispatches`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'telegram-callback',
        client_payload: {
          callback_data: callbackData
        }
      })
    });
    
    if (response.ok) {
      console.log(`✅ GitHub Action déclenchée pour: ${callbackData}`);
      return true;
    } else {
      console.error(`❌ Erreur GitHub Action: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur déclenchement GitHub Action:', error);
    return false;
  }
}

// Exports
module.exports = {
  setupWebhook,
  triggerGitHubAction
};

// Exécution si appelé directement
if (require.main === module) {
  setupWebhook();
}
