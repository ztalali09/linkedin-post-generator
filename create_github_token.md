# 🔑 Créer un Token GitHub pour déclencher les workflows

## 📋 Étapes pour créer un token GitHub :

### 1. Aller sur GitHub Settings
- Allez sur : https://github.com/settings/tokens
- Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**

### 2. Configurer le token
- **Note** : `LinkedIn Post Generator Bot`
- **Expiration** : `No expiration` (ou 1 an)
- **Scopes** : Cochez ces permissions :
  - ✅ `repo` (Full control of private repositories)
  - ✅ `workflow` (Update GitHub Action workflows)

### 3. Générer et copier le token
- Cliquez sur **"Generate token"**
- **IMPORTANT** : Copiez le token immédiatement (il ne sera plus visible)

### 4. Ajouter le token au bot
```bash
export GITHUB_TOKEN="votre_token_ici"
```

### 5. Tester le déclenchement
- Le bot pourra maintenant déclencher les workflows GitHub Actions
- Le post sera généré et envoyé automatiquement

## 🔧 Alternative : Utiliser GitHub CLI

Si vous avez GitHub CLI installé :
```bash
gh auth login
gh auth token
```

## ⚠️ Sécurité

- Ne partagez jamais votre token
- Ajoutez-le aux secrets GitHub si nécessaire
- Utilisez des tokens avec des permissions minimales

---

## 🚀 Une fois le token configuré :

1. **Bouton 🤖** : Génère un post localement (rapide)
2. **Bouton 🚀** : Déclenche GitHub Actions (code déployé)
3. **Automatisation** : Posts automatiques à 9h et 14h
