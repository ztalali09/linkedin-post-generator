#!/usr/bin/env node

/**
 * 🤖 Bot Telegram avec bouton "Generate" pour posts LinkedIn
 * Utilise le système Gemini 2.5 Flash pour générer des posts
 */

const { generateAuthenticPost } = require('./generate_authentic_varied_posts.js');
const fetch = require('node-fetch');

// Configuration du bot Telegram
const BOT_CONFIG = {
  token: process.env.TELEGRAM_BOT_TOKEN || '8432791411:AAGRitXf4h7FOZNTvOJD08vuNGcByV3fFfA',
  chatId: process.env.TELEGRAM_CHAT_ID || '7828724589',
  baseUrl: 'https://api.telegram.org/bot'
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

// Fonction pour envoyer une image avec caption
async function sendPhotoWithCaption(chatId, photoUrl, caption) {
  try {
    const url = `${BOT_CONFIG.baseUrl}${BOT_CONFIG.token}/sendPhoto`;
    
    const body = {
      chat_id: chatId,
      photo: photoUrl,
      caption: caption,
      parse_mode: 'HTML'
    };
    
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
    console.error('Erreur envoi photo:', error);
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

// Fonction pour générer un post
async function generatePost(chatId) {
  try {
    console.log('🤖 Génération d\'un post avec Gemini 2.5 Flash...');
    
    // Envoyer message de chargement
    const loadingMessage = await sendMessageWithKeyboard(chatId, '⏳ Génération du post en cours...\n\n🤖 Utilisation de Gemini 2.5 Flash...', null);
    
    // Générer le post
    const post = await generateAuthenticPost();
    
    if (!post || !post.json) {
      await sendMessageWithKeyboard(chatId, '❌ Erreur lors de la génération du post.\n\nVérifiez que GEMINI_API_KEY est configurée.', generateKeyboard);
      return;
    }
    
    // Supprimer le message de chargement
    if (loadingMessage) {
      try {
        await fetch(`${BOT_CONFIG.baseUrl}${BOT_CONFIG.token}/deleteMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            message_id: loadingMessage.message_id
          })
        });
      } catch (e) {
        // Ignore si impossible de supprimer
      }
    }
    
    // Envoyer le post avec image si disponible
    if (post.json.image && post.json.image.url) {
      await sendPhotoWithCaption(chatId, post.json.image.url, post.json.content);
    } else {
      await sendMessageWithKeyboard(chatId, post.json.content, generateKeyboard);
    }
    
    // Envoyer les statistiques
    const stats = `📊 <b>Statistiques du Post:</b>\n` +
      `• Type: ${post.json.type}\n` +
      `• Longueur: ${post.json.content.length} caractères\n` +
      `• Source: IA Gemini 2.5 Flash\n` +
      `• Image: ${post.json.image ? '✅' : '❌'}\n\n` +
      `🎯 <b>Prêt à publier sur LinkedIn !</b>`;
    
    await sendMessageWithKeyboard(chatId, stats, generateKeyboard);
    
  } catch (error) {
    console.error('Erreur génération post:', error);
    await sendMessageWithKeyboard(chatId, `❌ Erreur: ${error.message}\n\nVérifiez la configuration.`, generateKeyboard);
  }
}

// Fonction pour afficher les statistiques
async function showStats(chatId) {
  try {
    const { showDatabaseStats } = require('./generate_authentic_varied_posts.js');
    const stats = await showDatabaseStats();
    
    let statsText = '📊 <b>Statistiques de la Base de Données:</b>\n\n';
    statsText += `📝 Total posts: ${stats.total_posts}\n`;
    statsText += `✅ Posts avec IA: ${stats.real_posts}\n`;
    statsText += `⚠️ Posts fallback: ${stats.fallback_posts}\n`;
    statsText += `🎨 Types uniques: ${stats.unique_types}\n`;
    
    if (stats.first_post_date) {
      statsText += `📅 Premier post: ${new Date(stats.first_post_date).toLocaleDateString('fr-FR')}\n`;
    }
    if (stats.last_post_date) {
      statsText += `📅 Dernier post: ${new Date(stats.last_post_date).toLocaleDateString('fr-FR')}\n`;
    }
    
    await sendMessageWithKeyboard(chatId, statsText, generateKeyboard);
  } catch (error) {
    await sendMessageWithKeyboard(chatId, '❌ Erreur lors de la récupération des statistiques.', generateKeyboard);
  }
}

// Fonction pour déclencher GitHub Actions
async function triggerGitHubAction(chatId) {
  try {
    await sendMessageWithKeyboard(chatId, '🚀 <b>Déclenchement GitHub Actions...</b>\n\n⏳ Génération du post via GitHub...', null);
    
    // Déclencher le workflow GitHub Actions
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      await sendMessageWithKeyboard(chatId, '❌ <b>GITHUB_TOKEN manquant !</b>\n\nConfigurez le token GitHub pour déclencher les workflows.', generateKeyboard);
      return;
    }
    
    const workflowUrl = 'https://api.github.com/repos/ztalali09/linkedin-post-generator/actions/workflows/auto-post.yml/dispatches';
    
    const response = await fetch(workflowUrl, {
      method: 'POST',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ref: 'main'
      })
    });
    
    if (response.ok) {
      const message = `✅ <b>GitHub Actions déclenché avec succès !</b>\n\n` +
        `🔗 <b>Lien du workflow:</b>\n` +
        `https://github.com/ztalali09/linkedin-post-generator/actions\n\n` +
        `⏰ <b>Le post sera généré et envoyé automatiquement</b>\n` +
        `📊 <b>Vous pouvez suivre le progrès sur GitHub Actions</b>\n\n` +
        `💡 <b>Note:</b> Le workflow utilise le code déployé sur GitHub`;
      
      await sendMessageWithKeyboard(chatId, message, generateKeyboard);
    } else {
      const errorText = await response.text();
      await sendMessageWithKeyboard(chatId, `❌ <b>Erreur déclenchement GitHub Actions:</b>\n\n${errorText}`, generateKeyboard);
    }
    
  } catch (error) {
    await sendMessageWithKeyboard(chatId, `❌ <b>Erreur déclenchement GitHub Actions:</b>\n\n${error.message}`, generateKeyboard);
  }
}

// Fonction pour afficher l'aide
async function showHelp(chatId) {
  const helpText = `🤖 <b>Bot LinkedIn Post Generator</b>\n\n` +
    `🎯 <b>Fonctionnalités:</b>\n` +
    `• Génération de posts LinkedIn avec IA Gemini 2.5 Flash\n` +
    `• Images automatiques avec Unsplash\n` +
    `• Contenu authentique et varié\n` +
    `• Évitement des répétitions\n\n` +
    `🔧 <b>Configuration requise:</b>\n` +
    `• GEMINI_API_KEY (obligatoire)\n` +
    `• TELEGRAM_BOT_TOKEN\n` +
    `• TELEGRAM_CHAT_ID\n\n` +
    `📱 <b>Utilisation:</b>\n` +
    `• <b>🤖 Générer un Post:</b> Crée un post immédiatement (local)\n` +
    `• <b>🚀 Déclencher GitHub Actions:</b> Utilise le code déployé sur GitHub\n` +
    `• Le post est prêt à copier-coller sur LinkedIn\n` +
    `• Images automatiquement associées\n\n` +
    `🚀 <b>Automatisation:</b>\n` +
    `• Posts automatiques à 9h et 14h (GitHub Actions)\n` +
    `• Système anti-répétition intégré\n\n` +
    `💡 <b>Conseil:</b> Utilisez "Générer" pour tester, "GitHub Actions" pour la production !`;
  
  await sendMessageWithKeyboard(chatId, helpText, generateKeyboard);
}

// Fonction pour traiter les messages
async function processMessage(update) {
  const message = update.message;
  const callbackQuery = update.callback_query;
  
  if (message) {
    const chatId = message.chat.id;
    const text = message.text;
    
    if (text === '/start' || text === '/help') {
      await sendMessageWithKeyboard(chatId, '🤖 <b>Bienvenue sur le Bot LinkedIn Post Generator !</b>\n\nCliquez sur le bouton ci-dessous pour générer un post LinkedIn avec IA Gemini 2.5 Flash.', generateKeyboard);
    } else if (text === '/generate') {
      await generatePost(chatId);
    } else {
      await sendMessageWithKeyboard(chatId, '🤖 Utilisez les boutons ci-dessous pour interagir avec le bot.', generateKeyboard);
    }
  }
  
  if (callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    const callbackId = callbackQuery.id;
    
    await answerCallbackQuery(callbackId, '⏳ Traitement en cours...');
    
    switch (data) {
      case 'generate_post':
        await generatePost(chatId);
        break;
      case 'trigger_github':
        await triggerGitHubAction(chatId);
        break;
      case 'show_stats':
        await showStats(chatId);
        break;
      case 'show_help':
        await showHelp(chatId);
        break;
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
      await new Promise(resolve => setTimeout(resolve, 5000)); // Attendre 5s avant de réessayer
    }
  }
}

// Fonction principale du bot
async function startBot() {
  console.log('🤖 Démarrage du Bot Telegram LinkedIn Post Generator...');
  
  // Vérifier la configuration
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY manquante !');
    process.exit(1);
  }
  
  console.log('✅ Configuration détectée');
  console.log(`🔑 Bot Token: ${BOT_CONFIG.token.substring(0, 10)}...`);
  console.log(`💬 Chat ID: ${BOT_CONFIG.chatId}`);
  
  // Envoyer message de démarrage
  await sendMessageWithKeyboard(BOT_CONFIG.chatId, '🚀 <b>Bot LinkedIn Post Generator démarré !</b>\n\n🤖 Prêt à générer des posts avec Gemini 2.5 Flash.', generateKeyboard);
  
  console.log('✅ Bot prêt ! Démarrage du polling...');
  
  // Démarrer le polling
  startPolling();
}

// Fonction pour générer un post automatique (pour GitHub Actions)
async function generateAutomaticPost() {
  try {
    console.log('🤖 Génération automatique d\'un post...');
    
    const post = await generateAuthenticPost();
    
    if (!post || !post.json) {
      console.error('❌ Erreur génération automatique');
      return false;
    }
    
    // Envoyer le post avec image si disponible
    if (post.json.image && post.json.image.url) {
      await sendPhotoWithCaption(BOT_CONFIG.chatId, post.json.image.url, post.json.content);
    } else {
      await sendMessageWithKeyboard(BOT_CONFIG.chatId, post.json.content, null);
    }
    
    console.log('✅ Post automatique envoyé avec succès !');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur post automatique:', error);
    return false;
  }
}

// Exports
module.exports = {
  startBot,
  generateAutomaticPost,
  sendMessageWithKeyboard,
  sendPhotoWithCaption
};

// Exécution si appelé directement
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--auto')) {
    // Mode automatique pour GitHub Actions
    generateAutomaticPost().then(success => {
      process.exit(success ? 0 : 1);
    });
  } else {
    // Mode bot interactif
    startBot();
  }
}
