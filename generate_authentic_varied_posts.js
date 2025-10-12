// 🎯 Générateur de Posts LinkedIn Authentiques - Dynamique & Actualisé
// Basé sur le vrai parcours : 3 ans freelance, 50+ projets, étudiant BUT Informatique
// ✨ Utilise Gemini pour générer du contenu basé sur les actualités de la semaine
// 🎨 Templates = styles/structures, PAS de sujets répétitifs hardcodés
// 💾 Base de données SQLite pour tracking long terme (5+ ans)

// --- Import de la base de données ---
const { getDatabase } = require('./database.js');

// --- Import du système d'images ---
const { findImageForPost } = require('./image_system.js');

// --- Configuration API Gemini 2.5 Flash ---
const GEMINI_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY,
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
  maxTokens: 2000,
  temperature: 0.9
};

// Vérification obligatoire de la clé API
if (!GEMINI_CONFIG.apiKey) {
  console.error('❌ ERREUR: GEMINI_API_KEY manquante dans les variables d\'environnement');
  console.log('💡 Pour obtenir une clé API Gemini:');
  console.log('   1. Va sur https://aistudio.google.com/');
  console.log('   2. Crée un projet');
  console.log('   3. Génère une clé API');
  console.log('   4. Exporte: export GEMINI_API_KEY="ta_clé_ici"');
  process.exit(1);
}

// --- Profil utilisateur pour contexte IA ---
const USER_PROFILE = {
  age: 18,
  role: "Développeur Freelance & Étudiant BUT Informatique",
  experience: "3 ans de freelance, 50+ projets livrés",
  location: "Belfort, Nord Franche-Comté, France",
  skills: ["Vue.js", "Node.js", "Express", "TypeScript", "PostgreSQL", "Python"],
  interests: ["Tech industrielle", "Green Tech", "Agile", "Open Source"],
  goals: ["Recherche stage 8-10 semaines (avril-juin 2025)", "Monter en compétences", "Contribuer à de vrais projets"],
  localCompanies: ["Alstom", "Peugeot Sochaux", "General Electric", "McPhy", "SNCF"],
  style: "Authentique, direct, sans bullshit corporate, ton naturel de jeune dev passionné"
};

// --- Domaines d'actualités à surveiller (pour Gemini) ---
const TOPIC_DOMAINS = [
  "Tendances tech actuelles (frameworks, langages, outils)",
  "Actualités des entreprises tech locales (Belfort, Franche-Comté)",
  "Nouvelles de l'industrie (Alstom, Peugeot, SNCF, transport, énergie)",
  "Éducation et carrière dev (recrutement, stages, formations)",
  "Freelancing et business (tendances, conseils, outils)",
  "Green Tech et développement durable",
  "Événements tech et meetups (local et national)",
  "Success stories de jeunes développeurs",
  "Challenges techniques et solutions innovantes"
];

