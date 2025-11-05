const { generateAuthenticPost, getTrendingTopics, generatePostContent, selectBestTopic } = require('./generate_authentic_varied_posts.js');

async function generateIADebatePosts() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🤖 Génération de 3 posts : IA et Débats Techniques');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Force la recherche de sujets IA et débats
  console.log('📡 Recherche de sujets IA et débats techniques...\n');
  
  const topics = await getTrendingTopics();
  
  // Filtrer pour privilégier les sujets IA et débats
  const iaDebateTopics = topics.filter(topic => {
    const subject = (topic.subject || '').toLowerCase();
    const angle = (topic.angle || '').toLowerCase();
    const combined = subject + ' ' + angle;
    
    return combined.includes('ia') || 
           combined.includes('intelligence artificielle') ||
           combined.includes('chatgpt') ||
           combined.includes('gemini') ||
           combined.includes('copilot') ||
           combined.includes('débat') ||
           combined.includes('ancien') ||
           combined.includes('nouveau') ||
           combined.includes('vs') ||
           combined.includes('comparaison') ||
           combined.includes('méthode');
  });
  
  // Si pas assez, prendre les meilleurs topics quand même
  const selectedTopics = iaDebateTopics.length >= 3 
    ? iaDebateTopics.slice(0, 3) 
    : [...iaDebateTopics, ...topics.slice(0, 3 - iaDebateTopics.length)];
  
  console.log(`✅ ${selectedTopics.length} sujets sélectionnés pour génération\n`);
  
  const posts = [];
  
  for (let i = 0; i < 3 && i < selectedTopics.length; i++) {
    const topic = selectedTopics[i];
    console.log(`\n📝 Génération du post ${i+1}/3...`);
    console.log(`   Sujet : ${topic.subject}\n`);
    
    try {
      // Générer le contenu avec le format approprié
      let structureType = 'ai_news';
      if (topic.subject.toLowerCase().includes('débat') || 
          topic.subject.toLowerCase().includes('vs') ||
          topic.subject.toLowerCase().includes('ancien') ||
          topic.subject.toLowerCase().includes('nouveau')) {
        structureType = 'tech_debate';
      }
      
      const post = await generateAuthenticPost();
      
      if (post) {
        posts.push(post);
        
        console.log(`\n✅ POST ${i+1}/3 GÉNÉRÉ :`);
        console.log('═══════════════════════════════════════════════════════════');
        console.log(`Type : ${post.json.type}`);
        console.log(`Sujet : ${post.json.topic.subject || post.json.topic}`);
        console.log(`Longueur : ${post.json.content.length} caractères (${post.json.content.split(/\s+/).length} mots)`);
        console.log(`Emojis : ${(post.json.content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length}`);
        console.log(`\n📄 CONTENU DU POST :`);
        console.log('───────────────────────────────────────────────────────────');
        console.log(post.json.content);
        console.log('───────────────────────────────────────────────────────────');
        const hashtagsStr = Array.isArray(post.json.hashtags) 
          ? post.json.hashtags.join(', ') 
          : (post.json.hashtags || 'N/A');
        console.log(`\n📊 HASHTAGS : ${hashtagsStr}`);
      } else {
        console.log(`❌ Échec de génération du post ${i+1}`);
      }
      
      if (i < 2) {
        console.log('\n⏳ Attente de 3 secondes avant le prochain post...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la génération du post ${i+1}:`, error.message);
    }
  }

  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('📊 RÉSUMÉ DES 3 POSTS GÉNÉRÉS');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  posts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.json.type.toUpperCase()}`);
    console.log(`   Sujet : ${post.json.topic.subject || post.json.topic}`);
    console.log(`   Longueur : ${post.json.content.length} caractères`);
    const hashtagsStr = Array.isArray(post.json.hashtags) 
      ? post.json.hashtags.join(', ') 
      : (post.json.hashtags || 'N/A');
    console.log(`   Hashtags : ${hashtagsStr}`);
    console.log('');
  });
  
  console.log('✅ Génération terminée !\n');
}

generateIADebatePosts().catch(console.error);

