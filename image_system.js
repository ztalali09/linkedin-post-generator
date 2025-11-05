// 🎨 Système Intelligent de Recherche d'Images pour Posts LinkedIn
// Utilise l'API Unsplash pour trouver des images pertinentes

const fetch = require('node-fetch');

// Configuration de l'API Unsplash
const IMAGE_CONFIG = {
  unsplash: {
    accessKey: process.env.UNSPLASH_ACCESS_KEY || 'wRcMCC950Uor09pS2ool-Xbtw6ROp22UbMKXdCSkweI',
    baseUrl: 'https://api.unsplash.com/search/photos',
    enabled: true,
    // Restrictions de contenu pour LinkedIn professionnel
    contentFilter: {
      orientation: 'landscape', // Évite les portraits trop personnels
      content_filter: 'high', // Filtre strict pour contenu approprié
      safe_search: true // Recherche sécurisée
    }
  }
};

// Mots-clés interdits pour éviter le contenu inapproprié
const FORBIDDEN_KEYWORDS = [
  'nude', 'naked', 'nudity', 'sex', 'sexual', 'adult', 'explicit',
  'alcohol', 'beer', 'wine', 'drunk', 'drinking', 'party', 'club',
  'violence', 'weapon', 'gun', 'knife', 'blood', 'fight',
  'drug', 'smoke', 'cigarette', 'tobacco', 'marijuana',
  'gambling', 'casino', 'bet', 'lottery',
  'political', 'protest', 'riot', 'strike',
  'religious', 'church', 'mosque', 'temple',
  'medical', 'hospital', 'surgery', 'injury',
  'death', 'funeral', 'cemetery', 'grave'
];

// Mots-clés de sécurité pour LinkedIn professionnel
const PROFESSIONAL_SAFE_KEYWORDS = [
  'professional', 'business', 'office', 'workplace', 'teamwork',
  'technology', 'computer', 'laptop', 'coding', 'programming',
  'success', 'achievement', 'growth', 'learning', 'education',
  'innovation', 'creativity', 'collaboration', 'meeting',
  'workspace', 'modern', 'clean', 'minimal', 'corporate'
];

// Mots-clés intelligents par type de post
const SMART_KEYWORDS = {
  experience_lesson: {
    primary: ["freelance developer", "remote work", "home office", "laptop coding"],
    secondary: ["professional workspace", "modern office", "Belfort", "Nord Franche-Comté"],
    fallback: ["developer", "programming", "work from home"]
  },
  tech_debate: {
    primary: ["Vue.js vs React", "programming comparison", "frontend frameworks", "JavaScript frameworks"],
    secondary: ["Vue logo", "React logo", "programming debate", "tech discussion"],
    fallback: ["programming", "web development", "coding"]
  },
  success_story: {
    primary: ["career success", "professional growth", "achievement", "milestone"],
    secondary: ["student developer", "freelance success", "Belfort", "career path"],
    fallback: ["success", "growth", "achievement"]
  },
  practical_advice: {
    primary: ["web development tips", "coding best practices", "programming advice", "developer tips"],
    secondary: ["code review", "programming tips", "web dev", "coding"],
    fallback: ["programming", "development", "coding"]
  },
  current_project: {
    primary: ["team collaboration", "project management", "agile development", "group work"],
    secondary: ["student project", "teamwork", "Belfort", "project planning"],
    fallback: ["teamwork", "project", "collaboration"]
  },
  tech_discovery: {
    primary: ["technology innovation", "tech trends", "programming news", "developer tools"],
    secondary: ["tech watch", "innovation", "programming", "Belfort tech"],
    fallback: ["technology", "innovation", "programming"]
  },
  milestone: {
    primary: ["career achievement", "professional milestone", "success celebration", "achievement"],
    secondary: ["career growth", "professional success", "Belfort", "milestone"],
    fallback: ["success", "achievement", "milestone"]
  },
  tech_stack: {
    primary: ["programming tools", "developer setup", "tech stack", "coding environment"],
    secondary: ["development tools", "programming setup", "Belfort", "tech workspace"],
    fallback: ["programming", "tools", "development"]
  },
  optimization: {
    primary: ["web performance", "code optimization", "website speed", "performance"],
    secondary: ["web optimization", "performance", "speed", "efficiency"],
    fallback: ["optimization", "performance", "speed"]
  },
  internship_search: {
    primary: ["internship", "stage développeur", "student internship", "career opportunity"],
    secondary: ["Belfort", "Nord Franche-Comté", "stage", "Alstom", "Peugeot"],
    fallback: ["internship", "stage", "career"]
  },
  local_industry: {
    primary: ["industry technology", "industrial innovation", "tech industry", "smart industry"],
    secondary: ["Alstom", "TGV", "SNCF", "Peugeot", "Belfort industriel"],
    fallback: ["industry", "technology", "innovation"]
  },
  reflection: {
    primary: ["sustainable technology", "green tech", "eco friendly", "environment"],
    secondary: ["sustainability", "ecology", "green energy", "nature"],
    fallback: ["technology", "innovation", "future"]
  }
};