// --- Structures de posts (STYLE uniquement, pas de contenu fixe) ---
const POST_STRUCTURES = [
  {
    type: "experience_lesson",
    name: "Retour d'expérience avec leçon",
    format: `[Hook sur l'expérience]

[Leçon apprise]

[Situation AVANT]

Maintenant :
→ [Changement 1]
→ [Changement 2]
→ [Changement 3]

[Conclusion]

[Question engagement]`,
    tone: "Direct, authentique, sans filtre",
    hashtags: ["#FreelanceDev", "#WebDev", "#DevLife"]
  },
  {
    type: "tech_debate",
    name: "Débat technique",
    format: `Débat : [Question]

[Contexte perso]

Après [durée] :
✅ [Pro 1]
✅ [Pro 2]
✅ [Pro 3]

Mais [situation opposée] ?
🤔 [Con 1]
🤔 [Con 2]

[Question]`,
    tone: "Curieux, ouvert",
    hashtags: ["#WebDev", "#Tech", "#DevLife"]
  },
  {
    type: "success_story",
    name: "Success story",
    format: `[Flashback temporel]

[Début de l'histoire]

[Détail marquant]

Aujourd'hui :
→ [Réussite 1]
→ [Réussite 2]
→ [Réussite 3]

[Impact concret]

[Leçons apprises]

[Conseil/encouragement]`,
    tone: "Inspirant mais humble",
    hashtags: ["#Freelance", "#WebDev", "#Success"]
  },
  {
    type: "practical_advice",
    name: "Conseil pratique",
    format: `[Titre accrocheur]

❌ [Erreur 1]
→ [Explication]

❌ [Erreur 2]
→ [Explication]

❌ [Erreur 3]
→ [Explication]

[Conclusion impact]

[Question]`,
    tone: "Pédagogique, utile",
    hashtags: ["#WebDev", "#DevTips", "#CodeQuality"]
  },
  {
    type: "current_project",
    name: "Projet en cours",
    format: `Update : [Projet] 🎮

[Concept]

Stack :
→ [Tech 1]
→ [Tech 2]
→ [Tech 3]

Le vrai challenge ?
[Challenge réel]

[Apprentissage]

[Question communauté]`,
    tone: "Enthousiaste, transparent",
    hashtags: ["#DevLife", "#Project", "#Teamwork"]
  },
  {
    type: "tech_discovery",
    name: "Découverte tech",
    format: `[Découverte]

[Feature/outil]

[Avant vs Maintenant]

[Pourquoi c'est utile]

[Question routine]`,
    tone: "Partage de découverte",
    hashtags: ["#TechWatch", "#WebDev", "#Learning"]
  },
  {
    type: "milestone",
    name: "Étape franchie",
    format: `[Achievement] 🎯

[Parcours]

Ce qui a changé :
✅ [Changement 1]
✅ [Changement 2]
✅ [Changement 3]

Ce qui reste :
💻 [Constante 1]
🎯 [Constante 2]

[Prochaine étape]`,
    tone: "Fier mais humble",
    hashtags: ["#Milestone", "#DevJourney", "#Growth"]
  },
  {
    type: "local_industry",
    name: "Industrie locale",
    format: `[Découverte locale]

[Ce qui a attiré l'attention]

[Lien avec la tech]

[Angle personnel]

[Question communauté]`,
    tone: "Curieux, engagé localement",
    hashtags: ["#Belfort", "#IndustrieTech", "#Innovation"]
  },
  {
    type: "reflection",
    name: "Réflexion de fond",
    format: `[Question de fond]

[Contexte/stat]

[Dilemme]

Solutions :
✅ [Solution 1]
✅ [Solution 2]
✅ [Solution 3]

[Responsabilité dev]

[Action perso]

[Question communauté]`,
    tone: "Réfléchi, responsable",
    hashtags: ["#GreenTech", "#DevResponsable", "#Tech"]
  },
  {
    type: "internship_search",
    name: "Recherche stage",
    format: `[Hook recherche]

Contexte : [Détails stage]

Ce que je cherche :
✅ [Critère 1]
✅ [Critère 2]
✅ [Critère 3]

Ce que j'apporte :
💪 [Compétence 1]
💪 [Compétence 2]
💪 [Compétence 3]

[Flexibilité]

[Call-to-action]`,
    tone: "Professionnel mais authentique",
    hashtags: ["#Stage", "#Belfort", "#Recrutement"]
  }
];

// --- Configuration globale ---
const CONFIG = {
  MIN_POST_LENGTH: 400,
  MAX_POST_LENGTH: 2500, // Limite LinkedIn (3000) avec marge de sécurité
  MAX_EMOJIS: 8,
  MAX_HASHTAGS: 5,
  // Limites pour les plateformes
  TELEGRAM_MAX_LENGTH: 4000, // Limite Telegram avec marge
  TELEGRAM_CAPTION_MAX_LENGTH: 1000, // Limite caption Telegram
  LINKEDIN_MAX_LENGTH: 3000 // Limite officielle LinkedIn
};

// Fonction pour générer un hash de sujet
function generateTopicHash(topic) {
  return topic.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 4)
    .sort()
    .slice(0, 5)
    .join('_');
}

