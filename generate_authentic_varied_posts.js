// 🎯 Générateur de Posts LinkedIn Authentiques - Dynamique & Actualisé
// Basé sur le vrai parcours : 3 ans freelance, 50+ projets, étudiant BUT Informatique
// ✨ Utilise Gemini pour générer du contenu basé sur les actualités de la semaine
// 🎨 Templates = styles/structures, PAS de sujets répétitifs hardcodés
// 💾 Base de données SQLite pour tracking long terme (5+ ans)

// --- Import de la base de données ---
const { getDatabase } = require('./database.js');

// --- Import du système d'images ---
const { findImageForPost } = require('./image_system.js');

// --- Configuration API Gemini 2.0 Flash ---
const GEMINI_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY,
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
  maxTokens: 2000,
  temperature: 0.9,
  timeout: 30000 // 30 secondes timeout pour les requêtes API
};

// --- Constantes pour hash et sélection ---
const HASH_CONFIG = {
  MIN_WORD_LENGTH: 3, // Mots de 3+ caractères (au lieu de 4 pour éviter collisions)
  MAX_WORDS: 5, // Maximum 5 mots dans le hash
  TOP_N_SELECTION: 3 // Sélectionner parmi les top N sujets
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
  name: "Zakaria Talali",
  age: 18, // Né le 11/01/2007
  role: "Développeur Freelance & Étudiant BUT Informatique (2ème année)",
  experience: "Freelance depuis septembre 2022, 50+ projets livrés (sites vitrines, e-commerce, mini-SaaS)",
  location: "Belfort, Nord Franche-Comté, France (90000)",
  education: "BUT Informatique - IUT Nord Franche-Comté (2024-2027), Spécialisation Développement web et applications",
  skills: {
    languages: ["JavaScript", "Python", "Java", "TypeScript", "SQL", "HTML/CSS", "Bash", "C"],
    frameworks: ["Vue.js", "Node.js", "Express", "JavaFX", "Bootstrap", "Tailwind CSS"],
    databases: ["MySQL", "MariaDB", "PostgreSQL", "SQLite"],
    tools: ["Git", "GitHub", "GitLab", "Docker", "VS Code", "PyCharm", "DataGrip", "Figma", "WordPress", "Shopify"],
    practices: ["MVC", "API RESTful", "Responsive design", "SEO", "Agile/Scrum", "Tests unitaires", "Debugging"]
  },
  currentProject: {
    type: "Projet de groupe BUT Informatique",
    description: "Application web full-stack (Vue.js, Express.js, TypeScript) - Plateforme événementielle avec système RPG et QR codes",
    teamSize: 5,
    period: "Octobre 2025 - Mars 2026 (en cours)",
    skills: ["Collaboration", "Organisation", "Adaptabilité"]
  },
  interests: [
    "Veille informatique quotidienne (Developpez.com, Stack Overflow, GitHub Trending, Dev.to)",
    "Chaînes YouTube (Grafikart, Underscore_)",
    "Meetups/conférences startups",
    "Développement web & projets perso (sites, SaaS)",
    "Clubs informatiques - travail en équipe",
    "Sports : futsal (club universitaire 2 ans), football, billard, musculation (4 ans)"
  ],
  languages: {
    "Français": "B2 (Test de Connaissance du Français obtenu)",
    "Arabe": "C2 (Langue maternelle)",
    "Anglais": "C1 (Très bon niveau)"
  },
  certifications: ["CodeCademy : JavaScript, C, JavaFX, Python"],
  softSkills: ["Travail en équipe", "Autonomie", "Adaptabilité face aux nouveaux environnements"],
  goals: [
    "Recherche stage 8-10 semaines entre le 7 avril et le 13 juin 2025",
    "Stage fin de S4 BUT Informatique",
    "Contribuer à des projets innovants en développement web",
    "Monter en compétences techniques et professionnelles"
  ],
  localCompanies: ["Alstom", "Peugeot Sochaux", "General Electric", "McPhy", "SNCF"],
  contact: {
    email: "zakaria.talali@edu.umlp.fr",
    website: "ztalali.com",
    linkedin: "zakaria-talali-0970a6376",
    github: "ztalali09"
  },
  style: "Professionnel mais authentique, humble mais confiant, passionné mais crédible. Équilibre entre étudiant engagé et professionnel compétent pour attirer les recruteurs IT"
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
  "Challenges techniques et solutions innovantes",
  "Actualités IA de la semaine (ChatGPT, Gemini, Copilot, nouveaux modèles, outils IA pour devs)",
  "Débats techniques : anciennes méthodes vs nouvelles méthodes (approches classiques vs modernes, paradigmes, outils)"
];

