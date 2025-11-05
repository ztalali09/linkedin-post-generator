// Script pour extraire les 10 derniers posts et les sauvegarder dans un README

const { getDatabase } = require('./generate_authentic_varied_posts.js');
const fs = require('fs');
const path = require('path');

async function extract10Posts() {
  try {
    const db = await getDatabase();
    const posts = await db.getRecentPosts(10);
    
    let content = `# 📝 10 Posts LinkedIn Générés - Test\n\n`;
    content += `Date de génération : ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}\n\n`;
    content += `---\n\n`;
    
    // Statistiques
    const typeCount = {};
    let stagePosts = 0;
    let totalWords = 0;
    let totalChars = 0;
    let postsWithImages = 0;
    
    posts.forEach(post => {
      typeCount[post.type] = (typeCount[post.type] || 0) + 1;
      if (post.type === 'internship_search') stagePosts++;
      const words = (post.content || '').split(/\s+/).length;
      totalWords += words;
      totalChars += (post.content || '').length;
      if (post.image_url) postsWithImages++;
    });
    
    content += `## 📊 Statistiques\n\n`;
    content += `- ✅ **${posts.length}/10 posts générés avec succès**\n`;
    content += `- 🎯 **Posts de recherche de stage** : ${stagePosts}/10 (${(stagePosts/10*100).toFixed(0)}%)\n`;
    content += `- 📏 **Longueur moyenne** : ${Math.round(totalWords/posts.length)} mots (${Math.round(totalChars/posts.length)} caractères)\n`;
    content += `- 🖼️ **Posts avec images** : ${postsWithImages}/10 (${(postsWithImages/10*100).toFixed(0)}%)\n`;
    content += `- 🎨 **Formats variés** : ${Object.keys(typeCount).length} types différents\n\n`;
    content += `### Répartition des formats :\n\n`;
    
    Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        const percentage = ((count / posts.length) * 100).toFixed(0);
        content += `- **${type}** : ${count} (${percentage}%)\n`;
      });
    
    content += `\n---\n\n`;
    
    // Afficher chaque post
    posts.reverse().forEach((post, index) => {
      const postNumber = index + 1;
      const date = new Date(post.generated_at).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const words = (post.content || '').split(/\s+/).length;
      const chars = (post.content || '').length;
      
      // Trouver le nom du format
      const formatNames = {
        'project_completed': 'Projet terminé avec stack technique',
        'project_milestone': 'Étape importante d\'un projet',
        'project_showcase': 'Présentation visuelle d\'un projet',
        'learning_skill': 'Nouvelle compétence acquise',
        'learning_concept': 'Concept technique expliqué simplement',
        'learning_certification': 'Certification obtenue',
        'tech_news': 'Actualité tech commentée',
        'tech_event': 'Participation à un événement tech',
        'personal_reflection': 'Réflexion sur le parcours',
        'personal_challenge': 'Défi surmonté',
        'internship_search': 'Recherche de stage'
      };
      
      const formatName = formatNames[post.type] || post.type;
      
      content += `## 📝 POST ${postNumber} : ${post.topic || 'Sans titre'}\n\n`;
      content += `**Type** : ${formatName}\n`;
      content += `**Date** : ${date}\n`;
      if (post.angle) {
        content += `**Angle** : ${post.angle}\n`;
      }
      if (post.relevance) {
        content += `**Pertinence** : ${post.relevance}\n`;
      }
      content += `**Longueur** : ${words} mots (${chars} caractères)\n`;
      if (post.image_url) {
        content += `**Image** : ✅ [Voir l'image](${post.image_url})\n`;
      }
      if (post.is_fallback) {
        content += `**⚠️ Fallback** : Oui\n`;
      }
      content += `\n---\n\n`;
      content += `### Contenu du post :\n\n`;
      content += `${post.content || 'Contenu non disponible'}\n\n`;
      content += `---\n\n`;
    });
    
    // Sauvegarder dans le fichier
    const filePath = path.join(__dirname, 'README_10_POSTS_GENERES.md');
    fs.writeFileSync(filePath, content, 'utf-8');
    
    console.log('✅ Fichier README_10_POSTS_GENERES.md créé avec succès !');
    console.log(`📄 ${posts.length} posts extraits`);
    console.log(`📁 Chemin : ${filePath}`);
    
    return content;
  } catch (error) {
    console.error('❌ Erreur lors de l\'extraction :', error);
    throw error;
  }
}

// Exécuter
extract10Posts().catch(error => {
  console.error('❌ Erreur fatale :', error);
  process.exit(1);
});