// --- Fonctions API Gemini avec retry intelligent ---
async function callGeminiAPI(prompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${GEMINI_CONFIG.baseUrl}?key=${GEMINI_CONFIG.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: GEMINI_CONFIG.temperature,
            maxOutputTokens: GEMINI_CONFIG.maxTokens
          }
        })
      });

      if (!response.ok) {
        // Erreur 429 = rate limit, on attend avant de retry
        if (response.status === 429 && attempt < retries) {
          const waitTime = Math.pow(2, attempt) * 1000; // Backoff exponentiel : 2s, 4s, 8s
          console.log(`⏳ Rate limit atteint, attente de ${waitTime/1000}s avant retry ${attempt}/${retries}...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        throw new Error(`API Gemini error: ${response.status}`);
      }

      const data = await response.json();
      
      // Vérification robuste de la structure de réponse
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        throw new Error('Structure de réponse API invalide');
      }
      
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (attempt === retries) {
        console.error('❌ Erreur API Gemini après tous les retries:', error.message);
        return null;
      }
      // Retry pour les autres erreurs réseau
      console.log(`⚠️ Erreur tentative ${attempt}/${retries}, retry...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  return null;
}

// 🎯 Fonction principale : Obtenir les actualités de la semaine
async function getTrendingTopics() {
  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Récupérer les sujets déjà traités depuis la BDD
  let recentTopicsStr = '';
  try {
    const db = await getDatabase();
    const recentTopics = await db.getRecentTopics(20);
    if (recentTopics.length > 0) {
      recentTopicsStr = `\n\nSUJETS DÉJÀ TRAITÉS (NE PAS RÉPÉTER) :\n${recentTopics.join('\n')}`;
    }
  } catch (error) {
    console.warn('⚠️ Impossible de lire la BDD, continue sans historique:', error.message);
  }

  const prompt = `Tu es un assistant qui aide un jeune développeur freelance à créer du contenu LinkedIn authentique.

PROFIL :
- ${USER_PROFILE.age} ans, ${USER_PROFILE.role}
- ${USER_PROFILE.experience}
- Localisation : ${USER_PROFILE.location}
- Stack : ${USER_PROFILE.skills.join(', ')}
- Objectif : ${USER_PROFILE.goals.join(', ')}

DATE : ${today}

MISSION : Trouve 5 sujets d'actualité DIFFÉRENTS et PERTINENTS pour un post LinkedIn AUJOURD'HUI.

DOMAINES À EXPLORER :
${TOPIC_DOMAINS.map((d, i) => `${i+1}. ${d}`).join('\n')}

SOURCES D'INSPIRATION :
- Actualités tech de cette semaine (frameworks, outils, sorties)
- News des entreprises locales (${USER_PROFILE.localCompanies.join(', ')})
- Tendances LinkedIn actuelles
- Événements tech récents ou à venir
- Problématiques actuelles du dev (recrutement, formations, salaires, etc.)
${recentTopicsStr}

FORMAT DE RÉPONSE (exactement ce format) :
1. SUJET: [Titre du sujet] | ANGLE: [Comment l'aborder] | PERTINENCE: [Pourquoi maintenant]
2. SUJET: [Titre du sujet] | ANGLE: [Comment l'aborder] | PERTINENCE: [Pourquoi maintenant]
3. SUJET: [Titre du sujet] | ANGLE: [Comment l'aborder] | PERTINENCE: [Pourquoi maintenant]
4. SUJET: [Titre du sujet] | ANGLE: [Comment l'aborder] | PERTINENCE: [Pourquoi maintenant]
5. SUJET: [Titre du sujet] | ANGLE: [Comment l'aborder] | PERTINENCE: [Pourquoi maintenant]

CONTRAINTES :
- Sujets actuels et d'actualité (pas des généralités intemporelles)
- Adaptés au profil d'un jeune dev freelance de 18 ans
- Variés (ne pas répéter 3x le même thème)
- Connectés à la réalité du moment
- Éviter absolument les sujets déjà traités ci-dessus`;

  const response = await callGeminiAPI(prompt);
  if (!response) return null;

  // Parser la réponse
  const topics = [];
  const lines = response.split('\n').filter(line => line.match(/^\d+\./));
  
  for (const line of lines) {
    const match = line.match(/SUJET:\s*(.+?)\s*\|\s*ANGLE:\s*(.+?)\s*\|\s*PERTINENCE:\s*(.+)/);
    if (match) {
      topics.push({
        subject: match[1].trim(),
        angle: match[2].trim(),
        relevance: match[3].trim()
      });
    }
  }
  
  return topics.length > 0 ? topics : null;
}

// 🎨 Fonction : Générer le contenu complet du post avec Gemini + suggestions d'images
async function generatePostContent(topic, structure) {
  const prompt = `Tu es un ghostwriter LinkedIn pour un jeune développeur freelance authentique.

PROFIL :
- ${USER_PROFILE.age} ans, ${USER_PROFILE.role}
- ${USER_PROFILE.experience}
- ${USER_PROFILE.location}
- Stack : ${USER_PROFILE.skills.join(', ')}
- Style : ${USER_PROFILE.style}

SUJET DU POST :
${topic.subject}

ANGLE :
${topic.angle}

POURQUOI MAINTENANT :
${topic.relevance}

STRUCTURE À SUIVRE :
${structure.format}

TON REQUIS : ${structure.tone}

CONSIGNES STRICTES :
1. Écris comme un vrai jeune de 18 ans, pas comme un corporate LinkedIn
2. Utilise "je", "j'ai", sois direct et authentique
3. Pas de formules creuses type "ravi de partager", "n'hésitez pas"
4. Langage naturel : "cool", "galère", "franchement", "genre", etc.
5. Expérience personnelle concrète (lié à ses 3 ans de freelance ou études)
6. Chiffres précis si possible (temps, nombre, pourcentage)
7. Questions ouvertes pour engagement
8. Entre 400 et 2500 caractères (limite LinkedIn)
9. Maximum 6 emojis
10. Ton authentique, humble mais confiant
11. IMPORTANT: Respecte la limite de 2500 caractères pour LinkedIn

EXEMPLE DE TON (à imiter) :
"3 ans de freelance, 50+ projets.

La leçon ? Dire non aux mauvais clients vaut mieux que dire oui à tout.

Avant : j'acceptais tout. Résultat : nuits blanches, clients impossibles.

Maintenant :
→ Brief clair ou je passe
→ Budget réaliste ou non merci
→ Respect mutuel ou rien

Un client toxique en moins = du temps pour de bons projets.

Vous avez déjà vécu ça ?"

FORMAT DE RÉPONSE EXACT :
POST: [ton contenu de post ici]

IMAGE_SUGGESTIONS: [3-5 mots-clés en anglais pour chercher une image pertinente, séparés par des virgules]

GÉNÈRE MAINTENANT :`;

  const response = await callGeminiAPI(prompt);
  if (!response) return null;

  // Parser la réponse pour extraire le post et les suggestions d'images
  const postMatch = response.match(/POST:\s*(.+?)(?=IMAGE_SUGGESTIONS:|$)/s);
  const imageMatch = response.match(/IMAGE_SUGGESTIONS:\s*(.+?)$/s);

  if (postMatch) {
    const postContent = postMatch[1].trim();
    const imageSuggestions = imageMatch ? imageMatch[1].trim().split(',').map(s => s.trim()) : [];
    
    return {
      content: postContent,
      imageSuggestions: imageSuggestions
    };
  }

  return null;
}

// --- Fonction principale ---
async function generateAuthenticPost(maxAttempts = 3) {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`🔄 Tentative ${attempts}/${maxAttempts}...`);
    
    try {
      // 1. Obtenir les trending topics
      console.log('📡 Recherche des actualités de la semaine...');
      const topics = await getTrendingTopics();
      
      if (!topics || topics.length === 0) {
        console.warn('⚠️ Aucun sujet d\'actualité trouvé, fallback...');
        return generateFallbackPost();
      }
      
      // 2. Filtrer les sujets déjà traités (vérification BDD)
      const db = await getDatabase();
      const freshTopics = [];
      
      for (const topic of topics) {
        const hash = generateTopicHash(topic.subject);
        const isTreated = await db.isTopicTreated(hash);
        if (!isTreated) {
          freshTopics.push(topic);
        }
      }
      
      if (freshTopics.length === 0) {
        console.warn('⚠️ Tous les sujets ont déjà été traités');
        continue;
      }
      
      // 3. Sélectionner un sujet aléatoire
      const selectedTopic = freshTopics[Math.floor(Math.random() * freshTopics.length)];
      console.log(`🎯 Sujet sélectionné : ${selectedTopic.subject}`);
      
      // 4. Sélectionner une structure appropriée
      const structure = POST_STRUCTURES[Math.floor(Math.random() * POST_STRUCTURES.length)];
      console.log(`🎨 Structure : ${structure.name}`);
      
      // 5. Générer le contenu complet avec suggestions d'images
      console.log('✍️ Génération du contenu avec Gemini 2.5 Flash...');
      const contentResult = await generatePostContent(selectedTopic, structure);
      
      if (!contentResult || !contentResult.content) {
        console.warn('⚠️ Échec de génération du contenu');
        continue;
      }
      
      console.log('🤖 Suggestions d\'images Gemini:', contentResult.imageSuggestions.join(', '));
      
      // 6. Nettoyer et formatter
      let finalContent = cleanPost(contentResult.content);
      
      // 7. Ajouter les hashtags
      const hashtags = structure.hashtags.join(' ');
      finalContent += '\n\n' + hashtags;
      
      // 8. Validation et ajustement de longueur
      if (finalContent.length < CONFIG.MIN_POST_LENGTH) {
        console.warn('⚠️ Post trop court');
        continue;
      }
      
      // Valider la longueur pour LinkedIn
      finalContent = validatePostLength(finalContent, 'linkedin');
      
      // 9. Rechercher une image pertinente avec suggestions Gemini
      let imageData = null;
      try {
        console.log('🎨 Recherche d\'une image avec suggestions Gemini...');
        
        // Récupérer les images déjà utilisées
        const usedImages = await db.getUsedImages();
        console.log(`   📊 ${usedImages.length} image(s) déjà utilisée(s) en BDD`);
        
        // Chercher une image non utilisée avec suggestions Gemini
        imageData = await findImageForPost(structure.type, finalContent, usedImages, contentResult.imageSuggestions);
        
        if (imageData && imageData.success) {
          console.log(`✅ Image trouvée : ${imageData.selectedImage.description}`);
          if (imageData.warning) {
            console.log(`⚠️ ${imageData.warning}`);
          }
        }
      } catch (error) {
        console.warn('⚠️ Erreur recherche image (le post est quand même généré):', error.message);
      }
      
      // 10. Créer le post final
      const post = {
        json: {
          content: finalContent,
          type: structure.type,
          hashtags: hashtags,
          topic: selectedTopic.subject,
          angle: selectedTopic.angle,
          relevance: selectedTopic.relevance,
          generatedAt: new Date().toISOString(),
          style: "authentic_dynamic",
          image: imageData && imageData.success ? {
            url: imageData.selectedImage.url,
            thumb: imageData.selectedImage.thumb,
            description: imageData.selectedImage.description,
            author: imageData.selectedImage.author,
            authorUrl: imageData.selectedImage.authorUrl,
            source: 'unsplash'
          } : null
        }
      };
      
      // 11. Sauvegarder dans la base de données (avec image)
      const topicHash = generateTopicHash(selectedTopic.subject);
      
      try {
        await db.savePost({
          topic: selectedTopic.subject,
          topicHash: topicHash,
          type: structure.type,
          content: finalContent,
          hashtags: hashtags,
          angle: selectedTopic.angle,
          relevance: selectedTopic.relevance,
          isFallback: false,
          imageUrl: imageData && imageData.success ? imageData.selectedImage.url : null,
          imageHash: imageData && imageData.imageHash ? imageData.imageHash : null
        });
        console.log('✅ Post + image sauvegardés dans la BDD');
      } catch (error) {
        console.warn('⚠️ Erreur sauvegarde BDD (le post est quand même généré):', error.message);
      }
      
      console.log('✅ Post généré avec succès !');
      return post;
      
    } catch (error) {
      console.error(`❌ Erreur tentative ${attempts}:`, error);
    }
  }
  
  // Fallback si toutes les tentatives échouent
  console.warn('⚠️ Toutes les tentatives ont échoué, utilisation du fallback');
  return generateFallbackPost();
}