// Fonction pour extraire des mots-clés du contenu (améliorée avec détection synonymes)
function extractContentKeywords(content) {
  const keywords = [];
  const contentLower = content.toLowerCase();
  
  // Mots-clés techniques (français + anglais) avec synonymes
  const techKeywordsMap = {
    'vue.js': ['vue', 'vuejs', 'vuejs', 'vue 3'],
    'react': ['reactjs', 'react.js'],
    'typescript': ['ts', 'type script'],
    'javascript': ['js', 'ecmascript'],
    'node.js': ['node', 'nodejs'],
    'express': ['expressjs'],
    'tailwind': ['tailwindcss', 'tailwind css'],
    'css': ['cascading style sheets'],
    'html': ['hypertext markup language'],
    'docker': ['dockerize', 'container'],
    'git': ['github', 'gitlab', 'version control'],
    'python': ['py', 'python3'],
    'postgresql': ['postgres', 'pg'],
    'mongodb': ['mongo', 'nosql'],
    'redis': ['redis cache'],
    'kubernetes': ['k8s', 'kube'],
    'aws': ['amazon web services', 'amazon'],
    'azure': ['microsoft azure'],
    'firebase': ['google firebase'],
    'next.js': ['next', 'nextjs'],
    'nuxt.js': ['nuxt', 'nuxtjs'],
    'svelte': ['sveltejs'],
    'angular': ['angularjs'],
    'développement': ['dev', 'development', 'coding'],
    'programmation': ['programming', 'code'],
    'application': ['app', 'software'],
    'site web': ['website', 'web', 'site']
  };
  
  // Parcourir la map des mots-clés
  Object.keys(techKeywordsMap).forEach(keyword => {
    const variants = [keyword, ...techKeywordsMap[keyword]];
    const found = variants.some(variant => contentLower.includes(variant.toLowerCase()));
    if (found) {
      keywords.push(keyword.toLowerCase());
    }
  });
  
  // Mots-clés de contexte (français) avec synonymes
  const contextKeywordsMap = {
    'débat': ['debate', 'discussion', 'comparaison'],
    'comparaison': ['comparison', 'vs', 'versus', 'compare'],
    'projet': ['project', 'projet étudiant'],
    'équipe': ['team', 'teamwork', 'collaboration'],
    'freelance': ['freelancer', 'indépendant'],
    'stage': ['internship', 'stage développeur', 'stage étudiant'],
    'carrière': ['career', 'professional'],
    'belfort': ['nord franche-comté', '90000'],
    'alstom': ['tgv', 'train'],
    'peugeot': ['psa', 'automobile'],
    'sncf': ['train', 'railway'],
    'client': ['customer', 'client projet'],
    'apprentissage': ['learning', 'formation', 'training'],
    'formation': ['education', 'training', 'cours'],
    'entreprise': ['company', 'business', 'firm'],
    'industrie': ['industry', 'secteur'],
    'innovation': ['innovation', 'tech'],
    'technologie': ['technology', 'tech']
  };
  
  Object.keys(contextKeywordsMap).forEach(keyword => {
    const variants = [keyword, ...contextKeywordsMap[keyword]];
    const found = variants.some(variant => contentLower.includes(variant.toLowerCase()));
    if (found) {
      keywords.push(keyword.toLowerCase());
    }
  });
  
  // Extraction de mots-clés par fréquence (pour détecter les mots importants non listés)
  const words = contentLower
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 4);
  
  const stopWords = ['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'pour', 'avec', 'dans', 'sur', 'par', 'ce', 'cette', 'ces', 'qui', 'que', 'dont', 'où', 'quand', 'comment', 'pourquoi', 'est', 'sont', 'était', 'être', 'avoir', 'a', 'fait', 'faire', 'j\'ai', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'mon', 'ma', 'mes', 'son', 'sa', 'ses', 'notre', 'votre', 'leur', 'leurs'];
  
  const wordFreq = {};
  words.forEach(word => {
    if (!stopWords.includes(word) && word.length >= 4) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  // Ajouter les 3 mots les plus fréquents qui ne sont pas déjà dans keywords
  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word)
    .filter(word => !keywords.includes(word) && word.length >= 4);
  
  keywords.push(...topWords.slice(0, 3));
  
  return [...new Set(keywords)].slice(0, 8); // Maximum 8 mots-clés (augmenté de 5)
}