// --- Structures de posts optimisées pour étudiants LinkedIn (attirer les recruteurs) ---
// Répartition : Projets (35%), Apprentissage (30%), Veille (20%), Personnel (15%)
const POST_STRUCTURES = [
  // ========== POSTS DE PROJETS (35% - priorité haute) ==========
  {
    type: "project_completed",
    name: "Projet terminé avec stack technique",
    weight: 14, // 35% de 40 = 14
    format: `[Accroche forte - 3 lignes max] 🎯

[Contexte : projet académique ou personnel, durée]

Stack technique :
→ [Tech 1]
→ [Tech 2]
→ [Tech 3]

[Défis relevés - 3 points maximum] :
1. [Défi 1]
2. [Défi 2]
3. [Défi 3]

[Apprentissages/Résultat - ce que j'en retire]

[Lien GitHub/portfolio si pertinent]

[Question engagement]`,
    tone: "Professionnel mais authentique, humble mais confiant",
    hashtags: ["#DéveloppementWeb", "#ÉtudiantIT", "#Informatique"]
  },
  {
    type: "project_milestone",
    name: "Étape importante d'un projet",
    weight: 10,
    format: `[Accroche - étape franchie] 🚀

[Contexte du projet]

[Ce qui a été accompli] :
→ [Accomplissement 1]
→ [Accomplissement 2]
→ [Accomplissement 3]

[Challenge surmonté et comment]

[Prochaine étape]

[Question ouverte]`,
    tone: "Enthousiaste mais mesuré, montrant progression",
    hashtags: ["#Programmation", "#ÉtudiantIT", "#DevJunior"]
  },
  {
    type: "project_showcase",
    name: "Présentation visuelle d'un projet",
    weight: 11,
    format: `[Accroche avec résultat visuel] 💻

[Description courte du projet]

Technologies utilisées :
→ [Tech 1]
→ [Tech 2]

[Fonctionnalité clé ou résultat]

[Ce que j'ai appris]

[Invitation à voir le résultat]`,
    tone: "Fié mais humble, démonstratif de compétences",
    hashtags: ["#DéveloppementWeb", "#ApprentissageContinue", "#ÉtudiantIT"]
  },
  
  // ========== POSTS D'APPRENTISSAGE (30%) ==========
  {
    type: "learning_skill",
    name: "Nouvelle compétence acquise",
    weight: 12, // 30% de 40 = 12
    format: `[Accroche - pourquoi j'ai appris X] 💡

[Contexte : quand, pourquoi]

[3 points clés appris] :
→ [Point 1]
→ [Point 2]
→ [Point 3]

[Application concrète ou projet où utilisé]

[Conseil aux autres étudiants]

[Question sur l'expérience des autres]`,
    tone: "Curieux, pédagogue, montrant capacité d'apprentissage",
    hashtags: ["#ApprentissageContinue", "#Informatique", "#ÉtudiantIT"]
  },
  {
    type: "learning_concept",
    name: "Concept technique expliqué simplement",
    weight: 10,
    format: `[Accroche - concept découvert] 🧠

[Ce que c'est - explication simple]

[Pourquoi c'est important]

[3 exemples d'utilisation] :
→ [Exemple 1]
→ [Exemple 2]
→ [Exemple 3]

[Mon application perso]

[Question pour engagement]`,
    tone: "Pédagogique, clair, montrant compréhension approfondie",
    hashtags: ["#Programmation", "#ApprentissageContinue", "#DevJunior"]
  },
  {
    type: "learning_certification",
    name: "Certification obtenue",
    weight: 8,
    format: `[Accroche - certification obtenue] ✅

[Contexte : durée, difficulté]

[Compétences validées] :
→ [Compétence 1]
→ [Compétence 2]
→ [Compétence 3]

[Ce que ça m'apporte]

[Prochaine étape d'apprentissage]

[Encouragement aux autres]`,
    tone: "Fier mais humble, montrant progression continue",
    hashtags: ["#ApprentissageContinue", "#ÉtudiantIT", "#Formation"]
  },
  
  // ========== POSTS DE VEILLE TECHNOLOGIQUE (20%) ==========
  {
    type: "tech_news",
    name: "Actualité tech commentée",
    weight: 8, // 20% de 40 = 8
    format: `[Accroche - actualité récente] 📰

[Contexte : nouvelle techno/outil/événement]

[Pourquoi c'est important pour les devs] :
→ [Impact 1]
→ [Impact 2]

[Mon avis/analyse]

[Question ouverte au réseau]`,
    tone: "Curieux, informé, montrant veille active",
    hashtags: ["#Informatique", "#DéveloppementWeb", "#Tech"]
  },
  {
    type: "tech_event",
    name: "Participation à un événement tech",
    weight: 8,
    format: `[Accroche - événement participé] 🎪

[Contexte : hackathon, conférence, meetup]

[Ce que j'ai appris] :
→ [Apprentissage 1]
→ [Apprentissage 2]

[Rencontres/échanges intéressants]

[Prochaine participation]

[Question sur expériences similaires]`,
    tone: "Enthousiaste, engagé, montrant proactivité",
    hashtags: ["#ÉtudiantIT", "#ApprentissageContinue", "#Informatique"]
  },
  {
    type: "ai_news",
    name: "Actualité IA de la semaine",
    weight: 6,
    format: `[Accroche - actualité IA récente] 🤖

[Contexte : nouvelle IA/outil/modèle de la semaine]

[Impact pour les développeurs] :
→ [Impact 1]
→ [Impact 2]

[Mon utilisation/expérience personnelle]

[Comment ça change le métier]

[Question ouverte]`,
    tone: "Curieux, analytique, montrant veille IA active",
    hashtags: ["#IA", "#Tech", "#DéveloppementWeb"]
  },
  {
    type: "tech_debate",
    name: "Débat technique : anciennes vs nouvelles méthodes",
    weight: 6,
    format: `[Accroche - débat technique] ⚖️

Débat : [Question technique]

[Ancienne méthode/approche] :
→ [Avantage 1]
→ [Avantage 2]
❌ [Inconvénient 1]

[Nouvelle méthode/approche] :
→ [Avantage 1]
→ [Avantage 2]
❌ [Inconvénient 1]

[Mon expérience avec les deux]

[Conclusion personnelle]

[Question au réseau]`,
    tone: "Ouvert, analytique, montrant réflexion critique",
    hashtags: ["#Tech", "#WebDev", "#DevDebate"]
  },
  
  // ========== POSTS PERSONNELS/INSPIRANTS (15%) ==========
  {
    type: "personal_reflection",
    name: "Réflexion sur le parcours",
    weight: 6, // 15% de 40 = 6
    format: `[Accroche - moment de réflexion] 🤔

[Contexte : durée du parcours, étape]

[Ce que personne ne m'avait dit] :
→ [Réalité 1]
→ [Réalité 2]
→ [Réalité 3]

[Leçons apprises]

[Message aux futurs étudiants ou pairs]

[Question engageante]`,
    tone: "Authentique, humble, inspirant mais crédible",
    hashtags: ["#DevJunior", "#ApprentissageContinue", "#Informatique"]
  },
  {
    type: "personal_challenge",
    name: "Défi surmonté",
    weight: 6,
    format: `[Accroche - défi rencontré] 💪

[Contexte : situation difficile]

[Ce qui m'a aidé] :
→ [Solution 1]
→ [Solution 2]
→ [Solution 3]

[Résultat obtenu]

[Leçon personnelle]

[Encouragement aux autres]`,
    tone: "Humble mais confiant, montrant résilience",
    hashtags: ["#ÉtudiantIT", "#DevJunior", "#ApprentissageContinue"]
  },
  {
    type: "internship_search",
    name: "Recherche de stage",
    weight: 15, // Priorité élevée pour recherche de stage (au lieu de 6)
    format: `[Accroche recherche] 🎯

Contexte : [Détails stage - durée, période]

Ce que je recherche :
✅ [Critère 1]
✅ [Critère 2]
✅ [Critère 3]

Ce que j'apporte :
💪 [Compétence 1]
💪 [Compétence 2]
💪 [Compétence 3]

[Flexibilité géographique/temporelle]

[Call-to-action professionnel]`,
    tone: "Professionnel mais authentique, confiant mais humble",
    hashtags: ["#StageRecherché", "#ÉtudiantIT", "#Recrutement"]
  }
];

// Fonction pour sélectionner une structure selon les poids (probabilités)
// Évite les formats récemment utilisés pour garantir la variété
async function selectWeightedStructure() {
  let db;
  let recentTypes = [];
  
  try {
    db = await getDatabase();
    // Récupérer les 10 derniers types de posts utilisés
    const recentPosts = await db.getRecentPosts(10);
    recentTypes = recentPosts.map(p => p.type).filter(t => t); // Filtrer les null
  } catch (error) {
    console.warn('⚠️ Impossible de lire l\'historique des formats, sélection aléatoire...');
  }
  
  // Calculer les poids en pénalisant les formats récemment utilisés
  const structuresWithAdjustedWeights = POST_STRUCTURES.map(structure => {
    let adjustedWeight = structure.weight || 10;
    
    // BONUS PRIORITAIRE : Recherche de stage (si activé dans CONFIG)
    if (CONFIG.STAGE_SEARCH_PRIORITY && structure.type === 'internship_search') {
      adjustedWeight = adjustedWeight * 1.5; // +50% pour posts de stage
    }
    
    // Si le format a été utilisé récemment, réduire son poids (sauf stage si prioritaire)
    const recentCount = recentTypes.filter(t => t === structure.type).length;
    if (recentCount > 0) {
      // Moins de pénalité pour stage si prioritaire
      const penalty = (CONFIG.STAGE_SEARCH_PRIORITY && structure.type === 'internship_search') 
        ? 0.15  // -15% seulement pour stage
        : 0.3;  // -30% pour les autres
      adjustedWeight = adjustedWeight * (1 - (recentCount * penalty));
      if (adjustedWeight < 1) adjustedWeight = 1; // Minimum 1
    }
    
    return { ...structure, adjustedWeight };
  });
  
  // Sélection selon les poids ajustés
  const totalWeight = structuresWithAdjustedWeights.reduce((sum, s) => sum + s.adjustedWeight, 0);
  let random = Math.random() * totalWeight;
  
  for (const structure of structuresWithAdjustedWeights) {
    random -= structure.adjustedWeight;
    if (random <= 0) {
      if (recentTypes.includes(structure.type)) {
        console.log(`⚠️ Format "${structure.name}" récemment utilisé, mais sélectionné pour variété`);
      }
      return structure;
    }
  }
  
  return POST_STRUCTURES[0]; // Fallback
}

// 🧠 MOTEUR DE RECOMMANDATION PRÉDICTIF
// Système de scoring LinkedIn pour chaque sujet