// --- Fonction de fallback (sans IA) ---
async function generateFallbackPost() {
  // 100 contenus de fallback variés pour garantir la diversité
  const fallbackContents = require('./fallback_posts.js');
  
  const selected = fallbackContents[Math.floor(Math.random() * fallbackContents.length)];
  const fullContent = selected.content + '\n\n' + selected.hashtags;
  
  // Rechercher une image pour le fallback aussi (non utilisée)
  let imageData = null;
  try {
    console.log('🎨 Recherche d\'une image pour le fallback...');
    
    const db = await getDatabase();
    const usedImages = await db.getUsedImages();
    console.log(`   📊 ${usedImages.length} image(s) déjà utilisée(s) en BDD`);
    
    imageData = await findImageForPost(selected.type, fullContent, usedImages);
    
    if (imageData && imageData.success) {
      console.log(`✅ Image non utilisée trouvée pour fallback`);
      if (imageData.warning) {
        console.log(`⚠️ ${imageData.warning}`);
      }
    }
  } catch (error) {
    console.warn('⚠️ Erreur recherche image fallback:', error.message);
  }
  
  // Sauvegarder aussi le fallback en BDD (marqué comme fallback, avec image)
  try {
    const db = await getDatabase();
    await db.savePost({
      topic: 'Fallback Post',
      topicHash: 'fallback_' + Date.now(),
      type: selected.type,
      content: fullContent,
      hashtags: selected.hashtags,
      angle: 'Fallback',
      relevance: 'Fallback',
      isFallback: true,
      imageUrl: imageData && imageData.success ? imageData.selectedImage.url : null,
      imageHash: imageData && imageData.imageHash ? imageData.imageHash : null
    });
  } catch (error) {
    console.warn('⚠️ Erreur sauvegarde fallback en BDD:', error.message);
  }
  
  return {
    json: {
      content: fullContent,
      type: selected.type,
      hashtags: selected.hashtags,
      generatedAt: new Date().toISOString(),
      style: "authentic_fallback",
      isFallback: true,
      image: imageData && imageData.success ? {
        url: imageData.selectedImage.url,
        thumb: imageData.selectedImage.thumb,
        description: imageData.selectedImage.description,
        author: imageData.selectedImage.author,
        authorUrl: imageData.selectedImage.authorUrl,
        source: 'unsplash'
      } : null
    }
  };
}

