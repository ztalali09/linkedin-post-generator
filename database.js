// 💾 Système de base de données pour tracking long terme des posts
// Utilise SQLite pour persister l'historique des sujets traités

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin de la base de données
const DB_PATH = path.join(__dirname, 'posts_history.db');

class PostDatabase {
  constructor() {
    this.db = null;
  }

  // Initialiser la connexion et créer les tables
  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.error('❌ Erreur connexion BDD:', err);
          reject(err);
          return;
        }
        console.log('✅ Connexion BDD établie:', DB_PATH);
        this.createTables().then(resolve).catch(reject);
      });
    });
  }

  // Créer les tables si elles n'existent pas
  async createTables() {
    return new Promise((resolve, reject) => {
      const sql = `
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          topic TEXT NOT NULL,
          topic_hash TEXT NOT NULL UNIQUE,
          type TEXT NOT NULL,
          content TEXT NOT NULL,
          hashtags TEXT,
          angle TEXT,
          relevance TEXT,
          is_fallback INTEGER DEFAULT 0,
          image_url TEXT,
          image_hash TEXT,
          generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_topic_hash ON posts(topic_hash);
        CREATE INDEX IF NOT EXISTS idx_generated_at ON posts(generated_at);
        CREATE INDEX IF NOT EXISTS idx_type ON posts(type);
        CREATE INDEX IF NOT EXISTS idx_image_hash ON posts(image_hash);
      `;

      this.db.exec(sql, (err) => {
        if (err) {
          console.error('❌ Erreur création tables:', err);
          reject(err);
          return;
        }
        console.log('✅ Tables créées/vérifiées');
        resolve();
      });
    });
  }

  // Sauvegarder un nouveau post
  async savePost(postData) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO posts (topic, topic_hash, type, content, hashtags, angle, relevance, is_fallback, image_url, image_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        postData.topic || 'N/A',
        postData.topicHash,
        postData.type,
        postData.content,
        postData.hashtags || '',
        postData.angle || '',
        postData.relevance || '',
        postData.isFallback ? 1 : 0,
        postData.imageUrl || null,
        postData.imageHash || null
      ];

      this.db.run(sql, params, function(err) {
        if (err) {
          // Si erreur UNIQUE (déjà existe), c'est OK, on ignore
          if (err.message.includes('UNIQUE constraint failed')) {
            console.log('⚠️ Sujet déjà en BDD (normal)');
            resolve(this.lastID);
            return;
          }
          console.error('❌ Erreur sauvegarde post:', err);
          reject(err);
          return;
        }
        console.log(`✅ Post sauvegardé en BDD (ID: ${this.lastID})`);
        resolve(this.lastID);
      });
    });
  }

  // Récupérer tous les topic_hash déjà traités
  async getTreatedTopicHashes() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT topic_hash FROM posts WHERE is_fallback = 0`;

      this.db.all(sql, [], (err, rows) => {
        if (err) {
          console.error('❌ Erreur lecture BDD:', err);
          reject(err);
          return;
        }
        const hashes = rows.map(row => row.topic_hash);
        console.log(`📊 ${hashes.length} sujets déjà traités en BDD`);
        resolve(hashes);
      });
    });
  }

  // Récupérer les N derniers posts
  async getRecentPosts(limit = 10) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM posts 
        ORDER BY generated_at DESC 
        LIMIT ?
      `;

      this.db.all(sql, [limit], (err, rows) => {
        if (err) {
          console.error('❌ Erreur lecture posts récents:', err);
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  // Récupérer les sujets récents (pour affichage à Gemini)
  async getRecentTopics(limit = 20) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT topic FROM posts 
        WHERE is_fallback = 0
        ORDER BY generated_at DESC 
        LIMIT ?
      `;

      this.db.all(sql, [limit], (err, rows) => {
        if (err) {
          console.error('❌ Erreur lecture topics récents:', err);
          reject(err);
          return;
        }
        const topics = rows.map(row => row.topic);
        resolve(topics);
      });
    });
  }

  // Vérifier si un sujet a déjà été traité
  async isTopicTreated(topicHash) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT COUNT(*) as count FROM posts WHERE topic_hash = ?`;

      this.db.get(sql, [topicHash], (err, row) => {
        if (err) {
          console.error('❌ Erreur vérification sujet:', err);
          reject(err);
          return;
        }
        resolve(row.count > 0);
      });
    });
  }

  // Vérifier si une image a déjà été utilisée
  async isImageUsed(imageHash) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT COUNT(*) as count FROM posts WHERE image_hash = ?`;

      this.db.get(sql, [imageHash], (err, row) => {
        if (err) {
          console.error('❌ Erreur vérification image:', err);
          reject(err);
          return;
        }
        resolve(row.count > 0);
      });
    });
  }

  // Récupérer toutes les images déjà utilisées
  async getUsedImages() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT image_url, image_hash FROM posts WHERE image_url IS NOT NULL`;

      this.db.all(sql, [], (err, rows) => {
        if (err) {
          console.error('❌ Erreur récupération images:', err);
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  // Statistiques
  async getStats() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total_posts,
          COUNT(CASE WHEN is_fallback = 0 THEN 1 END) as real_posts,
          COUNT(CASE WHEN is_fallback = 1 THEN 1 END) as fallback_posts,
          COUNT(DISTINCT type) as unique_types,
          MIN(generated_at) as first_post_date,
          MAX(generated_at) as last_post_date
        FROM posts
      `;

      this.db.get(sql, [], (err, row) => {
        if (err) {
          console.error('❌ Erreur stats:', err);
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  // Fermer la connexion
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('❌ Erreur fermeture BDD:', err);
        } else {
          console.log('✅ Connexion BDD fermée');
        }
      });
    }
  }
}

// Export singleton
let dbInstance = null;

async function getDatabase() {
  if (!dbInstance) {
    dbInstance = new PostDatabase();
    await dbInstance.init();
  }
  return dbInstance;
}

module.exports = {
  getDatabase,
  PostDatabase
};

