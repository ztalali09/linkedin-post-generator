#!/usr/bin/env node

/**
 * 🤖 Bot Telegram avec bouton "Generate" pour posts LinkedIn
 * Utilise le système Gemini 2.5 Flash pour générer des posts
 */

const { generateAuthenticPost, getTrendingTopics, selectBestTopic, generatePostContent, findBestStructureForTopic } = require('./generate_authentic_varied_posts.js');
const fetch = require('node-fetch');

// Fonction pour trouver une image alternative (pour changement de photo)
// Utilise le système amélioré multi-APIs avec validation de pertinence
async function findAlternativeImage(postType, content, geminiSuggestions = [], usedImages = []) {
  try {
    const { findImageForPost } = require('./image_system.js');
    
    console.log(`🔄 Recherche d'image alternative avec validation de pertinence (multi-APIs)...`);
    
    // Utiliser le système amélioré avec validation (Pexels, Freepik, Pixabay, Unsplash, Simple Icons)
    const imageData = await findImageForPost(postType, content, usedImages, geminiSuggestions);
    
    if (imageData && imageData.success && imageData.selectedImage) {
      const sourceNames = {
        'pexels': 'Pexels',
        'freepik': 'Freepik',
        'pixabay': 'Pixabay',
        'unsplash': 'Unsplash',
        'simple-icons': 'Simple Icons'
      };
      
      const sourceName = sourceNames[imageData.source] || imageData.source || 'Unknown';
      
      console.log(`   ✅ Image alternative trouvée via ${sourceName} avec score: ${imageData.relevanceScore !== undefined ? imageData.relevanceScore.toFixed(1) : 'N/A'}`);
      
      return {
        url: imageData.selectedImage.url,
        description: imageData.selectedImage.description || 'Image professionnelle',
        author: imageData.selectedImage.author || 'Unknown',
        authorUrl: imageData.selectedImage.authorUrl,
        source: sourceName,
        sourceCode: imageData.source,
        relevanceScore: imageData.relevanceScore,
        warning: imageData.warning
      };
    }
    
    // Si aucune image trouvée, essayer avec des requêtes alternatives
    console.log('   ⚠️ Aucune image trouvée, essai avec requêtes alternatives...');
    const { generateSmartQueries, searchPexels, searchFreepik, searchPixabay, searchUnsplash } = require('./image_system.js');
    const queries = generateSmartQueries(postType, content, geminiSuggestions);
    
    // Essayer avec toutes les APIs en cascade
    for (const query of queries.slice(0, 2)) { // Essayer 2 meilleures requêtes
      // Essayer Pexels
      let result = await searchPexels(query);
      if (!result || result.images.length === 0) {
        // Essayer Freepik
        result = await searchFreepik(query);
        if (!result || result.images.length === 0) {
          // Essayer Pixabay
          result = await searchPixabay(query);
          if (!result || result.images.length === 0) {
            // Essayer Unsplash
            result = await searchUnsplash(query);
          }
        }
      }
      
      if (result && result.images.length > 0) {
        // Chercher une image non utilisée
        for (const image of result.images) {
          const imageHash = image.url.substring(0, 50); // Hash simple
          const isUsed = usedImages.some(used => used.image_hash && used.image_hash === imageHash);
          
          if (!isUsed) {
            const sourceNames = {
              'pexels': 'Pexels',
              'freepik': 'Freepik',
              'pixabay': 'Pixabay',
              'unsplash': 'Unsplash'
            };
            
            return {
              url: image.url,
              description: image.description || 'Image professionnelle',
              author: image.author || 'Unknown',
              authorUrl: image.authorUrl,
              source: sourceNames[result.source] || result.source,
              sourceCode: result.source
            };
          }
        }
      }
    }
    
    console.log('   ❌ Aucune image alternative trouvée');
    return null;
  } catch (error) {
    console.error('Erreur recherche image alternative:', error);
    console.error('Stack:', error.stack);
    return null;
  }
}

