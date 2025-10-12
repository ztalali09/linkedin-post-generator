#!/usr/bin/env node

/**
 * 🚀 Déclencheur GitHub Actions pour le Bot Telegram
 * Permet de déclencher un workflow GitHub Actions à la demande
 */

const fetch = require('node-fetch');

// Configuration GitHub
const GITHUB_CONFIG = {
  owner: 'ztalali09',
  repo: 'linkedin-post-generator',
  token: process.env.GITHUB_TOKEN, // Token GitHub avec permissions workflow
  workflowId: 'auto-post.yml'
};

// Fonction pour déclencher le workflow GitHub Actions
async function triggerGitHubAction() {
  try {
    console.log('🚀 Déclenchement du workflow GitHub Actions...');
    
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/actions/workflows/${GITHUB_CONFIG.workflowId}/dispatches`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ref: 'main' // Branche à utiliser
      })
    });
    
    if (response.ok) {
      console.log('✅ Workflow GitHub Actions déclenché avec succès !');
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Erreur déclenchement workflow:', error);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return false;
  }
}

// Fonction pour vérifier le statut du workflow
async function checkWorkflowStatus() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/actions/workflows/${GITHUB_CONFIG.workflowId}/runs?per_page=1`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const latestRun = data.workflow_runs[0];
      
      return {
        status: latestRun.status,
        conclusion: latestRun.conclusion,
        html_url: latestRun.html_url,
        created_at: latestRun.created_at
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Erreur vérification statut:', error.message);
    return null;
  }
}

// Exports
module.exports = {
  triggerGitHubAction,
  checkWorkflowStatus
};

// Exécution si appelé directement
if (require.main === module) {
  triggerGitHubAction().then(success => {
    if (success) {
      console.log('🎉 Workflow déclenché ! Vérifiez sur GitHub Actions.');
    } else {
      console.log('❌ Échec du déclenchement du workflow.');
    }
  });
}
