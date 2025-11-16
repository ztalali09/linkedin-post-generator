// 🔗 API LinkedIn pour Publication Automatique de Posts
// Utilise l'API LinkedIn v2 pour publier des posts avec ou sans images

require('dotenv').config();
const fetch = require('node-fetch');

// Configuration LinkedIn API
const LINKEDIN_CONFIG = {
  clientId: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  redirectUri: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/auth/linkedin/callback',
  accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
  refreshToken: process.env.LINKEDIN_REFRESH_TOKEN,
  personId: process.env.LINKEDIN_PERSON_ID, // Format: urn:li:person:xxxxx
  baseUrl: 'https://api.linkedin.com/v2',
  authUrl: 'https://www.linkedin.com/oauth/v2'
};

// Vérifier la configuration
if (!LINKEDIN_CONFIG.clientId || !LINKEDIN_CONFIG.clientSecret) {
  console.warn('⚠️ LinkedIn API non configurée. Variables LINKEDIN_CLIENT_ID et LINKEDIN_CLIENT_SECRET requises.');
}

/**
 * Génère l'URL d'autorisation OAuth 2.0
 * @param {string} state - Token aléatoire pour la sécurité
 * @returns {string} URL d'autorisation
 */
function getAuthorizationUrl(state) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CONFIG.clientId,
    redirect_uri: LINKEDIN_CONFIG.redirectUri,
    state: state,
    scope: 'w_member_social openid profile' // Ajouter openid et profile pour récupérer le Person ID
  });
  
  return `${LINKEDIN_CONFIG.authUrl}/authorization?${params.toString()}`;
}

/**
 * Échange un code d'autorisation contre un access token
 * @param {string} code - Code d'autorisation reçu après redirection
 * @returns {Promise<Object>} { access_token, expires_in, refresh_token }
 */
async function exchangeCodeForToken(code) {
  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: LINKEDIN_CONFIG.redirectUri,
      client_id: LINKEDIN_CONFIG.clientId,
      client_secret: LINKEDIN_CONFIG.clientSecret
    });
    
    const response = await fetch(`${LINKEDIN_CONFIG.authUrl}/accessToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur LinkedIn OAuth: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Erreur échange code/token:', error);
    throw error;
  }
}

/**
 * Rafraîchit un access token expiré
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} Nouveau { access_token, expires_in, refresh_token }
 */
async function refreshAccessToken(refreshToken = null) {
  try {
    const token = refreshToken || LINKEDIN_CONFIG.refreshToken;
    
    if (!token) {
      throw new Error('Refresh token manquant');
    }
    
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: token,
      client_id: LINKEDIN_CONFIG.clientId,
      client_secret: LINKEDIN_CONFIG.clientSecret
    });
    
    const response = await fetch(`${LINKEDIN_CONFIG.authUrl}/accessToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erreur refresh token: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    
    // Mettre à jour la config avec le nouveau token
    LINKEDIN_CONFIG.accessToken = data.access_token;
    if (data.refresh_token) {
      LINKEDIN_CONFIG.refreshToken = data.refresh_token;
    }
    
    console.log('✅ Access token rafraîchi avec succès');
    return data;
  } catch (error) {
    console.error('❌ Erreur refresh token:', error);
    throw error;
  }
}

/**
 * Récupère le Person ID de l'utilisateur
 * @param {string} accessToken - Access token
 * @returns {Promise<string>} Person ID (format: urn:li:person:xxxxx)
 */