// Calculer la pertinence d'un sujet (0-1)
function calculateRelevance(topic, structure) {
  let relevance = 0;
  
  // Priorité du sujet (5 = 1.0, 4 = 0.8, 3 = 0.6, 2 = 0.4, 1 = 0.2)
  const priorityScore = topic.priority ? (topic.priority / 5) : 0.6;
  relevance += priorityScore * 0.35;
  
  // BONUS PRIORITAIRE : Recherche de stage (si activé dans CONFIG)
  if (CONFIG.STAGE_SEARCH_PRIORITY) {
    const topicLower = topic.subject.toLowerCase();
    const angleLower = topic.angle?.toLowerCase() || '';
    const relevanceLower = topic.relevance?.toLowerCase() || '';
    const combinedText = (topicLower + ' ' + angleLower + ' ' + relevanceLower).toLowerCase();
    
    // Mots-clés liés au stage
    const stageKeywords = [
      'stage', 'stages', 'stagiaire', 'recherche de stage', 'recherche stage',
      'candidature', 'recrutement', 'opportunité', 'offre de stage',
      'stage développement', 'stage informatique', 'stage dev', 'stage web'
    ];
    const hasStageKeywords = stageKeywords.some(keyword => 
      combinedText.includes(keyword.toLowerCase())
    );
    
    // BONUS MASSIF pour sujets de stage (priorité actuelle)
    if (hasStageKeywords || structure.type === 'internship_search') {
      relevance += 0.25; // Bonus de 25% pour stage
    }
  }
  
  // Liens avec le profil utilisateur
  const topicLower = topic.subject.toLowerCase();
  const angleLower = topic.angle?.toLowerCase() || '';
  const combinedText = (topicLower + ' ' + angleLower).toLowerCase();
  
  // Compétences techniques mentionnées
  const techKeywords = [
    'vue.js', 'vue', 'node.js', 'node', 'typescript', 'express', 
    'postgresql', 'javascript', 'python', 'java', 'react'
  ];
  const matchingTech = techKeywords.filter(tech => 
    combinedText.includes(tech.toLowerCase())
  ).length;
  relevance += Math.min(matchingTech / 3, 1) * 0.25; // Max 3 techs = 1.0
  
  // Mots-clés liés au profil (étudiant, projet, freelance, but) - stage exclu car déjà traité
  const profileKeywords = [
    'étudiant', 'projet', 'freelance', 'but', 'informatique',
    'apprentissage', 'développeur', 'web', 'fullstack'
  ];
  const matchingProfile = profileKeywords.filter(keyword =>
    combinedText.includes(keyword.toLowerCase())
  ).length;
  relevance += Math.min(matchingProfile / 4, 1) * 0.15; // Max 4 keywords = 1.0
  
  return Math.min(relevance, 1.0); // Normaliser entre 0 et 1
}

// Estimer l'engagement potentiel (0-1)
async function estimateEngagement(topic, structure) {
  let engagement = 0.5; // Base = 50%
  
  try {
    const db = await getDatabase();
    
    // Analyser les posts similaires passés (si disponibles)
    const recentPosts = await db.getRecentPosts(20);
    
    if (recentPosts.length > 0) {
      // Analyser les types de posts qui ont performé (simulation)
      // Dans un vrai système, on aurait des métriques d'engagement réelles
      const typePerformance = {
        'project_completed': 0.8,
        'project_milestone': 0.75,
        'project_showcase': 0.85,
        'learning_skill': 0.7,
        'learning_concept': 0.65,
        'learning_certification': 0.75,
        'tech_news': 0.6,
        'tech_event': 0.7,
        'ai_news': 0.75, // Actualités IA = très engageant (tendance actuelle)
        'tech_debate': 0.8, // Débats techniques = très engageant (génère discussions)
        'personal_reflection': 0.8,
        'personal_challenge': 0.75,
        'internship_search': 0.9 // Recherche stage = très engageant
      };
      
      engagement = typePerformance[structure.type] || 0.6;
      
      // Bonus si le sujet contient des mots engageants
      const topicLower = topic.subject.toLowerCase();
      const engagingWords = [
        'appris', 'découvert', 'terminé', 'réussi', 'challenge', 'défi',
        'leçon', 'conseil', 'astuce', 'erreur', 'succès', 'milestone'
      ];
      const hasEngagingWords = engagingWords.some(word => 
        topicLower.includes(word)
      );
      if (hasEngagingWords) engagement += 0.1;
      
      // Bonus si le format est visuel (project_showcase)
      if (structure.type === 'project_showcase') engagement += 0.05;
    }
  } catch (error) {
    console.warn('⚠️ Impossible d\'estimer l\'engagement, utilisation de la valeur par défaut');
  }
  
  return Math.min(engagement, 1.0);
}

// Calculer l'actualité du sujet (0-1)
function calculateRecency(topic) {
  let recency = 0.7; // Base = 70% (sujets générés par Gemini sont récents)
  
  // Mots-clés indiquant l'actualité
  const topicLower = topic.subject.toLowerCase();
  const recencyKeywords = [
    'nouveau', 'nouvelle', 'récent', 'dernier', 'actuel', 'maintenant',
    '2025', 'cette semaine', 'aujourd\'hui', 'actualité', 'tendance'
  ];
  
  const hasRecencyWords = recencyKeywords.some(keyword =>
    topicLower.includes(keyword.toLowerCase())
  );
  
  if (hasRecencyWords) recency = 0.9;
  
  // Si le sujet est lié à une actualité récente (mentionné dans relevance)
  if (topic.relevance && (
    topic.relevance.toLowerCase().includes('semaine') ||
    topic.relevance.toLowerCase().includes('récent') ||
    topic.relevance.toLowerCase().includes('actualité')
  )) {
    recency = 0.95;
  }
  
  return recency;
}

// Calculer la diversité (0-1) - plus diversifié = plus haut
async function calculateDiversity(topic, structure) {
  let diversity = 0.8; // Base = 80%
  
  try {
    const db = await getDatabase();
    const recentPosts = await db.getRecentPosts(10);
    
    if (recentPosts.length > 0) {
      // Vérifier si le type de format a été utilisé récemment
      const recentTypes = recentPosts.map(p => p.type).filter(t => t);
      const typeCount = recentTypes.filter(t => t === structure.type).length;
      
      // Plus le type est utilisé récemment, moins il est diversifié
      diversity = Math.max(1.0 - (typeCount * 0.2), 0.3);
      
      // Vérifier la similarité du sujet
      const topicLower = topic.subject.toLowerCase();
      const similarCount = recentPosts.filter(post => {
        const postTopic = (post.topic || '').toLowerCase();
        const topicWords = topicLower.split(/\s+/).filter(w => w.length > 4);
        const postWords = postTopic.split(/\s+/).filter(w => w.length > 4);
        const commonWords = topicWords.filter(w => postWords.includes(w));
        return commonWords.length >= 2;
      }).length;
      
      if (similarCount > 0) {
        diversity = Math.max(diversity - (similarCount * 0.15), 0.2);
      }
    }
  } catch (error) {
    console.warn('⚠️ Impossible de calculer la diversité');
  }
  
  return diversity;
}

// Calculer le LinkedIn Score complet d'un sujet
// Formule : Score = (Pertinence × 0.35) + (Engagement × 0.30) + (Actualité × 0.20) + (Diversité × 0.15)
async function calculateLinkedInScore(topic, structure) {
  const relevance = calculateRelevance(topic, structure);
  const engagement = await estimateEngagement(topic, structure);
  const recency = calculateRecency(topic);
  const diversity = await calculateDiversity(topic, structure);
  
  const linkedInScore = (
    relevance * 0.35 +
    engagement * 0.30 +
    recency * 0.20 +
    diversity * 0.15
  );
  
  return {
    score: linkedInScore,
    breakdown: {
      relevance: relevance,
      engagement: engagement,
      recency: recency,
      diversity: diversity
    }
  };
}

