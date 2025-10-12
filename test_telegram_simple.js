#!/usr/bin/env node

/**
 * 🚀 Test Telegram Simple - Post avec image
 * Utilise le bot existant et le système d'images amélioré
 */

const fallbackPosts = require('./fallback_posts.js');
const { findImageForPost } = require('./image_system.js');
const fetch = require('node-fetch');

// Configuration Telegram (bot existant)
const TELEGRAM_CONFIG = {
  botToken: '8432791411:AAGRitXf4h7FOZNTvOJD08vuNGcByV3fFfA',
  chatId: '7828724589',
  baseUrl: 'https://api.telegram.org/bot'
};

// Fonction pour envoyer un message texte sur Telegram
async function sendTelegramMessage(text, parseMode = 'HTML') {
  try {
    const url = `${TELEGRAM_CONFIG.baseUrl}${TELEGRAM_CONFIG.botToken}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.chatId,
        text: text,
        parse_mode: parseMode
      })
    });

    const data = await response.json();
    
    if (data.ok) {
      return { success: true, data: data };
    } else {
      console.error('❌ Erreur Telegram:', data.description);
      return { success: false, error: data.description };
    }
  } catch (error) {
    console.error('❌ Erreur envoi Telegram:', error.message);
    return { success: false, error: error.message };
  }
}

// Fonction pour envoyer une image avec caption sur Telegram
async function sendTelegramPhoto(photoUrl, caption, parseMode = 'HTML') {
  try {
    const url = `${TELEGRAM_CONFIG.baseUrl}${TELEGRAM_CONFIG.botToken}/sendPhoto`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.chatId,
        photo: photoUrl,
        caption: caption,
        parse_mode: parseMode
      })
    });

    const data = await response.json();
    
    if (data.ok) {
      return { success: true, data: data };
    } else {
      console.error('❌ Erreur Telegram Photo:', data.description);
      return { success: false, error: data.description };
    }
  } catch (error) {
    console.error('❌ Erreur envoi Telegram Photo:', error.message);
    return { success: false, error: error.message };
  }
}

async function testTelegramSimple() {
  console.log('🚀 Test Telegram Simple - Post avec image\n');
  
  try {
    // 1. Sélectionner un post de fallback
    const randomPost = fallbackPosts[Math.floor(Math.random() * fallbackPosts.length)];
    console.log(`📝 Post sélectionné: ${randomPost.type}`);
    console.log(`📄 Contenu: ${randomPost.content.substring(0, 100)}...`);
    
    // 2. Rechercher une image pertinente
    console.log('\n🎨 Recherche d\'image avec système amélioré...');
    const imageResult = await findImageForPost(randomPost.type, randomPost.content, []);
    
    let imageUrl = null;
    let imageInfo = '';
    
    if (imageResult.success) {
      imageUrl = imageResult.selectedImage.url;
      imageInfo = `\n🖼️ <b>Image:</b> ${imageResult.selectedImage.description}\n👤 <b>Auteur:</b> ${imageResult.selectedImage.author}`;
      console.log(`✅ Image trouvée: ${imageResult.selectedImage.description}`);
      console.log(`🔍 Requête utilisée: "${imageResult.query}"`);
    } else {
      console.log('⚠️ Aucune image trouvée');
    }
    
    // 3. Afficher le contenu complet
    console.log('\n📄 Contenu complet du post:');
    console.log('─'.repeat(60));
    console.log(randomPost.content);
    console.log('─'.repeat(60));
    
    // 4. Préparer le message Telegram (format HTML)
    const telegramMessage = `🤖 <b>Post LinkedIn Auto-Généré</b>\n\n` +
      `<b>📝 Contenu:</b>\n${randomPost.content}\n\n` +
      `<b>🏷️ Type:</b> ${randomPost.type}\n` +
      `<b>📅 Généré:</b> ${new Date().toLocaleString('fr-FR')}\n` +
      `<b>🎨 Système d'images:</b> Amélioré avec analyse du contenu\n` +
      `<b>📊 Source:</b> Fallback (système robuste)\n` +
      imageInfo + `\n\n` +
      `<b>🔗 Hashtags:</b> ${randomPost.hashtags}`;
    
    // 5. Envoyer sur Telegram
    console.log('\n📤 Envoi sur Telegram...');
    
    let telegramResult;
    if (imageUrl) {
      // Envoyer avec image
      console.log('📷 Envoi avec image...');
      telegramResult = await sendTelegramPhoto(imageUrl, telegramMessage);
    } else {
      // Envoyer sans image
      console.log('📝 Envoi sans image...');
      telegramResult = await sendTelegramMessage(telegramMessage);
    }
    
    if (telegramResult.success) {
      console.log('✅ Message envoyé sur Telegram !');
      console.log(`📨 Message ID: ${telegramResult.data.result.message_id}`);
    } else {
      console.log('❌ Erreur envoi Telegram:', telegramResult.error);
    }
    
    // 6. Afficher les statistiques
    console.log('\n📊 Statistiques:');
    console.log(`   Type de post: ${randomPost.type}`);
    console.log(`   Longueur: ${randomPost.content.length} caractères`);
    console.log(`   Image trouvée: ${imageResult.success ? '✅' : '❌'}`);
    if (imageResult.success) {
      console.log(`   Requête utilisée: "${imageResult.query}"`);
      console.log(`   Pertinence: ${imageResult.selectedImage.description}`);
    }
    
    console.log('\n🎉 Test terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    process.exit(1);
  }
}

// Exécution si appelé directement
if (require.main === module) {
  testTelegramSimple();
}

module.exports = { testTelegramSimple, sendTelegramMessage, sendTelegramPhoto };

