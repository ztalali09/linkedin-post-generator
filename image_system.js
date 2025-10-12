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

// Fonction pour extraire des mots-clés du contenu
function extractContentKeywords(content) {
  const keywords = [];
  
  // Mots-clés techniques (français + anglais)
  const techKeywords = [
    'Vue.js', 'React', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 
    'Tailwind', 'CSS', 'HTML', 'Docker', 'Git', 'Python', 'PostgreSQL',
    'MongoDB', 'Redis', 'Kubernetes', 'AWS', 'Azure', 'Firebase',
    'développement', 'programmation', 'code', 'application', 'site web'
  ];
  
  techKeywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword.toLowerCase())) {
      keywords.push(keyword.toLowerCase());
    }
  });
  
  // Mots-clés de contexte (français)
  const contextKeywords = [
    'débat', 'comparaison', 'vs', 'projet', 'équipe', 'freelance', 
    'stage', 'carrière', 'Belfort', 'Alstom', 'Peugeot', 'SNCF',
    'client', 'budget', 'temps', 'apprentissage', 'formation',
    'entreprise', 'industrie', 'innovation', 'technologie'
  ];
  
  contextKeywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword.toLowerCase())) {
      keywords.push(keyword);
    }
  });
  
  // Mots-clés d'émotion/contexte
  const emotionKeywords = [
    'galère', 'cool', 'franchement', 'galère', 'challenge', 'difficile',
    'facile', 'rapide', 'lent', 'efficace', 'problème', 'solution'
  ];
  
  emotionKeywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword.toLowerCase())) {
      keywords.push(keyword);
    }
  });
  
  return keywords.slice(0, 5); // Maximum 5 mots-clés extraits
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

// Fonction pour générer des requêtes de recherche intelligentes
function generateSmartQueries(postType, content, geminiSuggestions = []) {
  const keywords = SMART_KEYWORDS[postType] || SMART_KEYWORDS.tech_debate;
  
  // Analyser le contenu pour extraire des mots-clés spécifiques
  const contentKeywords = extractContentKeywords(content);
  
  console.log(`   📝 Mots-clés extraits du contenu: ${contentKeywords.join(', ')}`);
  
  // Si Gemini a fourni des suggestions, les utiliser en priorité
  if (geminiSuggestions && geminiSuggestions.length > 0) {
    console.log(`   🤖 Suggestions Gemini: ${geminiSuggestions.join(', ')}`);
    
    // Filtrer les suggestions Gemini pour la sécurité
    const safeGeminiSuggestions = filterSafeKeywords(geminiSuggestions);
    console.log(`   ✅ Suggestions Gemini filtrées: ${safeGeminiSuggestions.join(', ')}`);
    
    const queries = [
      // Requête principale avec suggestions Gemini sécurisées
      [...safeGeminiSuggestions.slice(0, 3), ...keywords.primary.slice(0, 1)].join(' '),
      // Requête secondaire avec suggestions Gemini sécurisées
      [...keywords.primary.slice(0, 2), ...safeGeminiSuggestions.slice(0, 2)].join(' '),
      // Requête de fallback avec suggestions Gemini sécurisées
      [...safeGeminiSuggestions].join(' ')
    ];
    
    console.log(`   🔍 Requêtes avec suggestions Gemini: ${queries.map(q => `"${q}"`).join(', ')}`);
    return queries;
  }
  
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
  
  // Combiner les mots-clés avec limitation
  const queries = [
    // Requête principale (contenu + type)
    [...translatedContentKeywords.slice(0, 3), ...keywords.primary.slice(0, 1)].join(' '),
    // Requête secondaire (type + contenu)
    [...keywords.primary.slice(0, 2), ...translatedContentKeywords.slice(0, 1)].join(' '),
    // Requête de fallback (type uniquement)
    [...keywords.fallback].join(' ')
  ];
  
  console.log(`   🔍 Requêtes générées: ${queries.map(q => `"${q}"`).join(', ')}`);
  
  return queries;
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

// Fonction principale : rechercher une image pour un post (avec anti-répétition + suggestions Gemini)
async function findImageForPost(postType, content, usedImages = [], geminiSuggestions = []) {
  console.log(`🎨 Recherche d'image pour type: ${postType}`);
  
  // Créer un Set des hashes d'images déjà utilisées
  const usedHashes = new Set(usedImages.map(img => img.image_hash).filter(Boolean));
  
  // Générer les requêtes intelligentes avec suggestions Gemini
  const queries = generateSmartQueries(postType, content, geminiSuggestions);
  
  // Essayer chaque requête dans l'ordre
  for (const query of queries) {
    console.log(`   🔍 Essai: "${query.substring(0, 50)}..."`);
    const result = await searchUnsplash(query);
    
    if (result && result.images.length > 0) {
      console.log(`   ✅ ${result.images.length} image(s) trouvée(s)`);
      
      // Chercher une image non utilisée
      for (const image of result.images) {
        const imageHash = generateImageHash(image.url);
        
        if (!usedHashes.has(imageHash)) {
          console.log(`   ✅ Image non utilisée trouvée !`);
          return {
            success: true,
            query: query,
            images: result.images,
            selectedImage: image,
            imageHash: imageHash,
            source: 'unsplash',
            geminiSuggestions: geminiSuggestions
          };
        } else {
          console.log(`   ⏭️ Image déjà utilisée, next...`);
        }
      }
      
      // Si toutes les images de cette requête ont été utilisées, essayer la requête suivante
      console.log(`   ⚠️ Toutes les images de cette requête déjà utilisées`);
    }
  }
  
  // Fallback : retourner n'importe quelle image (mieux que rien)
  console.log('   ⚠️ Aucune image nouvelle trouvée, fallback à une image aléatoire');
  
  // Réessayer sans filtre
  for (const query of queries) {
    const result = await searchUnsplash(query);
    if (result && result.images.length > 0) {
      const image = result.images[0];
      return {
        success: true,
        query: query,
        images: result.images,
        selectedImage: image,
        imageHash: generateImageHash(image.url),
        source: 'unsplash',
        warning: 'Image potentiellement déjà utilisée',
        geminiSuggestions: geminiSuggestions
      };
    }
  }
  
  return {
    success: false,
    query: queries[0],
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