// Fonction helper pour trouver la meilleure structure pour un topic
function findBestStructureForTopic(topic) {
  const relevantStructures = POST_STRUCTURES.filter(s => {
    // Associer les types de structures aux types de sujets
    const topicLower = topic.subject.toLowerCase();
    if (topicLower.includes('projet') || topicLower.includes('terminé')) {
      return ['project_completed', 'project_milestone', 'project_showcase'].includes(s.type);
    }
    if (topicLower.includes('apprend') || topicLower.includes('découvert')) {
      return ['learning_skill', 'learning_concept', 'learning_certification'].includes(s.type);
    }
    if (topicLower.includes('actualité') || topicLower.includes('tech')) {
      return ['tech_news', 'tech_event', 'ai_news'].includes(s.type);
    }
    // Détection IA et débats
    if (topicLower.includes('ia') || topicLower.includes('intelligence artificielle') || 
        topicLower.includes('chatgpt') || topicLower.includes('gemini') || 
        topicLower.includes('copilot') || topicLower.includes('ai')) {
      return ['ai_news', 'tech_debate'].includes(s.type);
    }
    if (topicLower.includes('débat') || topicLower.includes('ancien') || 
        topicLower.includes('nouveau') || topicLower.includes('vs ') || 
        topicLower.includes('comparaison') || topicLower.includes('méthode')) {
      return ['tech_debate'].includes(s.type);
    }
    // Priorité pour stage (si activé)
    if (CONFIG.STAGE_SEARCH_PRIORITY && (
      topicLower.includes('stage') || 
      topicLower.includes('recherche') || 
      topicLower.includes('stagiaire') ||
      topicLower.includes('candidature') ||
      topicLower.includes('recrutement') ||
      topic.relevance?.toLowerCase().includes('stage')
    )) {
      return ['internship_search'].includes(s.type);
    }
    return true; // Sinon, toutes les structures sont possibles
  });
  
  // Utiliser la première structure pertinente ou une aléatoire
  return relevantStructures.length > 0 
    ? relevantStructures[0] 
    : POST_STRUCTURES[Math.floor(Math.random() * POST_STRUCTURES.length)];
}

// Fonction pour sélectionner le meilleur sujet avec LinkedIn Score
// Retourne { topic, structure, linkedInScore, breakdown } ou null
async function selectBestTopic(topics) {
  if (!topics || topics.length === 0) return null;
  
  // Pour chaque sujet, on doit sélectionner une structure potentielle
  // On va calculer le score pour chaque combinaison sujet/structure
  const scoredTopics = [];
  
  // Si un seul topic, on calcule quand même son score avec une structure appropriée
  if (topics.length === 1) {
    const topic = topics[0];
    const structure = findBestStructureForTopic(topic);
    const scoreData = await calculateLinkedInScore(topic, structure);
    return {
      topic,
      structure,
      linkedInScore: scoreData.score,
      breakdown: scoreData.breakdown
    };
  }
  
  for (const topic of topics) {
    // Sélectionner la structure appropriée pour ce sujet
    const structure = findBestStructureForTopic(topic);
    
    // Calculer le LinkedIn Score
    const scoreData = await calculateLinkedInScore(topic, structure);
    
    scoredTopics.push({
      topic,
      structure,
      linkedInScore: scoreData.score,
      breakdown: scoreData.breakdown
    });
  }
  
  // Trier par LinkedIn Score décroissant
  scoredTopics.sort((a, b) => b.linkedInScore - a.linkedInScore);
  
  // Afficher les scores pour debug
  console.log('\n📊 LinkedIn Scores calculés :');
  scoredTopics.slice(0, HASH_CONFIG.TOP_N_SELECTION).forEach((item, index) => {
    console.log(`   ${index + 1}. Score: ${(item.linkedInScore * 100).toFixed(1)}% - "${item.topic.subject.substring(0, 50)}..."`);
    console.log(`      └─ Pertinence: ${(item.breakdown.relevance * 100).toFixed(0)}% | Engagement: ${(item.breakdown.engagement * 100).toFixed(0)}% | Actualité: ${(item.breakdown.recency * 100).toFixed(0)}% | Diversité: ${(item.breakdown.diversity * 100).toFixed(0)}%`);
  });
  
  // Sélectionner parmi les top N meilleurs pour maintenir la diversité
  const topN = scoredTopics.slice(0, HASH_CONFIG.TOP_N_SELECTION);
  const selected = topN[Math.floor(Math.random() * topN.length)];
  
  // Retourner l'objet complet avec topic, structure et score
  return {
    topic: selected.topic,
    structure: selected.structure,
    linkedInScore: selected.linkedInScore,
    breakdown: selected.breakdown
  };
}

// --- Configuration globale (optimisée pour étudiants LinkedIn) ---
const CONFIG = {
  MIN_POST_LENGTH: 750, // 150 mots minimum (environ 750 caractères)
  MAX_POST_LENGTH: 1300, // Limite optimale pour étudiants LinkedIn (150-250 mots)
  IDEAL_WORD_COUNT: 200, // Idéal : 150-250 mots
  MAX_EMOJIS: 5, // Maximum 4-5 emojis avec modération (guide LinkedIn étudiants)
  MAX_HASHTAGS: 5, // 3-5 hashtags maximum (guide LinkedIn étudiants)
  // Priorité recherche de stage (actuellement prioritaire)
  STAGE_SEARCH_PRIORITY: true, // Active la priorisation stage
  STAGE_SEARCH_FREQUENCY: 0.30, // 30% des posts seront liés au stage (mais pas exclusivement)
  // Limites pour les plateformes
  TELEGRAM_MAX_LENGTH: 4000, // Limite Telegram avec marge
  TELEGRAM_CAPTION_MAX_LENGTH: 1000, // Limite caption Telegram
  LINKEDIN_MAX_LENGTH: 1300 // Limite optimale étudiants LinkedIn (guide recommandé : 150-250 mots = 750-1300 caractères)
};

// Fonction pour générer un hash de sujet (améliorée pour éviter collisions)
function generateTopicHash(topic) {
  if (!topic || typeof topic !== 'string') {
    return 'invalid_topic_' + Date.now();
  }
  
  return topic.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length >= HASH_CONFIG.MIN_WORD_LENGTH) // Mots de 3+ caractères (inclut "IA", "Dev", etc.)
    .sort()
    .slice(0, HASH_CONFIG.MAX_WORDS)
    .join('_');
}

