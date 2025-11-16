#!/usr/bin/env node

/**
 * ⏰ Publication Automatique LinkedIn avec Notification Telegram
 * 
 * Ce script publie automatiquement un post sur LinkedIn à 9h et 14h
 * du lundi au vendredi uniquement (pas le weekend)
 * et envoie une notification Telegram pour confirmer la publication.
 * 
 * Usage:
 *   node auto_post_scheduler.js
 * 
 * Configuration:
 *   - AUTO_PUBLISH_LINKEDIN: true pour publier automatiquement sur LinkedIn
 */

require('dotenv').config();
const { generateAuthenticPost } = require('./generate_authentic_varied_posts.js');
const { publishGeneratedPost, LINKEDIN_CONFIG } = require('./linkedin_api.js');
const fetch = require('node-fetch');

// Configuration
const CONFIG = {
  // Horaires de publication (heure locale)
  postTimes: [9, 14], // 9h et 14h
  autoPublishLinkedIn: process.env.AUTO_PUBLISH_LINKEDIN !== 'false', // Publier sur LinkedIn par défaut
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '8432791411:AAGRitXf4h7FOZNTvOJD08vuNGcByV3fFfA',
  telegramChatId: process.env.TELEGRAM_CHAT_ID || '7828724589',
  telegramBaseUrl: 'https://api.telegram.org/bot'
};

// Fonction pour vérifier si c'est un jour de semaine (lundi=1, dimanche=0)
function isWeekday(date = new Date()) {
  const day = date.getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi
  return day >= 1 && day <= 5; // lundi à vendredi
}

// Fonction pour calculer le prochain horaire de publication
function getNextPostTime() {
  const now = new Date();
  let nextTime = new Date(now);
  
  // Si on est le weekend, passer au lundi 9h
  if (!isWeekday(now)) {
    const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
    nextTime.setDate(now.getDate() + daysUntilMonday);
    nextTime.setHours(9, 0, 0, 0);
    return nextTime;
  }
  
  // Trouver le prochain horaire de publication aujourd'hui
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  for (const postHour of CONFIG.postTimes) {
    if (currentHour < postHour) {
      nextTime.setHours(postHour, 0, 0, 0);
      return nextTime;
    }
  }
  
  // Si on a dépassé tous les horaires d'aujourd'hui, passer au lendemain 9h
  nextTime.setDate(now.getDate() + 1);
  nextTime.setHours(9, 0, 0, 0);
  
  // Si le lendemain est le weekend, passer au lundi
  while (!isWeekday(nextTime)) {
    nextTime.setDate(nextTime.getDate() + 1);
  }
  
  return nextTime;
}

// Fonction pour envoyer une notification Telegram
async function sendTelegramNotification(message, photoUrl = null) {
  try {
    if (photoUrl) {
      const url = `${CONFIG.telegramBaseUrl}${CONFIG.telegramBotToken}/sendPhoto`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CONFIG.telegramChatId,
          photo: photoUrl,
          caption: message,
          parse_mode: 'HTML'
        })
      });
      const data = await response.json();
      return data.ok;
    } else {
      const url = `${CONFIG.telegramBaseUrl}${CONFIG.telegramBotToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CONFIG.telegramChatId,
          text: message,
          parse_mode: 'HTML'
        })
      });
      const data = await response.json();
      return data.ok;
    }
  } catch (error) {
    console.error('❌ Erreur envoi notification Telegram:', error);
    return false;
  }
}

// Fonction pour publier un post automatiquement
async function publishAutomaticPost() {
  try {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`⏰ Publication automatique - ${new Date().toLocaleString('fr-FR')}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    
    // Générer un post
    console.log('📝 Génération d\'un post avec Gemini...');
    const post = await generateAuthenticPost();
    
    if (!post || !post.json) {
      throw new Error('Erreur lors de la génération du post');
    }
    
    console.log('✅ Post généré avec succès !');
    console.log(`📄 Type: ${post.json.type}`);
    console.log(`📏 Longueur: ${post.json.content.length} caractères`);
    console.log(`🖼️  Image: ${post.json.image ? '✅' : '❌'}\n`);
    
    let linkedInPostUrl = null;
    let linkedInSuccess = false;
    
    // Publier sur LinkedIn si configuré
    if (CONFIG.autoPublishLinkedIn && LINKEDIN_CONFIG.accessToken) {
      try {
        console.log('🔗 Publication sur LinkedIn...');
        const linkedInResult = await publishGeneratedPost(post);
        
        if (linkedInResult && linkedInResult.id) {
          const postId = linkedInResult.id.split(':').pop();
          linkedInPostUrl = `https://www.linkedin.com/feed/update/${postId}`;
          linkedInSuccess = true;
          console.log(`✅ Post publié sur LinkedIn !`);
          console.log(`🔗 URL: ${linkedInPostUrl}\n`);
        }
      } catch (error) {
        console.error('❌ Erreur publication LinkedIn:', error.message);
        console.log('⚠️  Le post sera quand même envoyé sur Telegram\n');
      }
    } else {
      console.log('⚠️  Publication LinkedIn désactivée ou non configurée\n');
    }
    
    // Envoyer notification Telegram
    let notificationMessage = `🤖 <b>Post LinkedIn Généré Automatiquement</b>\n\n`;
    notificationMessage += `📄 <b>Type:</b> ${post.json.type}\n`;
    notificationMessage += `📏 <b>Longueur:</b> ${post.json.content.length} caractères\n`;
    notificationMessage += `🖼️  <b>Image:</b> ${post.json.image ? '✅' : '❌'}\n\n`;
    
    if (linkedInSuccess) {
      notificationMessage += `✅ <b>Publié sur LinkedIn !</b>\n`;
      notificationMessage += `🔗 <a href="${linkedInPostUrl}">Voir le post</a>\n\n`;
    } else {
      notificationMessage += `⚠️  <b>Non publié sur LinkedIn</b>\n\n`;
    }
    
    notificationMessage += `📝 <b>Contenu:</b>\n${post.json.content.substring(0, 500)}${post.json.content.length > 500 ? '...' : ''}`;
    
    // Envoyer avec image si disponible
    const imageUrl = post.json.image?.url || null;
    const notificationSent = await sendTelegramNotification(notificationMessage, imageUrl);
    
    if (notificationSent) {
      console.log('✅ Notification Telegram envoyée !');
    } else {
      console.warn('⚠️  Erreur envoi notification Telegram');
    }
    
    console.log('\n✅ Publication automatique terminée avec succès !\n');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur publication automatique:', error);
    
    // Envoyer notification d'erreur
    const errorMessage = `❌ <b>Erreur Publication Automatique</b>\n\n` +
      `⏰ ${new Date().toLocaleString('fr-FR')}\n\n` +
      `Erreur: ${error.message}`;
    await sendTelegramNotification(errorMessage);
    
    return false;
  }
}