// --- Fonctions utilitaires ---
function cleanPost(content) {
  return content
    .replace(/\$\{[^}]+\}/g, '')
    .replace(/undefined/g, '')
    .replace(/\[|\]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/  +/g, ' ')
    .trim();
}

// Fonction pour valider et ajuster la longueur du post
function validatePostLength(content, platform = 'linkedin') {
  const limits = {
    linkedin: CONFIG.LINKEDIN_MAX_LENGTH,
    telegram: CONFIG.TELEGRAM_MAX_LENGTH,
    telegram_caption: CONFIG.TELEGRAM_CAPTION_MAX_LENGTH
  };
  
  const maxLength = limits[platform] || CONFIG.MAX_POST_LENGTH;
  
  if (content.length > maxLength) {
    console.log(`⚠️ Post trop long (${content.length} caractères), tronquage pour ${platform}...`);
    return content.substring(0, maxLength - 100) + '...';
  }
  
  return content;
}

// Fonction pour afficher les statistiques de la BDD
async function showDatabaseStats() {
  try {
    const db = await getDatabase();
    const stats = await db.getStats();
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📊 STATISTIQUES BASE DE DONNÉES');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📝 Total posts générés : ${stats.total_posts}`);
    console.log(`✅ Posts avec actualités : ${stats.real_posts}`);
    console.log(`⚠️  Posts fallback : ${stats.fallback_posts}`);
    console.log(`🎨 Types de posts uniques : ${stats.unique_types}`);
    if (stats.first_post_date) {
      console.log(`📅 Premier post : ${new Date(stats.first_post_date).toLocaleDateString('fr-FR')}`);
    }
    if (stats.last_post_date) {
      console.log(`📅 Dernier post : ${new Date(stats.last_post_date).toLocaleDateString('fr-FR')}`);
    }
    console.log('═══════════════════════════════════════════════════════════\n');
    return stats;
  } catch (error) {
    console.error('❌ Erreur affichage stats:', error);
    return null;
  }
}