// Configuration du bot Telegram
const BOT_CONFIG = {
  token: process.env.TELEGRAM_BOT_TOKEN || '8432791411:AAGRitXf4h7FOZNTvOJD08vuNGcByV3fFfA',
  chatId: process.env.TELEGRAM_CHAT_ID || '7828724589',
  baseUrl: 'https://api.telegram.org/bot'
};

// Stockage du dernier post généré pour changer la photo
let lastGeneratedPost = null;

// Stockage des topics disponibles pour sélection
let availableTopics = null;

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

// Clavier avec boutons après génération d'un post
const postGeneratedKeyboard = {
  inline_keyboard: [
    [
      {
        text: '🔄 Changer la Photo',
        callback_data: 'change_photo'
      },
      {
        text: '✏️ Reformuler le Texte',
        callback_data: 'reformulate_text'
      }
    ],
    [
      {
        text: '📋 Choisir un Sujet',
        callback_data: 'choose_topic'
      },
      {
        text: '🤖 Nouveau Post',
        callback_data: 'generate_post'
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
    
    // Stocker le post pour pouvoir changer la photo
    lastGeneratedPost = post;
    
    // Stocker les topics disponibles pour sélection (si disponible)
    try {
      const { getDatabase } = require('./database.js');
      const { generateTopicHash } = require('./generate_authentic_varied_posts.js');
      const db = await getDatabase();
      const topics = await getTrendingTopics();
      if (topics && topics.length > 0) {
        // Filtrer les topics déjà traités
        const topicChecks = topics.map(async (topic) => {
          const hash = generateTopicHash(topic.subject);
          const isTreated = await db.isTopicTreated(hash);
          return { topic, isTreated };
        });
        const checkResults = await Promise.all(topicChecks);
        availableTopics = checkResults
          .filter(result => !result.isTreated)
          .map(result => result.topic)
          .slice(0, 10); // Garder les 10 premiers
      }
    } catch (error) {
      console.warn('⚠️ Impossible de stocker les topics:', error.message);
    }
    
    // Envoyer le post avec image si disponible
    if (post.json.image && post.json.image.url) {
      await sendPhotoWithCaption(chatId, post.json.image.url, post.json.content);
    } else {
      await sendMessageWithKeyboard(chatId, post.json.content, postGeneratedKeyboard);
    }
    
    // Envoyer les statistiques
    let stats = `📊 <b>Statistiques du Post:</b>\n` +
      `• Type: ${post.json.type}\n` +
      `• Longueur: ${post.json.content.length} caractères\n` +
      `• Source: IA Gemini 2.0 Flash\n` +
      `• Image: ${post.json.image ? '✅' : '❌'}`;
    
    // Ajouter le score de pertinence si disponible
    if (post.json.image && post.json.image.relevanceScore !== undefined) {
      stats += `\n• 📊 Pertinence image: ${post.json.image.relevanceScore.toFixed(1)}/10`;
    }
    
    // Ajouter les suggestions d'images si disponibles
    if (post.json.imageSuggestions && post.json.imageSuggestions.length > 0) {
      stats += `\n• 🤖 Suggestions: ${post.json.imageSuggestions.slice(0, 3).join(', ')}`;
    }
    
    stats += `\n\n🎯 <b>Prêt à publier sur LinkedIn !</b>`;
    
    await sendMessageWithKeyboard(chatId, stats, postGeneratedKeyboard);
    
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

// Fonction pour déclencher GitHub Actions et générer le post
async function triggerGitHubAction(chatId) {
  try {
    await sendMessageWithKeyboard(chatId, '🚀 <b>Déclenchement GitHub Actions...</b>\n\n⏳ Génération du post via GitHub...', null);
    
    // Au lieu de déclencher GitHub Actions, générer le post directement
    // mais avec le même code que GitHub Actions utiliserait
    console.log('🤖 Génération d\'un post avec le code déployé...');
    
    const post = await generateAuthenticPost();
    
    if (!post || !post.json) {
      await sendMessageWithKeyboard(chatId, '❌ Erreur lors de la génération du post.\n\nVérifiez que GEMINI_API_KEY est configurée.', generateKeyboard);
      return;
    }
    
    // Stocker le post pour pouvoir changer la photo
    lastGeneratedPost = post;
    
    // Envoyer le post avec image si disponible
    if (post.json.image && post.json.image.url) {
      await sendPhotoWithCaption(chatId, post.json.image.url, post.json.content);
    } else {
      await sendMessageWithKeyboard(chatId, post.json.content, postGeneratedKeyboard);
    }
    
    // Envoyer les statistiques
    const stats = `📊 <b>Post généré avec le code déployé:</b>\n` +
      `• Type: ${post.json.type}\n` +
      `• Longueur: ${post.json.content.length} caractères\n` +
      `• Source: IA Gemini 2.5 Flash\n` +
      `• Image: ${post.json.image ? '✅' : '❌'}\n\n` +
      `🎯 <b>Prêt à publier sur LinkedIn !</b>`;
    
    await sendMessageWithKeyboard(chatId, stats, postGeneratedKeyboard);
    
  } catch (error) {
    console.error('Erreur génération post:', error);
    await sendMessageWithKeyboard(chatId, `❌ Erreur: ${error.message}\n\nVérifiez la configuration.`, generateKeyboard);
  }
}

// Fonction pour changer la photo du dernier post
async function changePhoto(chatId) {
  try {
    if (!lastGeneratedPost) {
      await sendMessageWithKeyboard(chatId, '❌ <b>Aucun post récent trouvé !</b>\n\nGénérez d\'abord un post avec les boutons ci-dessus.', generateKeyboard);
      return;
    }
    
    await sendMessageWithKeyboard(chatId, '🔄 <b>Recherche d\'une nouvelle image...</b>\n\n⏳ Utilisation des mêmes mots-clés...', null);
    
    // Utiliser le système d'images pour trouver une nouvelle image
    const { findImageForPost } = require('./image_system.js');
    
    // Extraire les mots-clés du post existant
    const postType = lastGeneratedPost.json.type;
    const content = lastGeneratedPost.json.content;
    const geminiSuggestions = lastGeneratedPost.json.imageSuggestions || [];
    
    console.log('🔄 Recherche d\'une nouvelle image avec validation de pertinence...');
    
    // Récupérer les images déjà utilisées depuis la BDD
    let usedImages = [];
    try {
      const { getDatabase } = require('./database.js');
      const db = await getDatabase();
      usedImages = await db.getUsedImages();
      console.log(`   📊 ${usedImages.length} image(s) déjà utilisée(s) en BDD`);
    } catch (error) {
      console.warn('⚠️ Impossible de récupérer les images utilisées:', error.message);
    }
    
    // Chercher une nouvelle image avec les mêmes paramètres et validation
    const newImageData = await findAlternativeImage(postType, content, geminiSuggestions, usedImages);
    
    if (newImageData && newImageData.url) {
      // Vérifier que l'URL est valide
      if (!newImageData.url.startsWith('http')) {
        throw new Error('URL d\'image invalide');
      }
      
      // Envoyer le même contenu avec la nouvelle image
      try {
        await sendPhotoWithCaption(chatId, newImageData.url, lastGeneratedPost.json.content);
      } catch (photoError) {
        console.error('Erreur envoi photo:', photoError);
        // Si l'envoi de photo échoue, envoyer le message avec l'URL
        await sendMessageWithKeyboard(chatId, 
          `✅ <b>Nouvelle image trouvée !</b>\n\n` +
          `🖼️ <b>URL:</b> <a href="${newImageData.url}">Voir l'image</a>\n\n` +
          `📝 <b>Contenu du post:</b>\n${lastGeneratedPost.json.content}`, 
          postGeneratedKeyboard
        );
      }
      
      let message = `✅ <b>Nouvelle image trouvée !</b>\n\n` +
        `🖼️ <b>Description:</b> ${newImageData.description || 'Image professionnelle'}\n` +
        `👤 <b>Auteur:</b> ${newImageData.author || 'Unknown'}`;
      
      // Ajouter le lien auteur si disponible
      if (newImageData.authorUrl) {
        message += `\n🔗 <b>Source:</b> <a href="${newImageData.authorUrl}">${newImageData.source || 'API'}</a>`;
      } else {
        message += `\n🔗 <b>Source:</b> ${newImageData.source || 'API'}`;
      }
      
      // Ajouter le score de pertinence si disponible
      if (newImageData.relevanceScore !== undefined) {
        message += `\n📊 <b>Pertinence:</b> ${newImageData.relevanceScore.toFixed(1)}/10`;
      }
      
      // Ajouter un avertissement si disponible
      if (newImageData.warning) {
        message += `\n⚠️ <i>${newImageData.warning}</i>`;
      }
      
      message += `\n\n💡 <b>Même contenu, nouvelle image !</b>`;
      
      await sendMessageWithKeyboard(chatId, message, postGeneratedKeyboard);
    } else {
      await sendMessageWithKeyboard(chatId, 
        '❌ <b>Aucune nouvelle image trouvée !</b>\n\n' +
        '💡 <b>Suggestions:</b>\n' +
        '• Essayez de générer un nouveau post\n' +
        '• Vérifiez que les APIs sont configurées\n' +
        '• Les images peuvent être toutes déjà utilisées', 
        postGeneratedKeyboard
      );
    }
    
  } catch (error) {
    console.error('Erreur changement photo:', error);
    await sendMessageWithKeyboard(chatId, `❌ <b>Erreur lors du changement de photo:</b>\n\n${error.message}`, postGeneratedKeyboard);
  }
}

// Fonction pour afficher les sujets disponibles et permettre de choisir
async function chooseTopic(chatId) {
  try {
    await sendMessageWithKeyboard(chatId, '📋 <b>Récupération des sujets disponibles...</b>', null);
    
    // Récupérer les topics
    const topics = await getTrendingTopics();
    
    if (!topics || topics.length === 0) {
      await sendMessageWithKeyboard(chatId, '❌ <b>Aucun sujet disponible !</b>\n\nEssayez de générer un nouveau post.', postGeneratedKeyboard);
      return;
    }
    
    // Filtrer les topics déjà traités
    const { getDatabase } = require('./database.js');
    const { generateTopicHash } = require('./generate_authentic_varied_posts.js');
    const db = await getDatabase();
    
    const topicChecks = topics.map(async (topic) => {
      const hash = generateTopicHash(topic.subject);
      const isTreated = await db.isTopicTreated(hash);
      return { topic, isTreated };
    });
    
    const checkResults = await Promise.all(topicChecks);
    const freshTopics = checkResults
      .filter(result => !result.isTreated)
      .map(result => result.topic)
      .slice(0, 10); // Limiter à 10 sujets
    
    if (freshTopics.length === 0) {
      await sendMessageWithKeyboard(chatId, '⚠️ <b>Tous les sujets ont déjà été traités !</b>\n\nGénérez un nouveau post pour obtenir de nouveaux sujets.', postGeneratedKeyboard);
      return;
    }
    
    // Créer les boutons pour chaque sujet
    const keyboardButtons = freshTopics.slice(0, 10).map((topic, index) => {
      const shortSubject = topic.subject.length > 50 
        ? topic.subject.substring(0, 47) + '...' 
        : topic.subject;
      return [{
        text: `${index + 1}. ${shortSubject}`,
        callback_data: `select_topic_${index}`
      }];
    });
    
    // Ajouter un bouton retour
    keyboardButtons.push([
      {
        text: '🔙 Retour',
        callback_data: 'back_to_menu'
      }
    ]);
    
    const topicKeyboard = {
      inline_keyboard: keyboardButtons
    };
    
    // Stocker les topics pour la sélection
    availableTopics = freshTopics;
    
    let topicsText = `📋 <b>Sujets disponibles (${freshTopics.length}) :</b>\n\n`;
    freshTopics.forEach((topic, index) => {
      topicsText += `${index + 1}. <b>${topic.subject}</b>\n`;
      if (topic.angle) {
        topicsText += `   Angle: ${topic.angle.substring(0, 60)}${topic.angle.length > 60 ? '...' : ''}\n`;
      }
      topicsText += `   Priorité: ${topic.priority || 'N/A'}/5\n\n`;
    });
    topicsText += `💡 <b>Sélectionnez un sujet ci-dessous :</b>`;
    
    await sendMessageWithKeyboard(chatId, topicsText, topicKeyboard);
    
  } catch (error) {
    console.error('Erreur choix sujet:', error);
    await sendMessageWithKeyboard(chatId, `❌ <b>Erreur lors de la récupération des sujets:</b>\n\n${error.message}`, postGeneratedKeyboard);
  }
}

// Fonction pour générer un post avec un sujet spécifique
async function generatePostWithTopic(chatId, topicIndex) {
  try {
    if (!availableTopics || !availableTopics[topicIndex]) {
      await sendMessageWithKeyboard(chatId, '❌ <b>Sujet non disponible !</b>\n\nChoisissez à nouveau un sujet.', postGeneratedKeyboard);
      return;
    }
    
    const selectedTopic = availableTopics[topicIndex];
    await sendMessageWithKeyboard(chatId, `⏳ <b>Génération du post...</b>\n\n📋 <b>Sujet sélectionné:</b> ${selectedTopic.subject}\n\n🤖 Utilisation de Gemini 2.0 Flash...`, null);
    
    // Trouver la meilleure structure pour ce topic
    const structure = findBestStructureForTopic(selectedTopic);
    
    // Générer le contenu
    const contentResult = await generatePostContent(selectedTopic, structure);
    
    if (!contentResult || !contentResult.content) {
      await sendMessageWithKeyboard(chatId, '❌ <b>Erreur lors de la génération du contenu.</b>', postGeneratedKeyboard);
      return;
    }
    
    // Récupérer les images déjà utilisées
    const { getDatabase } = require('./database.js');
    const { findImageForPost } = require('./image_system.js');
    const db = await getDatabase();
    const usedImages = await db.getUsedImages();
    
    // Chercher une image
    let imageData = null;
    try {
      imageData = await findImageForPost(structure.type, contentResult.content, usedImages, contentResult.imageSuggestions || []);
    } catch (error) {
      console.warn('⚠️ Erreur recherche image:', error.message);
    }
    
    // Créer le post
    const post = {
      json: {
        content: contentResult.content,
        type: structure.type,
        hashtags: structure.hashtags.join(' '),
        topic: selectedTopic.subject,
        angle: selectedTopic.angle,
        relevance: selectedTopic.relevance,
        generatedAt: new Date().toISOString(),
        style: "authentic_dynamic",
        imageSuggestions: contentResult.imageSuggestions || [],
        image: imageData && imageData.success ? {
          url: imageData.selectedImage.url,
          thumb: imageData.selectedImage.thumb,
          description: imageData.selectedImage.description,
          author: imageData.selectedImage.author,
          authorUrl: imageData.selectedImage.authorUrl,
          source: imageData.source,
          relevanceScore: imageData.relevanceScore
        } : null
      }
    };
    
    // Stocker le post
    lastGeneratedPost = post;
    
    // Envoyer le post
    if (post.json.image && post.json.image.url) {
      await sendPhotoWithCaption(chatId, post.json.image.url, post.json.content);
    } else {
      await sendMessageWithKeyboard(chatId, post.json.content, postGeneratedKeyboard);
    }
    
    // Statistiques
    let stats = `📊 <b>Post généré avec sujet sélectionné:</b>\n` +
      `• Type: ${post.json.type}\n` +
      `• Longueur: ${post.json.content.length} caractères\n` +
      `• Image: ${post.json.image ? '✅' : '❌'}`;
    
    if (post.json.image && post.json.image.relevanceScore !== undefined) {
      stats += `\n• 📊 Pertinence image: ${post.json.image.relevanceScore.toFixed(1)}/10`;
    }
    
    stats += `\n\n🎯 <b>Prêt à publier sur LinkedIn !</b>`;
    
    await sendMessageWithKeyboard(chatId, stats, postGeneratedKeyboard);
    
  } catch (error) {
    console.error('Erreur génération post avec sujet:', error);
    await sendMessageWithKeyboard(chatId, `❌ <b>Erreur:</b>\n\n${error.message}`, postGeneratedKeyboard);
  }
}

// Fonction pour reformuler le texte du post
async function reformulateText(chatId) {
  try {
    if (!lastGeneratedPost || !lastGeneratedPost.json) {
      await sendMessageWithKeyboard(chatId, '❌ <b>Aucun post récent trouvé !</b>\n\nGénérez d\'abord un post.', generateKeyboard);
      return;
    }
    
    await sendMessageWithKeyboard(chatId, '✏️ <b>Reformulation du texte en cours...</b>\n\n🤖 Utilisation de Gemini 2.0 Flash pour améliorer le texte...', null);
    
    const currentPost = lastGeneratedPost.json;
    
    // Préparer le prompt pour reformulation
    const reformulatePrompt = `Tu es un expert en rédaction LinkedIn. Tu dois reformuler et améliorer le texte suivant pour qu'il soit plus engageant, plus professionnel et optimisé pour LinkedIn.

═══════════════════════════════════════════════════════════════
TEXTE ACTUEL À REFORMULER :
═══════════════════════════════════════════════════════════════
${currentPost.content}

═══════════════════════════════════════════════════════════════
CONTEXTE :
═══════════════════════════════════════════════════════════════
Type de post : ${currentPost.type}
Sujet : ${currentPost.topic || 'N/A'}
Angle : ${currentPost.angle || 'N/A'}

═══════════════════════════════════════════════════════════════
INSTRUCTIONS :
═══════════════════════════════════════════════════════════════
1. Garder le même message et le même angle
2. Améliorer la clarté et l'impact
3. Rendre le texte plus engageant
4. Optimiser pour LinkedIn (150-250 mots idéalement)
5. Garder les hashtags si présents
6. Améliorer l'accroche si possible
7. Garder le ton authentique et professionnel

═══════════════════════════════════════════════════════════════
FORMAT DE RÉPONSE :
═══════════════════════════════════════════════════════════════
POST: [ton texte reformulé et amélioré ici]

IMAGE_SUGGESTIONS: [3-5 mots-clés en anglais pour l'image, séparés par des virgules]

REFORMULE MAINTENANT le texte pour qu'il soit plus impactant et engageant :`;
    
    // Appeler Gemini pour reformuler
    const { callGeminiAPI } = require('./generate_authentic_varied_posts.js');
    const response = await callGeminiAPI(reformulatePrompt);
    
    if (!response) {
      await sendMessageWithKeyboard(chatId, '❌ <b>Erreur lors de la reformulation.</b>\n\nGemini n\'a pas pu reformuler le texte.', postGeneratedKeyboard);
      return;
    }
    
    // Parser la réponse (même logique que generatePostContent)
    let postMatch = response.match(/POST:\s*(.+?)(?=IMAGE_SUGGESTIONS:|$)/s);
    if (!postMatch) {
      postMatch = response.match(/POST[:\s]*(.+?)(?=IMAGE|$)/s);
    }
    if (!postMatch) {
      const lines = response.split('\n');
      const postStart = lines.findIndex(line => line.toLowerCase().includes('post') || line.trim().length > 50);
      if (postStart >= 0) {
        postMatch = { 1: lines.slice(postStart).join('\n').replace(/^(POST|POST:)/i, '').trim() };
      }
    }
    
    if (!postMatch || !postMatch[1]) {
      // Si pas de format POST:, utiliser tout le texte
      const reformulatedContent = response.trim();
      if (reformulatedContent.length > 100) {
        // Mettre à jour le post
        lastGeneratedPost.json.content = reformulatedContent;
        
        // Envoyer le nouveau texte
        if (lastGeneratedPost.json.image && lastGeneratedPost.json.image.url) {
          await sendPhotoWithCaption(chatId, lastGeneratedPost.json.image.url, reformulatedContent);
        } else {
          await sendMessageWithKeyboard(chatId, reformulatedContent, postGeneratedKeyboard);
        }
        
        await sendMessageWithKeyboard(chatId, '✅ <b>Texte reformulé avec succès !</b>', postGeneratedKeyboard);
        return;
      }
    }
    
    const reformulatedContent = postMatch[1].trim();
    
    if (reformulatedContent.length < 100) {
      await sendMessageWithKeyboard(chatId, '⚠️ <b>Texte reformulé trop court.</b>\n\nLe texte n\'a pas pu être reformulé correctement.', postGeneratedKeyboard);
      return;
    }
    
    // Mettre à jour le post
    lastGeneratedPost.json.content = reformulatedContent;
    
    // Parser les suggestions d'images si disponibles
    const imageMatch = response.match(/IMAGE_SUGGESTIONS?:\s*(.+?)$/s) || 
                       response.match(/IMAGE[:\s]*(.+?)$/s);
    if (imageMatch && imageMatch[1]) {
      const imageSuggestions = imageMatch[1]
        .trim()
        .split(',')
        .map(s => s.trim())
        .filter(s => s && s.length > 0 && s.length < 50)
        .slice(0, 5);
      lastGeneratedPost.json.imageSuggestions = imageSuggestions;
    }
    
    // Envoyer le nouveau texte
    if (lastGeneratedPost.json.image && lastGeneratedPost.json.image.url) {
      await sendPhotoWithCaption(chatId, lastGeneratedPost.json.image.url, reformulatedContent);
    } else {
      await sendMessageWithKeyboard(chatId, reformulatedContent, postGeneratedKeyboard);
    }
    
    await sendMessageWithKeyboard(chatId, 
      '✅ <b>Texte reformulé avec succès !</b>\n\n' +
      `📝 <b>Longueur:</b> ${reformulatedContent.length} caractères\n` +
      `💡 <b>Le texte a été amélioré par Gemini 2.0 Flash</b>`, 
      postGeneratedKeyboard
    );
    
  } catch (error) {
    console.error('Erreur reformulation texte:', error);
    await sendMessageWithKeyboard(chatId, `❌ <b>Erreur lors de la reformulation:</b>\n\n${error.message}`, postGeneratedKeyboard);
  }
}

// Fonction pour afficher l'aide
async function showHelp(chatId) {
  const helpText = `🤖 <b>Bot LinkedIn Post Generator</b>\n\n` +
    `🎯 <b>Fonctionnalités:</b>\n` +
    `• Génération de posts LinkedIn avec IA Gemini 2.0 Flash\n` +
    `• Images automatiques (Pexels, Freepik, Pixabay, Unsplash)\n` +
    `• Logos tech automatiques (Simple Icons)\n` +
    `• Contenu authentique et varié\n` +
    `• Évitement des répétitions\n\n` +
    `🔧 <b>Configuration requise:</b>\n` +
    `• GEMINI_API_KEY (obligatoire)\n` +
    `• TELEGRAM_BOT_TOKEN\n` +
    `• TELEGRAM_CHAT_ID\n\n` +
    `📱 <b>Boutons disponibles:</b>\n` +
    `• <b>🤖 Générer un Post:</b> Post automatique avec sujet sélectionné\n` +
    `• <b>📋 Choisir un Sujet:</b> Sélectionner parmi les sujets disponibles\n` +
    `• <b>🔄 Changer la Photo:</b> Nouvelle image pour le même contenu\n` +
    `• <b>✏️ Reformuler le Texte:</b> Améliorer le texte avec Gemini\n` +
    `• <b>📊 Statistiques:</b> Voir les stats de la base de données\n\n` +
    `💡 <b>Astuce:</b> Utilisez "Choisir un Sujet" pour avoir plus de contrôle !`;
  
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
    
    // Gérer les callbacks avec sujets (select_topic_0, select_topic_1, etc.)
    if (data.startsWith('select_topic_')) {
      const topicIndex = parseInt(data.replace('select_topic_', ''));
      if (!isNaN(topicIndex)) {
        await generatePostWithTopic(chatId, topicIndex);
      }
    } else if (data === 'back_to_menu') {
      await sendMessageWithKeyboard(chatId, '🔙 <b>Retour au menu principal</b>', generateKeyboard);
    } else {
      switch (data) {
        case 'generate_post':
          await generatePost(chatId);
          break;
        case 'trigger_github':
          await triggerGitHubAction(chatId);
          break;
        case 'change_photo':
          await changePhoto(chatId);
          break;
        case 'choose_topic':
          await chooseTopic(chatId);
          break;
        case 'reformulate_text':
          await reformulateText(chatId);
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
