#!/usr/bin/env node

/**
 * 🤖 Bot Telegram avec GitHub Actions (24h/24)
 * Utilise GitHub Actions pour traiter les callbacks
 */

const fetch = require('node-fetch');

// Configuration
const BOT_CONFIG = {
  token: process.env.TELEGRAM_BOT_TOKEN || '8432791411:AAGRitXf4h7FOZNTvOJD08vuNGcByV3fFfA',
  chatId: process.env.TELEGRAM_CHAT_ID || '7828724589',
  baseUrl: 'https://api.telegram.org/bot',
  githubRepo: 'ztalali09/linkedin-post-generator'
};

// Clavier inline avec boutons
const generateKeyboard = {
  inline_keyboard: [
    [
      {
        text: '🤖 Générer un Post LinkedIn',
        callback_data: 'generate_post'
      }
    ],
    [
      {
        text: '🚀 Déclencher GitHub Actions',
        callback_data: 'trigger_github'
      }
    ],
    [
      {
        text: '📊 Statistiques',
        callback_data: 'show_stats'
      },
      {
        text: 'ℹ️ Aide',
        callback_data: 'show_help'
      }
    ]
  ]
};

// Fonction pour déclencher GitHub Actions
async function triggerGitHubAction(callbackData) {
  try {
    const url = `https://api.github.com/repos/${BOT_CONFIG.githubRepo}/dispatches`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
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

// Fonction pour envoyer un message avec clavier
async function sendMessageWithKeyboard(chatId, text, keyboard = null) {
  try {
    const url = `${BOT_CONFIG.baseUrl}${BOT_CONFIG.token}/sendMessage`;
    
    const body = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    };
    
    if (keyboard) {
      body.reply_markup = keyboard;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return data.ok ? data.result : null;
  } catch (error) {
    console.error('Erreur envoi message:', error);
    return null;
  }
}

// Fonction pour répondre aux callbacks
async function answerCallbackQuery(callbackQueryId, text, showAlert = false) {
  try {
    const url = `${BOT_CONFIG.baseUrl}${BOT_CONFIG.token}/answerCallbackQuery`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text,
        show_alert: showAlert
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Erreur callback:', error);
    return false;
  }
}

// Fonction pour traiter les messages
async function processMessage(update) {
  const message = update.message;
  const callbackQuery = update.callback_query;
  
  if (message) {
    const chatId = message.chat.id;
    const text = message.text;
    
    if (text === '/start' || text === '/help') {
      await sendMessageWithKeyboard(chatId, '🤖 <b>Bot LinkedIn Post Generator (GitHub Actions)</b>\n\n🚀 <b>Fonctionne 24h/24 via GitHub Actions !</b>\n\nCliquez sur les boutons pour déclencher GitHub Actions.', generateKeyboard);
    } else if (text === '/generate') {
      await sendMessageWithKeyboard(chatId, '🚀 <b>Déclenchement GitHub Actions...</b>\n\n⏳ Génération du post via GitHub...', null);
      await triggerGitHubAction('generate_post');
    } else {
      await sendMessageWithKeyboard(chatId, '🤖 Utilisez les boutons ci-dessous pour déclencher GitHub Actions.\n\n🚀 <b>Fonctionne 24h/24 !</b>', generateKeyboard);
    }
  }
  
  if (callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    const callbackId = callbackQuery.id;
    
    await answerCallbackQuery(callbackId, '⏳ Déclenchement GitHub Actions...');
    
    // Envoyer message de confirmation
    let confirmText = '';
    switch (data) {
      case 'generate_post':
        confirmText = '🚀 <b>Déclenchement GitHub Actions...</b>\n\n⏳ Génération du post via GitHub...\n\n🔄 Le post sera envoyé dans quelques secondes.';
        break;
      case 'trigger_github':
        confirmText = '🚀 <b>Déclenchement GitHub Actions...</b>\n\n⏳ Génération du post via GitHub...\n\n🔄 Le post sera envoyé dans quelques secondes.';
        break;
      case 'show_stats':
        confirmText = '📊 <b>Récupération des statistiques...</b>\n\n⏳ Traitement via GitHub...\n\n🔄 Les stats seront envoyées dans quelques secondes.';
        break;
      case 'show_help':
        confirmText = 'ℹ️ <b>Affichage de l\'aide...</b>\n\n⏳ Traitement via GitHub...\n\n🔄 L\'aide sera envoyée dans quelques secondes.';
        break;
    }
    
    await sendMessageWithKeyboard(chatId, confirmText, null);
    
    // Déclencher GitHub Action
    const success = await triggerGitHubAction(data);
    
    if (!success) {
      await sendMessageWithKeyboard(chatId, '❌ <b>Erreur lors du déclenchement GitHub Actions</b>\n\nVérifiez que GITHUB_TOKEN est configuré.', generateKeyboard);
    }
  }
}

// Fonction pour démarrer le polling
async function startPolling() {
  let offset = 0;
  
  while (true) {
    try {
      const url = `${BOT_CONFIG.baseUrl}${BOT_CONFIG.token}/getUpdates?offset=${offset}&timeout=30`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          await processMessage(update);
          offset = update.update_id + 1;
        }
      }
    } catch (error) {
      console.error('❌ Erreur polling:', error.message);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Fonction principale du bot
async function startBot() {
  console.log('🤖 Démarrage du Bot Telegram LinkedIn Post Generator (GitHub Actions Mode)...');
  
  // Vérifier la configuration
  if (!process.env.GITHUB_TOKEN) {
    console.error('❌ GITHUB_TOKEN manquante !');
    console.log('💡 Pour un fonctionnement 24h/24, configurez GITHUB_TOKEN');
    console.log('💡 Créez un token GitHub :');
    console.log('   1. Allez sur https://github.com/settings/tokens');
    console.log('   2. "Generate new token" → "Personal access token"');
    console.log('   3. Sélectionnez "repo" (accès complet aux repositories)');
    console.log('   4. Copiez le token et ajoutez-le comme GITHUB_TOKEN');
    process.exit(1);
  }
  
  console.log('✅ Configuration détectée');
  console.log(`🔑 Bot Token: ${BOT_CONFIG.token.substring(0, 10)}...`);
  console.log(`💬 Chat ID: ${BOT_CONFIG.chatId}`);
  console.log(`🐙 GitHub Repo: ${BOT_CONFIG.githubRepo}`);
  console.log(`🔑 GitHub Token: ${process.env.GITHUB_TOKEN.substring(0, 10)}...`);
  
  // Envoyer message de démarrage
  await sendMessageWithKeyboard(BOT_CONFIG.chatId, '🚀 <b>Bot LinkedIn Post Generator démarré !</b>\n\n🤖 Prêt à générer des posts avec Gemini 2.5 Flash.\n\n🚀 <b>Fonctionne 24h/24 via GitHub Actions !</b>', generateKeyboard);
  
  console.log('✅ Bot prêt ! Démarrage du polling...');
  
  // Démarrer le polling
  startPolling();
}

// Exports
module.exports = {
  startBot,
  triggerGitHubAction,
  sendMessageWithKeyboard
};

// Exécution si appelé directement
if (require.main === module) {
  startBot();
}