// --- Fonctions API Gemini avec retry intelligent et timeout ---
async function callGeminiAPI(prompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Créer un AbortController pour gérer le timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), GEMINI_CONFIG.timeout);
      
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
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

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
      // Gérer timeout et autres erreurs
      if (error.name === 'AbortError') {
        console.warn(`⏱️ Timeout API Gemini (${GEMINI_CONFIG.timeout}ms) tentative ${attempt}/${retries}`);
      } else if (attempt === retries) {
        console.error('❌ Erreur API Gemini après tous les retries:', error.message);
        return null;
      } else {
        console.log(`⚠️ Erreur tentative ${attempt}/${retries}, retry...`);
      }
      
      // Attendre avant retry (backoff exponentiel)
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
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

  const prompt = `Tu es un assistant expert qui aide ${USER_PROFILE.name} à créer du contenu LinkedIn optimisé pour attirer les recruteurs IT.

═══════════════════════════════════════════════════════════════
PROFIL DÉTAILLÉ :
═══════════════════════════════════════════════════════════════
Nom : ${USER_PROFILE.name}
Âge : ${USER_PROFILE.age} ans
Rôle : ${USER_PROFILE.role}
Formation : ${USER_PROFILE.education}
Expérience : ${USER_PROFILE.experience}
Localisation : ${USER_PROFILE.location}

COMPÉTENCES TECHNIQUES :
Langages : ${USER_PROFILE.skills.languages.join(', ')}
Frameworks : ${USER_PROFILE.skills.frameworks.join(', ')}
Bases de données : ${USER_PROFILE.skills.databases.join(', ')}
Outils : ${USER_PROFILE.skills.tools.join(', ')}
Pratiques : ${USER_PROFILE.skills.practices.join(', ')}

PROJET ACTUEL :
${USER_PROFILE.currentProject.type} - ${USER_PROFILE.currentProject.description}
Équipe : ${USER_PROFILE.currentProject.teamSize} étudiants
Période : ${USER_PROFILE.currentProject.period}

CENTRES D'INTÉRÊT :
${USER_PROFILE.interests.map(i => `- ${i}`).join('\n')}

OBJECTIFS PRIORITAIRES :
${USER_PROFILE.goals.map((g, i) => `${i+1}. ${g}`).join('\n')}

ENTREPRISES LOCALES D'INTÉRÊT :
${USER_PROFILE.localCompanies.join(', ')}

═══════════════════════════════════════════════════════════════
DATE : ${today}
═══════════════════════════════════════════════════════════════

MISSION : Prioriser et générer 5 sujets d'actualité OPTIMISÉS selon :
1. PRIORITÉ ABSOLUE : Recherche de stage (7 avril - 13 juin 2025) - Objectif principal actuel
2. PRIORITÉ : Pertinence pour un étudiant BUT Informatique cherchant un stage
3. ADAPTATION : Liens directs avec son profil (Vue.js, Node.js, freelance, projet de groupe)
4. DIVERSITÉ : Équilibre entre stage (30%), projets (25%), apprentissage (25%), veille (10%), personnel (10%)
5. ACTUALITÉ : Sujets d'aujourd'hui, pas des généralités

IMPORTANT : ${CONFIG.STAGE_SEARCH_PRIORITY ? 'La recherche de stage est PRIORITAIRE actuellement. Inclure 1-2 sujets liés au stage dans les 5 sujets proposés.' : 'Diversité normale'}

DOMAINES À EXPLORER (prioriser ceux liés au profil ET stage) :
${TOPIC_DOMAINS.map((d, i) => `${i+1}. ${d}`).join('\n')}

SOURCES D'INSPIRATION PRIORITAIRES (avec focus stage) :
- PRIORITÉ 1 : Recherche de stage (avril-juin 2025), opportunités de stage, candidature stage
- PRIORITÉ 2 : Actualités tech de cette semaine (Vue.js, Node.js, TypeScript, Express)
- PRIORITÉ 3 : Actualités IA de la semaine (ChatGPT, Gemini, Copilot, nouveaux outils IA pour développeurs, impact sur le métier)
- PRIORITÉ 4 : Débats techniques : anciennes vs nouvelles méthodes (approches classiques vs modernes, comparaisons de paradigmes)
- PRIORITÉ 5 : Projets étudiants et BUT Informatique (son projet actuel avec RPG et QR codes)
- PRIORITÉ 6 : Stages et recrutement dev junior, entreprises qui recrutent des stagiaires
- PRIORITÉ 7 : News des entreprises locales (${USER_PROFILE.localCompanies.join(', ')}) - opportunités de stage
- PRIORITÉ 8 : Freelancing et développement web (son expérience - montre compétences pour stage)
- PRIORITÉ 9 : Projets de groupe et travail en équipe (son projet actuel - montre capacité pour stage)
- PRIORITÉ 10 : Veille tech (Stack Overflow, GitHub Trending, Dev.to - ses sources)
- PRIORITÉ 11 : Événements tech et meetups (Belfort, Franche-Comté - networking pour stage)
${recentTopicsStr}

FORMAT DE RÉPONSE (exactement ce format, avec PRIORITÉ) :
1. SUJET: [Titre] | ANGLE: [Comment l'aborder] | PERTINENCE: [Pourquoi maintenant] | PRIORITÉ: [1-5, 5=très pertinent]
2. SUJET: [Titre] | ANGLE: [Comment l'aborder] | PERTINENCE: [Pourquoi maintenant] | PRIORITÉ: [1-5, 5=très pertinent]
3. SUJET: [Titre] | ANGLE: [Comment l'aborder] | PERTINENCE: [Pourquoi maintenant] | PRIORITÉ: [1-5, 5=très pertinent]
4. SUJET: [Titre] | ANGLE: [Comment l'aborder] | PERTINENCE: [Pourquoi maintenant] | PRIORITÉ: [1-5, 5=très pertinent]
5. SUJET: [Titre] | ANGLE: [Comment l'aborder] | PERTINENCE: [Pourquoi maintenant] | PRIORITÉ: [1-5, 5=très pertinent]

CRITÈRES DE PRIORISATION (avec focus recherche de stage) :
- PRIORITÉ 5 : Recherche de stage, opportunités de stage, candidature stage (PRIORITÉ ABSOLUE actuellement)
- PRIORITÉ 4 : Lié directement à son profil (Vue.js, Node.js, projet de groupe, BUT) + montre compétences pour stage
- PRIORITÉ 3 : Lié à ses compétences (TypeScript, Express, PostgreSQL, freelance) + montre valeur pour recruteurs
- PRIORITÉ 2 : Général mais pertinent pour étudiants dev (apprentissage, carrière) + peut montrer progression
- PRIORITÉ 1 : Veille tech générale (moins prioritaire, mais OK pour diversité)

CONTRAINTES STRICTES :
- Sujets actuels et d'actualité (pas des généralités intemporelles)
- Adaptés au profil d'un étudiant BUT Informatique 2ème année
- Variés (ne pas répéter 3x le même thème)
- Connectés à la réalité du moment
- Équilibre diversité : pas tous les sujets sur le même domaine
- Éviter absolument les sujets déjà traités ci-dessus
- Prioriser les sujets qui mettent en valeur ses compétences et expérience`;

  const response = await callGeminiAPI(prompt);
  if (!response) return null;

  // Parser la réponse avec priorisation
  const topics = [];
  const lines = response.split('\n').filter(line => line.match(/^\d+\./));
  
  for (const line of lines) {
    // Parser avec priorité
    const match = line.match(/SUJET:\s*(.+?)\s*\|\s*ANGLE:\s*(.+?)\s*\|\s*PERTINENCE:\s*(.+?)\s*\|\s*PRIORITÉ:\s*(\d+)/);
    if (match) {
      topics.push({
        subject: match[1].trim(),
        angle: match[2].trim(),
        relevance: match[3].trim(),
        priority: parseInt(match[4].trim()) || 3 // Priorité par défaut = 3
      });
    } else {
      // Fallback si format sans priorité
      const matchOld = line.match(/SUJET:\s*(.+?)\s*\|\s*ANGLE:\s*(.+?)\s*\|\s*PERTINENCE:\s*(.+)/);
      if (matchOld) {
        topics.push({
          subject: matchOld[1].trim(),
          angle: matchOld[2].trim(),
          relevance: matchOld[3].trim(),
          priority: 3 // Priorité par défaut
        });
      }
    }
  }
  
  // Trier par priorité décroissante (5 = meilleur)
  topics.sort((a, b) => b.priority - a.priority);
  
  return topics.length > 0 ? topics : null;
}

// ✅ Fonction : Valider que les suggestions d'images correspondent au contenu
function validateImageSuggestions(suggestions, postContent) {
  if (!suggestions || suggestions.length === 0) {
    return [];
  }
  
  const contentLower = postContent.toLowerCase();
  const validatedSuggestions = [];
  
  // Mots-clés importants du contenu pour validation
  const contentKeywords = extractKeywordsFromContent(postContent);
  
  // Score chaque suggestion selon sa pertinence
  for (const suggestion of suggestions) {
    const suggestionLower = suggestion.toLowerCase();
    let score = 0;
    
    // 1. Vérifier si la suggestion correspond à un mot-clé du contenu (score +2)
    const matchesContent = contentKeywords.some(keyword => 
      suggestionLower.includes(keyword.toLowerCase()) || 
      keyword.toLowerCase().includes(suggestionLower)
    );
    if (matchesContent) score += 2;
    
    // 2. Vérifier si la suggestion est mentionnée dans le contenu (score +1)
    if (contentLower.includes(suggestionLower)) {
      score += 1;
    }
    
    // 3. Vérifier si c'est un mot-clé technique connu (score +1)
    const techKeywords = [
      'vue', 'react', 'javascript', 'typescript', 'node', 'python', 'java',
      'git', 'docker', 'coding', 'programming', 'development', 'web', 'app',
      'internship', 'stage', 'career', 'project', 'team', 'learning'
    ];
    if (techKeywords.some(tech => suggestionLower.includes(tech))) {
      score += 1;
    }
    
    // 4. Pénaliser les suggestions trop génériques (score -1)
    const tooGeneric = ['image', 'photo', 'picture', 'photo', 'illustration', 'graphic'];
    if (tooGeneric.some(gen => suggestionLower.includes(gen))) {
      score -= 1;
    }
    
    // Accepter si score >= 1 (au moins une correspondance)
    if (score >= 1) {
      validatedSuggestions.push(suggestion);
    } else {
      console.log(`   ⚠️ Suggestion "${suggestion}" rejetée (score: ${score})`);
    }
  }
  
  // Si aucune suggestion validée, garder les 2-3 meilleures quand même (fallback)
  if (validatedSuggestions.length === 0 && suggestions.length > 0) {
    console.log('   ⚠️ Aucune suggestion validée, utilisation fallback des 2-3 premières');
    return suggestions.slice(0, 3);
  }
  
  return validatedSuggestions;
}