// Fonction pour filtrer les mots-clés et s'assurer qu'ils sont appropriés
function filterSafeKeywords(keywords) {
  const safeKeywords = keywords.filter(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    
    // Vérifier si le mot-clé contient des mots interdits
    const containsForbidden = FORBIDDEN_KEYWORDS.some(forbidden => 
      lowerKeyword.includes(forbidden.toLowerCase())
    );
    
    // Vérifier si le mot-clé est trop court ou trop générique
    const isTooGeneric = lowerKeyword.length < 3 || 
      ['the', 'and', 'or', 'but', 'for', 'with', 'from', 'this', 'that'].includes(lowerKeyword);
    
    return !containsForbidden && !isTooGeneric;
  });
  
  // Ajouter des mots-clés de sécurité professionnels si nécessaire
  if (safeKeywords.length < 3) {
    const randomSafeKeywords = PROFESSIONAL_SAFE_KEYWORDS
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    safeKeywords.push(...randomSafeKeywords);
  }
  
  return safeKeywords;
}

// Fonction pour scorer une requête selon sa pertinence avec le contenu
function scoreQuery(query, content, geminiSuggestions = []) {
  let score = 0;
  const queryLower = query.toLowerCase();
  const contentLower = content.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length >= 3);
  
  // 1. Score selon correspondance avec suggestions Gemini (pondération forte)
  if (geminiSuggestions.length > 0) {
    const geminiMatches = geminiSuggestions.filter(sugg => 
      queryLower.includes(sugg.toLowerCase()) || queryWords.some(w => sugg.toLowerCase().includes(w))
    ).length;
    score += geminiMatches * 3; // +3 par suggestion Gemini correspondante
  }
  
  // 2. Score selon correspondance avec le contenu (pondération moyenne)
  const contentMatches = queryWords.filter(word => 
    contentLower.includes(word) || 
    extractContentKeywords(content).some(keyword => keyword.includes(word) || word.includes(keyword))
  ).length;
  score += contentMatches * 2; // +2 par mot correspondant au contenu
  
  // 3. Pénaliser les requêtes trop génériques (score -1)
  const genericWords = ['programming', 'coding', 'development', 'technology', 'tech', 'computer', 'code'];
  const genericCount = queryWords.filter(w => genericWords.includes(w)).length;
  if (genericCount >= 2) {
    score -= 2; // Trop générique
  }
  
  // 4. Bonus pour les mots-clés spécifiques (score +1)
  const specificWords = ['vue.js', 'react', 'typescript', 'node.js', 'docker', 'git', 'internship', 'freelance'];
  const specificCount = queryWords.filter(w => 
    specificWords.some(specific => w.includes(specific) || specific.includes(w))
  ).length;
  score += specificCount * 1.5;
  
  return score;
}