async function getPersonId(accessToken = null) {
  try {
    const token = accessToken || LINKEDIN_CONFIG.accessToken;
    
    if (!token) {
      throw new Error('Access token manquant');
    }
    
    // Essayer d'abord avec l'endpoint /userinfo (OpenID Connect)
    let response = await fetch(`${LINKEDIN_CONFIG.baseUrl}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.sub) {
        const personId = `urn:li:person:${data.sub}`;
        console.log(`✅ Person ID récupéré via userinfo: ${personId}`);
        return personId;
      }
    }
    
    // Fallback : essayer avec /me
    response = await fetch(`${LINKEDIN_CONFIG.baseUrl}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const personId = `urn:li:person:${data.id}`;
      console.log(`✅ Person ID récupéré via /me: ${personId}`);
      return personId;
    }
    
    // Si les deux échouent, on peut quand même publier sans Person ID
    // en utilisant l'endpoint qui ne le requiert pas explicitement
    if (response.status === 401) {
      // Token expiré, essayer de le rafraîchir
      console.log('🔄 Token expiré, tentative de rafraîchissement...');
      await refreshAccessToken();
      return getPersonId(LINKEDIN_CONFIG.accessToken);
    }
    
    // Si 403, c'est que le scope n'est pas disponible, mais on peut continuer
    if (response.status === 403) {
      console.warn('⚠️ Impossible de récupérer Person ID (scope manquant), mais on peut continuer');
      console.warn('💡 Le Person ID sera récupéré automatiquement lors de la première publication');
      return null; // Retourner null, on récupérera le Person ID plus tard
    }
    
    throw new Error(`Erreur récupération Person ID: ${response.status}`);
  } catch (error) {
    console.warn('⚠️ Erreur récupération Person ID:', error.message);
    console.warn('💡 On continue sans Person ID, il sera récupéré lors de la publication');
    return null; // Ne pas faire échouer l'authentification
  }
}

/**
 * Upload une image sur LinkedIn
 * @param {string} imageUrl - URL de l'image à uploader
 * @param {string} accessToken - Access token
 * @returns {Promise<string>} Asset ID (format: urn:li:digitalmediaAsset:xxxxx)
 */
