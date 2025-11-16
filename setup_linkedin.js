#!/usr/bin/env node

/**
 * 🔧 Script de Configuration LinkedIn API
 * 
 * Ce script aide à configurer rapidement les identifiants LinkedIn
 * dans le fichier .env
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('\n🔧 Configuration LinkedIn API\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  
  // Lire le fichier .env existant s'il existe
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ Fichier .env trouvé\n');
  } else {
    console.log('📝 Création d\'un nouveau fichier .env\n');
  }
  
  // Vérifier si LinkedIn est déjà configuré
  const hasLinkedInConfig = envContent.includes('LINKEDIN_CLIENT_ID');
  
  if (hasLinkedInConfig) {
    console.log('⚠️  Configuration LinkedIn déjà présente dans .env\n');
    const overwrite = await askQuestion('Voulez-vous la mettre à jour ? (o/n): ');
    if (overwrite.toLowerCase() !== 'o' && overwrite.toLowerCase() !== 'oui' && overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      console.log('\n❌ Configuration annulée\n');
      rl.close();
      return;
    }
    
    // Supprimer l'ancienne configuration LinkedIn
    envContent = envContent.replace(/LINKEDIN_CLIENT_ID=.*\n/g, '');
    envContent = envContent.replace(/LINKEDIN_CLIENT_SECRET=.*\n/g, '');
    envContent = envContent.replace(/LINKEDIN_REDIRECT_URI=.*\n/g, '');
    envContent = envContent.replace(/LINKEDIN_ACCESS_TOKEN=.*\n/g, '');
    envContent = envContent.replace(/LINKEDIN_REFRESH_TOKEN=.*\n/g, '');
    envContent = envContent.replace(/LINKEDIN_PERSON_ID=.*\n/g, '');
    envContent = envContent.replace(/# LinkedIn API.*\n/g, '');
  }
  
  console.log('\n📋 Veuillez entrer les informations de votre application LinkedIn :\n');
  
  const useDefault = await askQuestion('Avez-vous déjà un Client ID et Client Secret ? (o/n): ');
  
  let clientId, clientSecret;
  
  if (useDefault.toLowerCase() === 'o' || useDefault.toLowerCase() === 'oui' || useDefault.toLowerCase() === 'y' || useDefault.toLowerCase() === 'yes') {
    clientId = await askQuestion('Client ID: ');
    clientSecret = await askQuestion('Client Secret: ');
  } else {
    clientId = await askQuestion('Client ID: ');
    clientSecret = await askQuestion('Client Secret: ');
  }
  
  const redirectUri = await askQuestion(`URL de redirection [http://localhost:3000/auth/linkedin/callback]: `) || 'http://localhost:3000/auth/linkedin/callback';
  
  // Ajouter la configuration LinkedIn
  envContent += '\n# ============================================\n';
  envContent += '# CONFIGURATION LINKEDIN API\n';
  envContent += '# ============================================\n';
  envContent += `LINKEDIN_CLIENT_ID=${clientId}\n`;
  envContent += `LINKEDIN_CLIENT_SECRET=${clientSecret}\n`;
  envContent += `LINKEDIN_REDIRECT_URI=${redirectUri}\n`;
  envContent += `LINKEDIN_ACCESS_TOKEN=\n`;
  envContent += `LINKEDIN_REFRESH_TOKEN=\n`;
  envContent += `LINKEDIN_PERSON_ID=\n`;
  
  // Écrire le fichier .env
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n✅ Configuration LinkedIn sauvegardée dans .env !\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📋 Prochaines étapes :\n');
  console.log('1. Configurez l\'URL de redirection dans LinkedIn :');
  console.log('   https://www.linkedin.com/developers/apps\n');
  console.log('2. Exécutez l\'authentification :');
  console.log('   node linkedin_auth.js\n');
  console.log('3. Testez la publication dans le bot Telegram !\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  rl.close();
}

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
}

module.exports = { main };