// Fonction pour générer des requêtes de recherche intelligentes avec scoring
function generateSmartQueries(postType, content, geminiSuggestions = []) {
  const keywords = SMART_KEYWORDS[postType] || SMART_KEYWORDS.tech_debate;
  
  // Analyser le contenu pour extraire des mots-clés spécifiques
  const contentKeywords = extractContentKeywords(content);
  
  console.log(`   📝 Mots-clés extraits du contenu: ${contentKeywords.join(', ')}`);
  
  // Traduire les mots-clés français en anglais pour Unsplash
  const translateKeywords = (keywords) => {
    const translations = {
      'développement': 'development',
      'programmation': 'programming', 
      'code': 'coding',
      'application': 'app',
      'site web': 'website',
      'débat': 'debate',
      'projet': 'project',
      'équipe': 'team',
      'freelance': 'freelance',
      'stage': 'internship',
      'carrière': 'career',
      'client': 'client',
      'budget': 'budget',
      'temps': 'time',
      'apprentissage': 'learning',
      'formation': 'training',
      'entreprise': 'company',
      'industrie': 'industry',
      'innovation': 'innovation',
      'technologie': 'technology',
      'galère': 'struggle',
      'cool': 'cool',
      'challenge': 'challenge',
      'difficile': 'difficult',
      'facile': 'easy',
      'problème': 'problem',
      'solution': 'solution'
    };
    return keywords.map(k => translations[k] || k);
  };
  
  const translatedContentKeywords = translateKeywords(contentKeywords);
  const allQueries = [];
  
  // Si Gemini a fourni des suggestions, créer des requêtes avec scoring
  if (geminiSuggestions && geminiSuggestions.length > 0) {
    console.log(`   🤖 Suggestions Gemini: ${geminiSuggestions.join(', ')}`);
    
    // Filtrer les suggestions Gemini pour la sécurité
    const safeGeminiSuggestions = filterSafeKeywords(geminiSuggestions);
    console.log(`   ✅ Suggestions Gemini filtrées: ${safeGeminiSuggestions.join(', ')}`);
    
    // Générer plusieurs variantes de requêtes avec suggestions Gemini
    allQueries.push(
      // Variante 1 : Suggestions Gemini prioritaires + type
      [...safeGeminiSuggestions.slice(0, 3), ...keywords.primary.slice(0, 1)].join(' '),
      // Variante 2 : Type + suggestions Gemini
      [...keywords.primary.slice(0, 2), ...safeGeminiSuggestions.slice(0, 2)].join(' '),
      // Variante 3 : Suggestions Gemini uniquement (si pertinentes)
      safeGeminiSuggestions.slice(0, 3).join(' '),
      // Variante 4 : Suggestions Gemini + contenu extrait
      [...safeGeminiSuggestions.slice(0, 2), ...translatedContentKeywords.slice(0, 2)].join(' ')
    );
  }
  
  // Ajouter des requêtes basées sur le contenu extrait
  allQueries.push(
    // Variante 5 : Contenu extrait + type
    [...translatedContentKeywords.slice(0, 3), ...keywords.primary.slice(0, 1)].join(' '),
    // Variante 6 : Type + contenu extrait
    [...keywords.primary.slice(0, 2), ...translatedContentKeywords.slice(0, 1)].join(' '),
    // Variante 7 : Contenu uniquement (si suffisant)
    translatedContentKeywords.slice(0, 3).join(' ')
  );
  
  // Ajouter requête de fallback
  allQueries.push([...keywords.fallback].join(' '));
  
  // Scorer et trier les requêtes
  const scoredQueries = allQueries
    .filter(q => q.trim().length > 0) // Filtrer les requêtes vides
    .map(query => ({
      query: query,
      score: scoreQuery(query, content, geminiSuggestions)
    }))
    .sort((a, b) => b.score - a.score) // Trier par score décroissant
    .map(item => item.query)
    .slice(0, 5); // Garder les 5 meilleures requêtes
  
  console.log(`   🔍 Requêtes générées (${scoredQueries.length}) avec scoring: ${scoredQueries.map(q => `"${q.substring(0, 40)}..."`).join(', ')}`);
  
  return scoredQueries;
}