async function uploadImage(imageUrl, accessToken = null) {
  try {
    const token = accessToken || LINKEDIN_CONFIG.accessToken;
    
    if (!token) {
      throw new Error('Access token manquant');
    }
    
    // Étape 1 : Télécharger l'image depuis l'URL
    console.log(`📥 Téléchargement de l'image depuis: ${imageUrl}`);
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Erreur téléchargement image: ${imageResponse.status}`);
    }
    
    const imageBuffer = await imageResponse.buffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    // Étape 2 : Enregistrer l'upload
    const registerResponse = await fetch(`${LINKEDIN_CONFIG.baseUrl}/assets?action=registerUpload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
          owner: LINKEDIN_CONFIG.personId || await getPersonId(token),
          serviceRelationships: [{
            relationshipType: 'OWNER',
            identifier: 'urn:li:userGeneratedContent'
          }]
        }
      })
    });
    
    if (!registerResponse.ok) {
      const error = await registerResponse.text();
      throw new Error(`Erreur enregistrement upload: ${registerResponse.status} - ${error}`);
    }
    
    const registerData = await registerResponse.json();
    const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
    const assetId = registerData.value.asset;
    
    // Étape 3 : Uploader l'image
    console.log(`📤 Upload de l'image vers LinkedIn...`);
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType
      },
      body: imageBuffer
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Erreur upload image: ${uploadResponse.status}`);
    }
    
    console.log(`✅ Image uploadée avec succès: ${assetId}`);
    return assetId;
  } catch (error) {
    console.error('❌ Erreur upload image:', error);
    throw error;
  }
}

/**
 * Publie un post sur LinkedIn (sans image)
 * @param {string} text - Texte du post
 * @param {string} accessToken - Access token
 * @returns {Promise<Object>} Réponse de l'API LinkedIn
 */
async function publishTextPost(text, accessToken = null) {
  try {
    const token = accessToken || LINKEDIN_CONFIG.accessToken;
    
    if (!token) {
      throw new Error('Access token manquant');
    }
    
    // Récupérer le Person ID (essayer plusieurs méthodes)
    let personId = LINKEDIN_CONFIG.personId;
    
    if (!personId || personId === 'null') {
      console.log('🆔 Person ID manquant, récupération automatique...');
      personId = await getPersonId(token);
      
      // Si toujours null, essayer avec l'endpoint userinfo (OpenID Connect)
      if (!personId) {
        try {
          const userinfoResponse = await fetch(`${LINKEDIN_CONFIG.baseUrl}/userinfo`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-Restli-Protocol-Version': '2.0.0'
            }
          });
          
          if (userinfoResponse.ok) {
            const userinfo = await userinfoResponse.json();
            if (userinfo.sub) {
              personId = `urn:li:person:${userinfo.sub}`;
              console.log(`✅ Person ID récupéré via userinfo: ${personId}`);
            }
          }
        } catch (error) {
          console.warn('⚠️ Impossible de récupérer Person ID via userinfo:', error.message);
        }
      }
      
      // Si toujours null, utiliser l'endpoint qui ne nécessite pas explicitement le Person ID
      if (!personId) {
        console.warn('⚠️ Person ID non disponible, tentative de publication sans Person ID explicite...');
        // LinkedIn peut parfois accepter sans Person ID si l'access token est valide
        // On va essayer avec une valeur par défaut ou utiliser l'endpoint alternatif
      }
    }
    
    // Si toujours pas de Person ID, on ne peut pas publier
    if (!personId || personId === 'null') {
      throw new Error('Person ID manquant. Exécutez node linkedin_auth.js pour le récupérer, ou vérifiez que le scope openid est activé.');
    }
    
    const postData = {
      author: personId,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: text
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };
    
    console.log('📤 Publication du post sur LinkedIn...');
    const response = await fetch(`${LINKEDIN_CONFIG.baseUrl}/ugcPosts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expiré, essayer de le rafraîchir
        console.log('🔄 Token expiré, tentative de rafraîchissement...');
        await refreshAccessToken();
        return publishTextPost(text, LINKEDIN_CONFIG.accessToken);
      }
      
      const error = await response.text();
      throw new Error(`Erreur publication post: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    console.log('✅ Post publié avec succès sur LinkedIn !');
    return data;
  } catch (error) {
    console.error('❌ Erreur publication post:', error);
    throw error;
  }
}

/**
 * Publie un post sur LinkedIn avec une image
 * @param {string} text - Texte du post
 * @param {string} imageUrl - URL de l'image
 * @param {string} imageDescription - Description de l'image (optionnel)
 * @param {string} accessToken - Access token
 * @returns {Promise<Object>} Réponse de l'API LinkedIn
 */
async function publishPostWithImage(text, imageUrl, imageDescription = null, accessToken = null) {
  try {
    const token = accessToken || LINKEDIN_CONFIG.accessToken;
    
    if (!token) {
      throw new Error('Access token manquant');
    }
    
    if (!imageUrl) {
      // Si pas d'image, publier juste le texte
      return publishTextPost(text, token);
    }
    
    const personId = LINKEDIN_CONFIG.personId || await getPersonId(token);
    
    // Uploader l'image
    const assetId = await uploadImage(imageUrl, token);
    
    const postData = {
      author: personId,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: text
          },
          shareMediaCategory: 'IMAGE',
          media: [
            {
              status: 'READY',
              description: {
                text: imageDescription || 'Image du post'
              },
              media: assetId,
              title: {
                text: 'Image du post'
              }
            }
          ]
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };
    
    console.log('📤 Publication du post avec image sur LinkedIn...');
    const response = await fetch(`${LINKEDIN_CONFIG.baseUrl}/ugcPosts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData)
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expiré, essayer de le rafraîchir
        console.log('🔄 Token expiré, tentative de rafraîchissement...');
        await refreshAccessToken();
        return publishPostWithImage(text, imageUrl, imageDescription, LINKEDIN_CONFIG.accessToken);
      }
      
      const error = await response.text();
      throw new Error(`Erreur publication post avec image: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    console.log('✅ Post avec image publié avec succès sur LinkedIn !');
    return data;
  } catch (error) {
    console.error('❌ Erreur publication post avec image:', error);
    // Fallback : publier sans image
    console.log('⚠️ Tentative de publication sans image...');
    return publishTextPost(text, accessToken);
  }
}

/**
 * Publie un post généré par le système
 * @param {Object} post - Objet post généré (format du bot)
 * @returns {Promise<Object>} Réponse de l'API LinkedIn
 */
async function publishGeneratedPost(post) {
  try {
    if (!post || !post.json) {
      throw new Error('Post invalide');
    }
    
    const text = post.json.content;
    const imageUrl = post.json.image?.url || null;
    const imageDescription = post.json.image?.description || null;
    
    if (imageUrl) {
      return await publishPostWithImage(text, imageUrl, imageDescription);
    } else {
      return await publishTextPost(text);
    }
  } catch (error) {
    console.error('❌ Erreur publication post généré:', error);
    throw error;
  }
}

// Exports
module.exports = {
  getAuthorizationUrl,
  exchangeCodeForToken,
  refreshAccessToken,
  getPersonId,
  uploadImage,
  publishTextPost,
  publishPostWithImage,
  publishGeneratedPost,
  LINKEDIN_CONFIG
};

