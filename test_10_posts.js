// 🧪 Script de test : Générer 10 posts pour tester le système
// Teste la priorisation stage, la diversité des formats, et le LinkedIn Score

const generateAuthenticPost = require('./generate_authentic_varied_posts.js');
const { showTreatedTopics, showFormatDistribution } = require('./generate_authentic_varied_posts.js');

async function test10Posts() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🧪 TEST : Génération de 10 posts LinkedIn');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📋 Configuration :');
  console.log('   - Priorité stage : ACTIVÉE');
  console.log('   - Diversité formats : ACTIVÉE');
  console.log('   - LinkedIn Score : ACTIVÉE');
  console.log('   - Répartition cible : Stage 30%, Projets 25%, Apprentissage 25%, Veille 10%, Personnel 10%');
  console.log('\n🚀 Démarrage de la génération...\n');
  
  const posts = [];
  const errors = [];
  
  for (let i = 1; i <= 10; i++) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📝 POST ${i}/10`);
    console.log('='.repeat(60));
    
    try {
      const post = await generateAuthenticPost();
      
      if (post && post.json) {
        posts.push({
          number: i,
          type: post.json.type,
          topic: post.json.topic,
          priority: post.json.priority || 'N/A',
          linkedInScore: post.json.linkedInScore || null,
          length: post.json.content.length,
          wordCount: post.json.content.split(/\s+/).length,
          hasImage: post.json.image ? true : false,
          isFallback: post.json.isFallback || false,
          content: post.json.content.substring(0, 200) + '...' // Aperçu
        });
        
        console.log(`✅ Post ${i} généré avec succès !`);
        console.log(`   Type : ${post.json.type}`);
        console.log(`   Sujet : ${post.json.topic}`);
        console.log(`   Priorité : ${post.json.priority || 'N/A'}/5`);
        if (post.json.linkedInScore) {
          console.log(`   LinkedIn Score : ${(post.json.linkedInScore * 100).toFixed(1)}%`);
        }
        console.log(`   Longueur : ${post.json.content.length} caractères (${post.json.content.split(/\s+/).length} mots)`);
        console.log(`   Image : ${post.json.image ? '✅' : '❌'}`);
        console.log(`   Fallback : ${post.json.isFallback ? '⚠️ OUI' : '✅ NON'}`);
      } else {
        errors.push({ number: i, error: 'Post invalide retourné' });
        console.log(`❌ Post ${i} : Échec (post invalide)`);
      }
    } catch (error) {
      errors.push({ number: i, error: error.message });
      console.log(`❌ Post ${i} : Erreur - ${error.message}`);
    }
    
    // Attente entre les posts pour éviter rate limiting
    if (i < 10) {
      console.log('⏳ Attente de 2 secondes avant le prochain post...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Résumé final
  console.log('\n\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📊 RÉSUMÉ DU TEST - 10 POSTS');
  console.log('═══════════════════════════════════════════════════════════');
  
  console.log(`\n✅ Posts générés avec succès : ${posts.length}/10`);
  console.log(`❌ Erreurs : ${errors.length}/10`);
  
  if (posts.length > 0) {
    // Statistiques par type
    const typeCount = {};
    posts.forEach(p => {
      typeCount[p.type] = (typeCount[p.type] || 0) + 1;
    });
    
    console.log('\n📊 Répartition des formats :');
    Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        const percentage = ((count / posts.length) * 100).toFixed(0);
        const bar = '█'.repeat(Math.round(percentage / 5));
        console.log(`   ${type.padEnd(25)} : ${count} (${percentage}%) ${bar}`);
      });
    
    // Vérifier si stage est priorisé
    const stagePosts = posts.filter(p => p.type === 'internship_search').length;
    const stagePercentage = ((stagePosts / posts.length) * 100).toFixed(0);
    console.log(`\n🎯 Posts de recherche de stage : ${stagePosts}/10 (${stagePercentage}%)`);
    console.log(`   ${stagePercentage >= 20 && stagePercentage <= 40 ? '✅ OK' : '⚠️ Hors cible (20-40% attendu)'}`);
    
    // Statistiques LinkedIn Score
    const postsWithScore = posts.filter(p => p.linkedInScore !== null);
    if (postsWithScore.length > 0) {
      const avgScore = postsWithScore.reduce((sum, p) => sum + p.linkedInScore, 0) / postsWithScore.length;
      const minScore = Math.min(...postsWithScore.map(p => p.linkedInScore));
      const maxScore = Math.max(...postsWithScore.map(p => p.linkedInScore));
      
      console.log(`\n📈 LinkedIn Scores :`);
      console.log(`   Moyenne : ${(avgScore * 100).toFixed(1)}%`);
      console.log(`   Minimum : ${(minScore * 100).toFixed(1)}%`);
      console.log(`   Maximum : ${(maxScore * 100).toFixed(1)}%`);
    }
    
    // Statistiques longueur
    const avgLength = posts.reduce((sum, p) => sum + p.length, 0) / posts.length;
    const avgWords = posts.reduce((sum, p) => sum + p.wordCount, 0) / posts.length;
    
    console.log(`\n📏 Longueur moyenne :`);
    console.log(`   ${avgLength.toFixed(0)} caractères`);
    console.log(`   ${avgWords.toFixed(0)} mots`);
    console.log(`   ${avgWords >= 150 && avgWords <= 250 ? '✅ Optimal (150-250 mots)' : '⚠️ Hors idéal'}`);
    
    // Posts avec images
    const postsWithImages = posts.filter(p => p.hasImage).length;
    console.log(`\n🖼️  Posts avec images : ${postsWithImages}/10 (${(postsWithImages / posts.length * 100).toFixed(0)}%)`);
    
    // Fallback posts
    const fallbackPosts = posts.filter(p => p.isFallback).length;
    console.log(`\n⚠️  Posts fallback : ${fallbackPosts}/10 (${(fallbackPosts / posts.length * 100).toFixed(0)}%)`);
    if (fallbackPosts > 0) {
      console.log(`   ⚠️  ${fallbackPosts} post(s) utilisent le système de fallback (API Gemini indisponible)`);
    }
    
    // Aperçu des sujets
    console.log(`\n📝 Aperçu des sujets générés :`);
    posts.forEach((p, index) => {
      console.log(`   ${index + 1}. [${p.type}] ${p.topic}`);
    });
  }
  
  if (errors.length > 0) {
    console.log(`\n❌ Erreurs rencontrées :`);
    errors.forEach(e => {
      console.log(`   Post ${e.number} : ${e.error}`);
    });
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('✅ Test terminé !');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Afficher les statistiques de la base de données
  console.log('\n📊 Statistiques de la base de données :');
  await showTreatedTopics(10);
  await showFormatDistribution(10);
}

// Exécuter le test
test10Posts().catch(error => {
  console.error('❌ Erreur fatale lors du test :', error);
  process.exit(1);
});

