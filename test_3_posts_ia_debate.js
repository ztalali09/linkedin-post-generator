const { generateAuthenticPost } = require('./generate_authentic_varied_posts.js');

async function generate3Posts() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🤖 Génération de 3 posts : IA et Débats Techniques');
  console.log('═══════════════════════════════════════════════════════════\n');

  const posts = [];
  
  for (let i = 1; i <= 3; i++) {
    console.log(`\n📝 Génération du post ${i}/3...\n`);
    
    const post = await generateAuthenticPost();
    
    if (post) {
      posts.push(post);
      
      console.log(`\n✅ POST ${i}/3 GÉNÉRÉ :`);
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`Type : ${post.json.type}`);
      console.log(`Sujet : ${post.json.topic.subject || post.json.topic}`);
      console.log(`Longueur : ${post.json.content.length} caractères (${post.json.content.split(/\s+/).length} mots)`);
      console.log(`Emojis : ${(post.json.content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length}`);
      console.log(`\n📄 CONTENU DU POST :`);
      console.log('───────────────────────────────────────────────────────────');
      console.log(post.json.content);
      console.log('───────────────────────────────────────────────────────────');
      
      if (i < 3) {
        console.log('\n⏳ Attente de 3 secondes avant le prochain post...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } else {
      console.log(`❌ Échec de génération du post ${i}`);
    }
  }

  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('📊 RÉSUMÉ DES 3 POSTS GÉNÉRÉS');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  posts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.json.type.toUpperCase()}`);
    console.log(`   Sujet : ${post.json.topic.subject || post.json.topic}`);
    console.log(`   Longueur : ${post.json.content.length} caractères`);
    console.log('');
  });
  
  console.log('✅ Génération terminée !\n');
}

generate3Posts().catch(console.error);