// Fonction helper : Extraire les mots-clés importants du contenu
function extractKeywordsFromContent(content) {
  const keywords = [];
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 4);
  
  // Mots-clés techniques
  const techTerms = [
    'vue.js', 'react', 'typescript', 'javascript', 'node.js', 'express',
    'python', 'java', 'git', 'docker', 'mongodb', 'postgresql', 'redis',
    'tailwind', 'bootstrap', 'html', 'css', 'aws', 'azure', 'firebase'
  ];
  
  techTerms.forEach(term => {
    if (content.toLowerCase().includes(term)) {
      keywords.push(term);
    }
  });
  
  // Mots-clés contextuels
  const contextTerms = [
    'développement', 'programmation', 'code', 'projet', 'équipe', 
    'stage', 'internship', 'carrière', 'apprentissage', 'formation',
    'freelance', 'client', 'entreprise', 'industrie', 'innovation'
  ];
  
  contextTerms.forEach(term => {
    if (content.toLowerCase().includes(term)) {
      keywords.push(term);
    }
  });
  
  // Ajouter les mots les plus fréquents (hors stop words)
  const stopWords = ['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'pour', 'avec', 'dans', 'sur', 'par', 'ce', 'cette', 'ces', 'qui', 'que', 'dont', 'où', 'quand', 'comment', 'pourquoi', 'est', 'sont', 'était', 'être', 'avoir', 'a', 'fait', 'faire', 'j\'ai', 'j\'ai', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles'];
  const wordFreq = {};
  words.forEach(word => {
    if (!stopWords.includes(word) && word.length >= 4) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  const topWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
  
  keywords.push(...topWords);
  
  return [...new Set(keywords)]; // Dédupliquer
}

// 🎨 Fonction : Générer le contenu complet du post avec Gemini + suggestions d'images
// Optimisé pour étudiants LinkedIn : attirer les recruteurs IT
async function generatePostContent(topic, structure) {
  const prompt = `Tu es un ghostwriter LinkedIn spécialisé pour étudiants en informatique cherchant à attirer les recruteurs IT.

═══════════════════════════════════════════════════════════════
PROFIL ÉTUDIANT DÉTAILLÉ :
═══════════════════════════════════════════════════════════════
Nom : ${USER_PROFILE.name}
Âge : ${USER_PROFILE.age} ans
Rôle : ${USER_PROFILE.role}
Formation : ${USER_PROFILE.education}
Expérience : ${USER_PROFILE.experience}
Localisation : ${USER_PROFILE.location}

Stack technique :
- Langages : ${USER_PROFILE.skills.languages.join(', ')}
- Frameworks : ${USER_PROFILE.skills.frameworks.join(', ')}
- Bases de données : ${USER_PROFILE.skills.databases.join(', ')}
- Outils : ${USER_PROFILE.skills.tools.slice(0, 8).join(', ')}...

Projet actuel : ${USER_PROFILE.currentProject.description}
Équipe : ${USER_PROFILE.currentProject.teamSize} étudiants

Objectifs prioritaires :
${USER_PROFILE.goals.map((g, i) => `${i+1}. ${g}`).join('\n')}

Style requises : ${USER_PROFILE.style}

═══════════════════════════════════════════════════════════════
SUJET DU POST :
═══════════════════════════════════════════════════════════════
${topic.subject}

ANGLE D'APPROCHE :
${topic.angle}

POURQUOI MAINTENANT :
${topic.relevance}

═══════════════════════════════════════════════════════════════
STRUCTURE OBLIGATOIRE À SUIVRE :
═══════════════════════════════════════════════════════════════
${structure.format}

TON REQUIS : ${structure.tone}

═══════════════════════════════════════════════════════════════
RÈGLES D'OR DE LA RÉDACTION LINKEDIN ÉTUDIANT (STRICTES) :
═══════════════════════════════════════════════════════════════

1. STRUCTURE COMPLÈTE (obligatoire) :
   → Accroche forte dans les 3 PREMIÈRES LIGNES (capture l'attention en 3 secondes)
   → Contexte (2-3 lignes) : situer le sujet
   → Développement : 3-5 points maximum avec sauts de ligne pour aération
   → Apprentissages/Résultat (2-3 lignes) : ce qui a été retenu/accompli
   → Appel à l'interaction : question ouverte à la fin

2. LES 3C (Clarté, Consistance, Concision) :
   → Clarté : phrases courtes et directes, vocabulaire technique à bon escient, ZÉRO faute d'orthographe
   → Consistance : chaque phrase apporte une info nouvelle, pas de répétitions, progression logique
   → Concision : 150-250 mots idéalement (750-1300 caractères), aller à l'essentiel

3. TON PROFESSIONNEL-AUTHENTIQUE :
   → Équilibre : professionnel MAIS authentique, humble MAIS confiant, passionné MAIS crédible
   → À privilégier : "J'apprends", "Je découvre", "J'explore", partager échecs ET succès
   → Montrer le processus de réflexion, tutoiement si naturel
   → À ÉVITER : se survendre, prétendre tout savoir, jargon incompréhensible, langage trop familier

4. MOTS-CLÉS STRATÉGIQUES (à intégrer naturellement) :
   → Compétences : ${[...USER_PROFILE.skills.languages, ...USER_PROFILE.skills.frameworks, ...USER_PROFILE.skills.databases].slice(0, 10).join(', ')}
   → Expressions valorisantes : "projet étudiant", "apprentissage", "stage recherché", "développement", "formation informatique"
   → Domaines : développement web, data science, cybersécurité, etc.

5. LONGUEUR ET FORMAT :
   → MINIMUM : 150 mots (750 caractères)
   → MAXIMUM : 1300 caractères (limite optimale étudiants LinkedIn)
   → IDÉAL : 200 mots (1000 caractères environ)
   → Utiliser des sauts de ligne pour aération
   → Emojis : maximum 4-5, avec modération, pour guider l'œil

6. DÉMONSTRATION DE COMPÉTENCES :
   → Preuves techniques concrètes (projets, stack utilisée)
   → Capacité d'apprentissage visible
   → Projets concrets réalisés
   → Soft skills : communication, travail d'équipe

7. ENGAGEMENT (pour l'algorithme LinkedIn) :
   → Question ouverte à la fin
   → Invitation au partage d'expériences
   → Inciter aux commentaires et interactions

═══════════════════════════════════════════════════════════════
EXEMPLES DE TONS EFFICACES (à imiter le style) :
═══════════════════════════════════════════════════════════════

Exemple 1 - Projet :
"🎯 Premier site web déployé en production !

Après 3 semaines de développement, mon projet de portfolio est enfin en ligne.

Stack technique :
→ Frontend : React + Tailwind CSS
→ Backend : Node.js + Express
→ Base de données : MongoDB

3 défis relevés :
1. Gestion de l'authentification sécurisée
2. Optimisation des performances (temps de chargement divisé par 3)
3. Design responsive sur tous les écrans

Ce que j'en retire : l'importance de tester régulièrement et de ne pas sous-estimer le temps de debug.

🔗 Lien et code sur GitHub en commentaire

#DéveloppementWeb #ÉtudiantIT"

Exemple 2 - Apprentissage :
"💡 Pourquoi j'ai commencé à apprendre Git dès la 2ème année

Au début, Git me semblait inutile pour mes petits projets étudiants.

Erreur.

Hier, j'ai perdu 4h de code sur un projet de groupe.
Heureusement, Git l'avait sauvegardé.

3 commandes qui m'ont sauvé :
→ git commit (sauvegardes régulières)
→ git branch (tester sans risque)
→ git revert (annuler une erreur)

Conseil aux autres étudiants : apprenez Git MAINTENANT.

Vous utilisez Git depuis combien de temps ?

#Informatique #Git #ÉtudiantDev"

═══════════════════════════════════════════════════════════════
CONTRAINTES ABSOLUES :
═══════════════════════════════════════════════════════════════
❌ Ne JAMAIS :
- Posts négatifs sur les cours ou l'école
- Critiquer d'anciennes expériences
- Se plaindre sans apporter de solution
- Partager du contenu non professionnel
- Mentir sur ses compétences
- Pavés illisibles sans structure
- Fautes d'orthographe
- Abus d'emojis (> 5)
- Langage trop familier ("cool", "galère" à éviter, trop familier pour recruteurs)
- Posts trop longs (> 1300 caractères)

✅ TOUJOURS :
- Rester positif et constructif
- Montrer son évolution
- Partager des ressources utiles
- Remercier professeurs/mentors si pertinent
- Être authentique mais professionnel
- Structurer avec espaces et points clés
- Preuve de compétence (projet, apprentissage, certificat)
- Ton authentique mais adapté aux recruteurs

═══════════════════════════════════════════════════════════════
HASHTAGS À UTILISER (3-5 maximum) :
═══════════════════════════════════════════════════════════════
${structure.hashtags.join(', ')}

═══════════════════════════════════════════════════════════════
FORMAT DE RÉPONSE EXACT :
═══════════════════════════════════════════════════════════════
POST: [ton contenu de post ici, 150-250 mots, structure complète avec accroche, contexte, développement, apprentissages, question]

IMAGE_SUGGESTIONS: [3-5 mots-clés en anglais pour chercher une image pertinente, séparés par des virgules]

GÉNÈRE MAINTENANT un post optimisé pour attirer les recruteurs IT :`;

  const response = await callGeminiAPI(prompt);
  if (!response) return null;

  // Parser la réponse pour extraire le post et les suggestions d'images
  // Patterns plus flexibles pour gérer les variations de format Gemini
  let postMatch = response.match(/POST:\s*(.+?)(?=IMAGE_SUGGESTIONS:|$)/s);
  
  // Fallback si format légèrement différent
  if (!postMatch) {
    postMatch = response.match(/POST[:\s]*(.+?)(?=IMAGE|$)/s);
  }
  
  // Dernier fallback : chercher juste le contenu principal
  if (!postMatch) {
    const lines = response.split('\n');
    const postStart = lines.findIndex(line => line.toLowerCase().includes('post') || line.trim().length > 50);
    if (postStart >= 0) {
      postMatch = { 1: lines.slice(postStart).join('\n').replace(/^(POST|POST:)/i, '').trim() };
    }
  }
  
  // Parsing robuste des suggestions d'images avec multiples patterns
  let imageSuggestions = [];
  
  // Pattern 1 : Format exact IMAGE_SUGGESTIONS:
  let imageMatch = response.match(/IMAGE_SUGGESTIONS?:\s*(.+?)(?:\n|$)/s);
  
  // Pattern 2 : Format alternatif "Suggestions d'images" ou "Image suggestions"
  if (!imageMatch) {
    imageMatch = response.match(/(?:Suggestions?\s+d'?images?|Image\s+suggestions?)[:\s]*(.+?)(?:\n|$)/is);
  }
  
  // Pattern 3 : Format simple IMAGE: ou IMAGE :
  if (!imageMatch) {
    imageMatch = response.match(/IMAGE[:\s]+(.+?)(?:\n|$)/s);
  }
  
  // Pattern 4 : Chercher dans les dernières lignes après le POST
  if (!imageMatch && postMatch) {
    const postEndIndex = response.indexOf(postMatch[1]) + postMatch[1].length;
    const remainingText = response.substring(postEndIndex);
    const lines = remainingText.split('\n').filter(l => l.trim().length > 0);
    
    // Chercher une ligne qui ressemble à des mots-clés séparés par virgules
    for (const line of lines) {
      const cleanLine = line.replace(/^(IMAGE|Suggestions?|Images?)[:\s]*/i, '').trim();
      if (cleanLine.includes(',') && cleanLine.split(',').length >= 2) {
        imageMatch = { 1: cleanLine };
        break;
      }
    }
  }
  
  // Extraire et nettoyer les suggestions
  if (imageMatch && imageMatch[1]) {
    imageSuggestions = imageMatch[1]
      .trim()
      .split(',')
      .map(s => s.trim())
      .filter(s => s && s.length > 0 && s.length < 50) // Filtrer les suggestions trop longues
      .slice(0, 5); // Maximum 5 suggestions
  }

  if (postMatch && postMatch[1]) {
    const postContent = postMatch[1].trim();
    
    // Validation : vérifier que le contenu n'est pas trop court
    if (postContent.length < 100) {
      console.warn('⚠️ Contenu généré par Gemini trop court, tentative de récupération...');
      // Essayer de récupérer plus de contenu
      const fullMatch = response.match(/(.+?)(IMAGE_SUGGESTIONS|$)/s);
      if (fullMatch && fullMatch[1].trim().length > postContent.length) {
        return {
          content: fullMatch[1].trim(),
          imageSuggestions: imageSuggestions
        };
      }
    }
    
    // Valider que les suggestions correspondent au contenu (nouvelle fonction)
    const validatedSuggestions = validateImageSuggestions(imageSuggestions, postContent);
    
    if (validatedSuggestions.length > 0) {
      console.log(`✅ ${validatedSuggestions.length} suggestion(s) d'image validée(s): ${validatedSuggestions.join(', ')}`);
    } else if (imageSuggestions.length > 0) {
      console.warn(`⚠️ Aucune suggestion d'image valide après validation (${imageSuggestions.length} suggérées initialement)`);
    }
    
    return {
      content: postContent,
      imageSuggestions: validatedSuggestions
    };
  }

  console.warn('⚠️ Impossible de parser la réponse Gemini, format inattendu');
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
      
      // 2. Filtrer les sujets déjà traités (vérification BDD) - OPTIMISÉ avec Promise.all
      const db = await getDatabase();
      
      // Générer tous les hashes en parallèle
      const topicChecks = topics.map(async (topic) => {
        const hash = generateTopicHash(topic.subject);
        const isTreated = await db.isTopicTreated(hash);
        return { topic, hash, isTreated };
      });
      
      const checkResults = await Promise.all(topicChecks);
      const freshTopics = checkResults
        .filter(result => !result.isTreated)
        .map(result => result.topic);
      
      if (freshTopics.length === 0) {
        console.warn('⚠️ Tous les sujets ont déjà été traités');
        continue;
      }
      
      // 3. Sélectionner un sujet avec LinkedIn Score (moteur de recommandation prédictif)
      // Score = (Pertinence × 0.35) + (Engagement × 0.30) + (Actualité × 0.20) + (Diversité × 0.15)
      const selectionResult = await selectBestTopic(freshTopics);
      
      // Vérification null pointer
      if (!selectionResult || !selectionResult.topic) {
        console.warn('⚠️ Aucun sujet valide sélectionné');
        continue;
      }
      
      const selectedTopic = selectionResult.topic;
      const structure = selectionResult.structure; // Utiliser la structure calculée
      const topicHash = generateTopicHash(selectedTopic.subject); // Générer hash une seule fois
      
      const scorePercent = selectionResult.linkedInScore 
        ? ` | LinkedIn Score: ${(selectionResult.linkedInScore * 100).toFixed(1)}%`
        : '';
      console.log(`🎯 Sujet sélectionné : ${selectedTopic.subject} (Priorité: ${selectedTopic.priority || 'N/A'}/5${scorePercent})`);
      console.log(`🎨 Structure : ${structure.name} (type: ${structure.type})`);
      
      // 4. Générer le contenu complet avec suggestions d'images
      console.log('✍️ Génération du contenu avec Gemini 2.0 Flash...');
      const contentResult = await generatePostContent(selectedTopic, structure);
      
      // Validation du contenu généré
      if (!contentResult || !contentResult.content) {
        console.warn('⚠️ Échec de génération du contenu');
        continue;
      }
      
      // Vérifier que le contenu n'est pas vide après nettoyage
      let finalContent = cleanPost(contentResult.content);
      if (!finalContent || finalContent.trim().length === 0) {
        console.warn('⚠️ Contenu généré vide après nettoyage');
        continue;
      }
      
      if (finalContent.trim().length < CONFIG.MIN_POST_LENGTH) {
        console.warn(`⚠️ Contenu trop court après nettoyage (${finalContent.trim().length} caractères)`);
        continue;
      }
      
      console.log('🤖 Suggestions d\'images Gemini:', contentResult.imageSuggestions.join(', '));
      
      // 7. Ajouter les hashtags
      const hashtags = structure.hashtags.join(' ');
      finalContent += '\n\n' + hashtags;
      
      // 8. Validation et ajustement de longueur (optimisé étudiants LinkedIn)
      const wordCount = finalContent.split(/\s+/).length;
      const charCount = finalContent.length;
      
      if (charCount < CONFIG.MIN_POST_LENGTH) {
        console.warn(`⚠️ Post trop court (${charCount} caractères, ${wordCount} mots). Minimum requis : ${CONFIG.MIN_POST_LENGTH} caractères`);
        continue;
      }
      
      // Valider la longueur pour LinkedIn (limite optimale étudiants : 1300 caractères)
      if (charCount > CONFIG.MAX_POST_LENGTH) {
        console.log(`⚠️ Post trop long (${charCount} caractères, ${wordCount} mots). Tronquage à ${CONFIG.MAX_POST_LENGTH} caractères...`);
        finalContent = validatePostLength(finalContent, 'linkedin');
      }
      
      console.log(`✅ Longueur validée : ${charCount} caractères (${wordCount} mots) - ${wordCount >= 150 && wordCount <= 250 ? '✅ Optimal' : '⚠️ Hors idéal (150-250 mots)'}`);
      
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
          if (imageData.relevanceScore !== undefined) {
            console.log(`   📊 Score de pertinence : ${imageData.relevanceScore.toFixed(1)}/10`);
          }
          if (imageData.warning) {
            console.log(`⚠️ ${imageData.warning}`);
          }
        } else {
          console.warn('⚠️ Aucune image trouvée pour ce post');
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
          imageSuggestions: contentResult.imageSuggestions || [], // Stocker les suggestions pour le bot Telegram
          image: imageData && imageData.success ? {
            url: imageData.selectedImage.url,
            thumb: imageData.selectedImage.thumb,
            description: imageData.selectedImage.description,
            author: imageData.selectedImage.author,
            authorUrl: imageData.selectedImage.authorUrl,
            source: 'unsplash',
            relevanceScore: imageData.relevanceScore // Ajouter le score de pertinence
          } : null
        }
      };
      
      // 11. Sauvegarder dans la base de données (avec image) - hash déjà généré plus haut
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
      imageSuggestions: [], // Pas de suggestions Gemini dans le fallback
      image: imageData && imageData.success ? {
        url: imageData.selectedImage.url,
        thumb: imageData.selectedImage.thumb,
        description: imageData.selectedImage.description,
        author: imageData.selectedImage.author,
        authorUrl: imageData.selectedImage.authorUrl,
        source: 'unsplash',
        relevanceScore: imageData.relevanceScore // Ajouter le score de pertinence si disponible
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

// Fonction pour afficher les sujets traités
async function showTreatedTopics(limit = 30) {
  try {
    const db = await getDatabase();
    const recentPosts = await db.getRecentPosts(limit);
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`📚 ${recentPosts.length} SUJETS TRAITÉS RÉCEMMENT`);
    console.log('═══════════════════════════════════════════════════════════');
    
    if (recentPosts.length === 0) {
      console.log('Aucun sujet traité pour le moment.');
      console.log('═══════════════════════════════════════════════════════════\n');
      return [];
    }
    
    recentPosts.forEach((post, index) => {
      const date = new Date(post.generated_at).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const typeName = POST_STRUCTURES.find(s => s.type === post.type)?.name || post.type;
      const fallbackBadge = post.is_fallback ? '⚠️ FALLBACK' : '✅';
      
      console.log(`\n${index + 1}. ${fallbackBadge} [${date}] ${typeName}`);
      console.log(`   📝 Sujet : ${post.topic}`);
      if (post.angle) {
        console.log(`   🎯 Angle : ${post.angle.substring(0, 80)}${post.angle.length > 80 ? '...' : ''}`);
      }
    });
    
    console.log('\n═══════════════════════════════════════════════════════════\n');
    return recentPosts;
  } catch (error) {
    console.error('❌ Erreur affichage sujets:', error);
    return null;
  }
}

// Fonction pour afficher les formats utilisés et leur répartition
async function showFormatDistribution(limit = 50) {
  try {
    const db = await getDatabase();
    const recentPosts = await db.getRecentPosts(limit);
    
    // Compter les occurrences de chaque format
    const formatCount = {};
    recentPosts.forEach(post => {
      const type = post.type || 'unknown';
      formatCount[type] = (formatCount[type] || 0) + 1;
    });
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`📊 RÉPARTITION DES FORMATS (${limit} derniers posts)`);
    console.log('═══════════════════════════════════════════════════════════');
    
    // Trier par fréquence décroissante
    const sortedFormats = Object.entries(formatCount)
      .map(([type, count]) => {
        const structure = POST_STRUCTURES.find(s => s.type === type);
        const name = structure ? structure.name : type;
        const percentage = ((count / recentPosts.length) * 100).toFixed(1);
        return { type, name, count, percentage };
      })
      .sort((a, b) => b.count - a.count);
    
    sortedFormats.forEach(({ name, count, percentage }) => {
      const bar = '█'.repeat(Math.round(percentage / 2));
      console.log(`${name.padEnd(40)} : ${count.toString().padStart(3)} (${percentage}%) ${bar}`);
    });
    
    console.log('\n📈 Objectif de répartition :');
    console.log('   - Projets : 35%');
    console.log('   - Apprentissage : 30%');
    console.log('   - Veille : 20%');
    console.log('   - Personnel : 15%');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    return sortedFormats;
  } catch (error) {
    console.error('❌ Erreur affichage distribution:', error);
    return null;
  }
}

// Fonction pour afficher les domaines de sujets explorés
function showTopicDomains() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🎯 DOMAINES DE SUJETS EXPLORÉS PAR LE SYSTÈME');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('\nLes sujets sont générés dynamiquement par Gemini basé sur :\n');
  
  TOPIC_DOMAINS.forEach((domain, index) => {
    console.log(`${index + 1}. ${domain}`);
  });
  
  console.log('\n📌 Sources d\'inspiration :');
  console.log(`   - Actualités tech de la semaine`);
  console.log(`   - News des entreprises locales : ${USER_PROFILE.localCompanies.join(', ')}`);
  console.log(`   - Tendances LinkedIn actuelles`);
  console.log(`   - Événements tech récents ou à venir`);
  console.log(`   - Problématiques actuelles du dev (recrutement, formations, salaires, etc.)`);
  console.log('\n💡 Le système génère 5 sujets d\'actualité différents à chaque génération');
  console.log('   et évite automatiquement les sujets déjà traités.');
  console.log('═══════════════════════════════════════════════════════════\n');
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
module.exports.showTreatedTopics = showTreatedTopics;
module.exports.showFormatDistribution = showFormatDistribution;
module.exports.showTopicDomains = showTopicDomains;
module.exports.calculateLinkedInScore = calculateLinkedInScore;
module.exports.selectBestTopic = selectBestTopic;
module.exports.findBestStructureForTopic = findBestStructureForTopic;
module.exports.generateTopicHash = generateTopicHash;
module.exports.callGeminiAPI = callGeminiAPI;
module.exports.getDatabase = getDatabase;