// Fonction principale avec planification
async function startScheduler() {
  console.log('\n⏰ Démarrage du Planificateur de Publication Automatique\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📋 Configuration:');
  console.log(`   • Horaires: 9h et 14h (du lundi au vendredi)`);
  console.log(`   • Publication LinkedIn: ${CONFIG.autoPublishLinkedIn ? '✅ Activée' : '❌ Désactivée'}`);
  console.log(`   • Notification Telegram: ✅ Activée`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Vérifier la configuration
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY manquante !');
    process.exit(1);
  }
  
  if (CONFIG.autoPublishLinkedIn && !LINKEDIN_CONFIG.accessToken) {
    console.warn('⚠️  Publication LinkedIn désactivée (LINKEDIN_ACCESS_TOKEN manquant)');
    CONFIG.autoPublishLinkedIn = false;
  }
  
  // Fonction pour programmer la prochaine publication
  async function scheduleNextPost() {
    const nextTime = getNextPostTime();
    const now = new Date();
    const delayMs = nextTime.getTime() - now.getTime();
    
    // Vérifier si on est en weekend
    if (!isWeekday(now)) {
      console.log(`\n📅 Weekend détecté. Prochaine publication: ${nextTime.toLocaleString('fr-FR')}\n`);
      setTimeout(() => {
        scheduleNextPost();
      }, delayMs);
      return;
    }
    
    // Vérifier si on est à l'heure de publication (dans les 5 premières minutes)
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const isPostTime = CONFIG.postTimes.includes(currentHour) && currentMinute < 5;
    
    if (isPostTime && isWeekday(now)) {
      // Publier maintenant
      console.log(`\n⏰ Heure de publication (${currentHour}h) !\n`);
      await publishAutomaticPost();
    }
    
    // Programmer la prochaine publication
    console.log(`\n⏰ Prochaine publication: ${nextTime.toLocaleString('fr-FR')}`);
    const hoursUntilNext = Math.floor(delayMs / (1000 * 60 * 60));
    const minutesUntilNext = Math.floor((delayMs % (1000 * 60 * 60)) / (1000 * 60));
    console.log(`   Dans ${hoursUntilNext}h ${minutesUntilNext}min\n`);
    
    setTimeout(async () => {
      if (isWeekday(new Date())) {
        await publishAutomaticPost();
      }
      scheduleNextPost();
    }, delayMs);
  }
  
  // Envoyer notification de démarrage
  const nextTime = getNextPostTime();
  const startMessage = `🚀 <b>Planificateur de Publication Démarré</b>\n\n` +
    `⏰ Horaires: 9h et 14h (du lundi au vendredi)\n` +
    `🔗 LinkedIn: ${CONFIG.autoPublishLinkedIn ? '✅ Activé' : '❌ Désactivé'}\n` +
    `📱 Telegram: ✅ Activé\n\n` +
    `⏰ Prochaine publication: ${nextTime.toLocaleString('fr-FR')}`;
  await sendTelegramNotification(startMessage);
  
  // Démarrer la planification
  await scheduleNextPost();
  
  console.log('✅ Planificateur actif. Le bot va publier automatiquement.\n');
  console.log('💡 Pour arrêter: Ctrl+C\n');
}

// Gestion de l'arrêt propre
process.on('SIGINT', async () => {
  console.log('\n\n⏹️  Arrêt du planificateur...');
  const stopMessage = `⏹️  <b>Planificateur Arrêté</b>\n\n` +
    `⏰ ${new Date().toLocaleString('fr-FR')}`;
  await sendTelegramNotification(stopMessage);
  process.exit(0);
});

// Exports
module.exports = {
  startScheduler,
  publishAutomaticPost
};

// Mode "une seule fois" pour GitHub Actions
if (process.argv.includes('--once')) {
  publishAutomaticPost().then(success => {
    process.exit(success ? 0 : 1);
  }).catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
} else if (require.main === module) {
  startScheduler().catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
}