// Fonction de recherche Unsplash
async function searchUnsplash(query) {
  if (!IMAGE_CONFIG.unsplash.enabled || IMAGE_CONFIG.unsplash.accessKey === 'YOUR_UNSPLASH_ACCESS_KEY') {
    console.log('⚠️ Unsplash désactivé ou clé API invalide');
    return null;
  }
  
  try {
    // Paramètres de sécurité pour LinkedIn professionnel
    const safeQuery = filterSafeKeywords(query.split(' ')).join(' ');
    console.log(`   🔒 Requête sécurisée: "${safeQuery}"`);
    
    const url = `${IMAGE_CONFIG.unsplash.baseUrl}?query=${encodeURIComponent(safeQuery)}&per_page=3&orientation=${IMAGE_CONFIG.unsplash.contentFilter.orientation}&order_by=relevant&content_filter=${IMAGE_CONFIG.unsplash.contentFilter.content_filter}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${IMAGE_CONFIG.unsplash.accessKey}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return {
          source: 'unsplash',
          query: query,
          images: data.results.map(img => ({
            url: img.urls.regular,
            thumb: img.urls.thumb,
            description: img.description || img.alt_description || 'Image professionnelle',
            author: img.user.name,
            authorUrl: img.user.links.html,
            downloadUrl: img.links.download_location
          }))
        };
      }
    } else if (response.status === 403) {
      console.log('⚠️ Rate limit Unsplash atteint');
    } else {
      console.log(`⚠️ Unsplash erreur ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Unsplash error:', error.message);
  }
  
  return null;
}

// Fonction pour créer un hash d'image simple
function generateImageHash(imageUrl) {
  // Extraire l'ID de l'image Unsplash depuis l'URL
  const match = imageUrl.match(/photo-([a-zA-Z0-9_-]+)/);
  return match ? match[1] : imageUrl.substring(0, 50);
}

// Fonction pour valider la pertinence d'une image avec le contenu
function validateImageRelevance(imageDescription, content, query) {
  const imageDescLower = (imageDescription || '').toLowerCase();
  const contentLower = content.toLowerCase();
  const queryLower = query.toLowerCase();
  
  let relevanceScore = 0;
  
  // 1. Vérifier si la description de l'image correspond aux mots-clés de la requête
  const queryWords = queryLower.split(/\s+/).filter(w => w.length >= 3);
  const queryMatches = queryWords.filter(word => imageDescLower.includes(word)).length;
  relevanceScore += queryMatches * 2; // +2 par mot correspondant
  
  // 2. Vérifier si la description correspond aux mots-clés extraits du contenu
  const contentKeywords = extractContentKeywords(content);
  const contentMatches = contentKeywords.filter(keyword => 
    imageDescLower.includes(keyword.toLowerCase())
  ).length;
  relevanceScore += contentMatches * 1.5; // +1.5 par mot-clé contenu
  
  // 3. Vérifier les correspondances directes avec le contenu
  const directMatches = queryWords.filter(word => 
    contentLower.includes(word) && imageDescLower.includes(word)
  ).length;
  relevanceScore += directMatches * 1; // +1 par correspondance directe
  
  // 4. Pénaliser les images trop génériques
  const genericTerms = ['abstract', 'background', 'pattern', 'texture', 'color', 'design', 'art'];
  const genericCount = genericTerms.filter(term => imageDescLower.includes(term)).length;
  if (genericCount >= 2) {
    relevanceScore -= 2; // Trop générique
  }
  
  // Score minimum : 0
  return Math.max(0, relevanceScore);
}