// --- Fonction de test ---
async function testAIIntegration() {
  console.log('🧪 Test de l\'intégration IA dynamique...\n');
  
  try {
    // Test 1: Trending topics
    console.log('📡 Test 1 : Récupération des actualités...');
    const topics = await getTrendingTopics();
    if (topics) {
      console.log(`✅ ${topics.length} sujets d'actualité trouvés :`);
      topics.forEach((t, i) => {
        console.log(`   ${i+1}. ${t.subject}`);
        console.log(`      Angle: ${t.angle}`);
        console.log(`      Pertinence: ${t.relevance}\n`);
      });
    } else {
      console.log('❌ Aucun sujet trouvé\n');
    }
    
    // Test 2: Génération complète
    console.log('✍️ Test 2 : Génération d\'un post complet...');
    const post = await generateAuthenticPost();
    if (post) {
      console.log('✅ Post généré avec succès !');
      console.log('📝 Aperçu :');
      console.log(post.json.content.substring(0, 200) + '...');
      console.log(`\n📊 Métadonnées :`);
      console.log(`   Sujet : ${post.json.topic || 'N/A'}`);
      console.log(`   Type : ${post.json.type}`);
      console.log(`   Longueur : ${post.json.content.length} caractères`);
      console.log(`   Fallback : ${post.json.isFallback || false}`);
    } else {
      console.log('❌ Échec de génération\n');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du test :', error);
    return false;
  }
}

// --- Exports ---
module.exports = generateAuthenticPost;
module.exports.generateAuthenticPost = generateAuthenticPost;
module.exports.testAIIntegration = testAIIntegration;
module.exports.getTrendingTopics = getTrendingTopics;
module.exports.generatePostContent = generatePostContent;
module.exports.showDatabaseStats = showDatabaseStats;
module.exports.getDatabase = getDatabase;
