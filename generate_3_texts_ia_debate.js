const { generateAuthenticPost } = require('./generate_authentic_varied_posts.js');

async function generate3TextPosts() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📝 Génération de 3 TEXTES DE POSTS : IA et Débats');
  console.log('═══════════════════════════════════════════════════════════\n');

  const posts = [];
  
  for (let i = 1; i <= 3; i++) {
    console.log(`\n📝 Génération du texte ${i}/3...\n`);
    
    const post = await generateAuthenticPost();
    
    if (post) {
      posts.push(post);
      
      console.log(`\n✅ TEXTE ${i}/3 :`);
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`Type : ${post.json.type}`);
      console.log(`\n📄 CONTENU COMPLET :`);
      console.log('───────────────────────────────────────────────────────────');
      console.log(post.json.content);
      console.log('───────────────────────────────────────────────────────────');
      console.log(`\n📊 Stats :`);
      console.log(`   - Longueur : ${post.json.content.length} caractères`);
      console.log(`   - Mots : ${post.json.content.split(/\s+/).length}`);
      console.log(`   - Emojis : ${(post.json.content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length}`);
      const hashtagsStr = typeof post.json.hashtags === 'string' ? post.json.hashtags : 
                         (Array.isArray(post.json.hashtags) ? post.json.hashtags.join(' ') : 'N/A');
      console.log(`   - Hashtags : ${hashtagsStr}`);
      
      if (i < 3) {
        console.log('\n⏳ Attente de 3 secondes...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } else {
      console.log(`❌ Échec de génération du texte ${i}`);
    }
  }

  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('📋 RÉSUMÉ DES 3 TEXTES');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  posts.forEach((post, index) => {
    console.log(`\n${index + 1}. ${post.json.type.toUpperCase()}`);
    console.log(`   Longueur : ${post.json.content.length} caractères`);
    console.log(`   Mots : ${post.json.content.split(/\s+/).length}`);
    console.log(`   ───────────────────────────────────────────────────`);
    console.log(post.json.content);
    console.log(`   ───────────────────────────────────────────────────`);
  });
  
  console.log('\n✅ Génération terminée !\n');
}

generate3TextPosts().catch(console.error);