// Fonction principale : rechercher une image pour un post (avec anti-répétition + suggestions Gemini + validation)
async function findImageForPost(postType, content, usedImages = [], geminiSuggestions = []) {
  console.log(`🎨 Recherche d'image pour type: ${postType}`);
  
  // Créer un Set des hashes d'images déjà utilisées
  const usedHashes = new Set(usedImages.map(img => img.image_hash).filter(Boolean));
  
  // Générer les requêtes intelligentes avec suggestions Gemini (déjà triées par score)
  const queries = generateSmartQueries(postType, content, geminiSuggestions);
  
  // Essayer chaque requête dans l'ordre (déjà optimisé par scoring)
  const candidateImages = [];
  
  for (const query of queries) {
    console.log(`   🔍 Essai: "${query.substring(0, 50)}..."`);
    const result = await searchUnsplash(query);
    
    if (result && result.images.length > 0) {
      console.log(`   ✅ ${result.images.length} image(s) trouvée(s)`);
      
      // Évaluer chaque image pour pertinence et disponibilité
      for (const image of result.images) {
        const imageHash = generateImageHash(image.url);
        const isUsed = usedHashes.has(imageHash);
        const relevanceScore = validateImageRelevance(image.description, content, query);
        
        candidateImages.push({
          image: image,
          imageHash: imageHash,
          query: query,
          relevanceScore: relevanceScore,
          isUsed: isUsed,
          priority: isUsed ? 0 : relevanceScore // Priorité 0 si utilisée
        });
      }
    }
  }
  
  // Trier les candidats : d'abord non utilisées avec meilleur score de pertinence
  candidateImages.sort((a, b) => {
    // Priorité 1 : Non utilisées
    if (a.isUsed !== b.isUsed) {
      return a.isUsed ? 1 : -1;
    }
    // Priorité 2 : Score de pertinence
    return b.relevanceScore - a.relevanceScore;
  });
  
  // Chercher la meilleure image non utilisée
  const bestUnused = candidateImages.find(c => !c.isUsed && c.relevanceScore >= 1);
  
  if (bestUnused) {
    console.log(`   ✅ Image non utilisée trouvée avec score de pertinence: ${bestUnused.relevanceScore.toFixed(1)}`);
    return {
      success: true,
      query: bestUnused.query,
      images: [bestUnused.image],
      selectedImage: bestUnused.image,
      imageHash: bestUnused.imageHash,
      source: 'unsplash',
      relevanceScore: bestUnused.relevanceScore,
      geminiSuggestions: geminiSuggestions
    };
  }
  
  // Si aucune image non utilisée avec score >= 1, prendre la meilleure non utilisée
  const bestUnusedAny = candidateImages.find(c => !c.isUsed);
  
  if (bestUnusedAny) {
    console.log(`   ⚠️ Image non utilisée trouvée mais pertinence faible (score: ${bestUnusedAny.relevanceScore.toFixed(1)})`);
    return {
      success: true,
      query: bestUnusedAny.query,
      images: [bestUnusedAny.image],
      selectedImage: bestUnusedAny.image,
      imageHash: bestUnusedAny.imageHash,
      source: 'unsplash',
      relevanceScore: bestUnusedAny.relevanceScore,
      warning: 'Pertinence faible mais image non utilisée',
      geminiSuggestions: geminiSuggestions
    };
  }
  
  // Fallback : utiliser la meilleure image même si déjà utilisée (mais avec validation)
  if (candidateImages.length > 0) {
    const bestOverall = candidateImages[0];
    if (bestOverall.relevanceScore >= 2) {
      console.log(`   ⚠️ Fallback : Image avec bonne pertinence (score: ${bestOverall.relevanceScore.toFixed(1)}) mais potentiellement déjà utilisée`);
      return {
        success: true,
        query: bestOverall.query,
        images: [bestOverall.image],
        selectedImage: bestOverall.image,
        imageHash: bestOverall.imageHash,
        source: 'unsplash',
        relevanceScore: bestOverall.relevanceScore,
        warning: 'Image potentiellement déjà utilisée mais pertinente',
        geminiSuggestions: geminiSuggestions
      };
    }
  }
  
  // Dernier recours : rechercher une image générique avec la première requête
  console.log('   ⚠️ Aucune image pertinente trouvée, recherche générique...');
  if (queries.length > 0) {
    const result = await searchUnsplash(queries[0]);
    if (result && result.images.length > 0) {
      const image = result.images[0];
      return {
        success: true,
        query: queries[0],
        images: result.images,
        selectedImage: image,
        imageHash: generateImageHash(image.url),
        source: 'unsplash',
        relevanceScore: 0,
        warning: 'Image générique (fallback)',
        geminiSuggestions: geminiSuggestions
      };
    }
  }
  
  return {
    success: false,
    query: queries[0] || 'programming',
    images: [],
    selectedImage: null,
    fallback: true,
    geminiSuggestions: geminiSuggestions
  };
}

// Fonction pour télécharger une image
async function triggerDownload(downloadUrl) {
  try {
    await fetch(downloadUrl, {
      headers: {
        'Authorization': `Client-ID ${IMAGE_CONFIG.unsplash.accessKey}`
      }
    });
    console.log('✅ Téléchargement Unsplash tracké');
  } catch (error) {
    console.log('⚠️ Erreur tracking téléchargement:', error.message);
  }
}

module.exports = {
  findImageForPost,
  generateSmartQueries,
  searchUnsplash,
  triggerDownload,
  extractContentKeywords,
  IMAGE_CONFIG,
  SMART_KEYWORDS
};

