#!/usr/bin/env node

/**
 * 🚀 Test Complet avec Gemini 2.5 Flash
 * Génère un post authentique avec suggestions d'images et envoie sur Telegram
 */

const { generateAuthenticPost } = require('./generate_authentic_varied_posts.js');
const { sendTelegramMessage, sendTelegramPhoto } = require('./test_telegram_simple.js');

async function testGeminiComplete() {
  console.log('🚀 Test Complet avec Gemini 2.5 Flash\n');
  
  try {
    // 1. Vérifier la clé API Gemini
    if (!process.env.GEMINI_API_KEY) {
      console.log('❌ GEMINI_API_KEY manquante !');
      console.log('💡 Pour obtenir une clé API Gemini:');
      console.log('   1. Va sur https://aistudio.google.com/');
      console.log('   2. Crée un projet');
      console.log('   3. Génère une clé API');
      console.log('   4. Exporte: export GEMINI_API_KEY="ta_clé_ici"');
      return;
    }
    
    console.log('✅ Clé API Gemini détectée');
    
    // 2. Générer un post authentique avec Gemini 2.5 Flash
    console.log('\n🤖 Génération d\'un post authentique avec Gemini 2.5 Flash...');
    const post = await generateAuthenticPost();
    
    if (!post || !post.json) {
      throw new Error('Échec de génération du post');
    }
    
    console.log('✅ Post généré avec succès !');
    console.log(`📊 Type: ${post.json.type}`);
    console.log(`📏 Longueur: ${post.json.content.length} caractères`);
    console.log(`🎯 Sujet: ${post.json.topic || 'N/A'}`);
    
    // 3. Afficher le contenu
    console.log('\n📄 Contenu du post:');
    console.log('─'.repeat(60));
    console.log(post.json.content);
    console.log('─'.repeat(60));
    
    // 4. Analyser l'image
    let imageUrl = null;
    let imageInfo = '';
    
    if (post.json.image) {
      imageUrl = post.json.image.url;
      imageInfo = `\n🖼️ <b>Image:</b> ${post.json.image.description}\n👤 <b>Auteur:</b> ${post.json.image.author}`;
      console.log('\n✅ Image associée au post:');
      console.log(`   Description: ${post.json.image.description}`);
      console.log(`   Auteur: ${post.json.image.author}`);
      console.log(`   URL: ${post.json.image.url}`);
    } else {
      console.log('\n⚠️ Aucune image associée');
    }
    
    // 5. Préparer le message Telegram (format LinkedIn direct)
    let telegramMessage = post.json.content;
    
    // Limiter la longueur pour Telegram (max 1000 caractères pour les captions)
    const TELEGRAM_MAX_LENGTH = 1000;
    if (telegramMessage.length > TELEGRAM_MAX_LENGTH) {
      console.log(`⚠️ Message trop long (${telegramMessage.length} caractères), tronquage pour Telegram...`);
      
      // Tronquer le contenu du post pour respecter la limite
      const maxContentLength = TELEGRAM_MAX_LENGTH - 50; // Réserver de l'espace pour "..."
      telegramMessage = post.json.content.substring(0, maxContentLength) + '...';
      
      console.log(`✅ Message tronqué à ${telegramMessage.length} caractères`);
    }
    
    // 6. Envoyer sur Telegram
    console.log('\n📤 Envoi sur Telegram...');
    
    let telegramResult;
    if (imageUrl) {
      console.log('📷 Envoi avec image...');
      telegramResult = await sendTelegramPhoto(imageUrl, telegramMessage);
    } else {
      console.log('📝 Envoi sans image...');
      telegramResult = await sendTelegramMessage(telegramMessage);
    }
    
    if (telegramResult.success) {
      console.log('✅ Message envoyé sur Telegram !');
      console.log(`📨 Message ID: ${telegramResult.data.result.message_id}`);
    } else {
      console.log('❌ Erreur envoi Telegram:', telegramResult.error);
    }
    
    // 7. Afficher les statistiques finales
    console.log('\n📊 Statistiques finales:');
    console.log(`   Type de post: ${post.json.type}`);
    console.log(`   Longueur: ${post.json.content.length} caractères`);
    console.log(`   Source: IA Gemini 2.5 Flash`);
    console.log(`   Image trouvée: ${post.json.image ? '✅' : '❌'}`);
    console.log(`   Style: ${post.json.style}`);
    
    if (post.json.image) {
      console.log(`   Description image: ${post.json.image.description}`);
    }
    
    console.log('\n🎉 Test terminé avec succès !');
    console.log('\n💡 Le système utilise maintenant:');
    console.log('   🤖 Gemini 2.5 Flash pour la génération de contenu');
    console.log('   🎨 Suggestions d\'images intelligentes par Gemini');
    console.log('   📷 Recherche d\'images avec mots-clés personnalisés');
    console.log('   📤 Envoi automatique sur Telegram');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    process.exit(1);
  }
}

// Exécution si appelé directement
if (require.main === module) {
  testGeminiComplete();
}

module.exports = { testGeminiComplete };

