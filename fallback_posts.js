// 📚 100 Posts de Fallback Variés
// Utilisés quand l'API Gemini est indisponible
// Contenu authentique basé sur le profil : 18 ans, 3 ans freelance, étudiant BUT

module.exports = [
  
  // ========== EXPERIENCE_LESSON (10 posts) ==========
  
  {
    content: `3 ans de freelance, une leçon claire :

La qualité du client > la quantité de projets.

Au début, je disais oui à tout.
Résultat : burnout, projets cauchemars, tarifs ridicules.

Maintenant :
→ Brief précis ou je passe
→ Budget réaliste ou non
→ Communication pro ou rien

Dire non libère du temps pour les bons projets.

Et vous, vous avez appris à filtrer ?`,
    type: "experience_lesson",
    hashtags: "#FreelanceDev #WebDev #DevLife"
  },
  
  {
    content: `Erreur de débutant que j'ai faite :

Facturer au forfait sans connaître VRAIMENT le scope du projet.

Résultat :
→ 80h de travail pour 200€
→ Client qui demande "juste un petit truc en plus"
→ Moi qui dis oui par peur de perdre le client

Leçon apprise :
Forfait = scope ULTRA précis + contrat.
Ou tarif horaire. Point.

Vous avez des fails similaires à partager ?`,
    type: "experience_lesson",
    hashtags: "#Freelance #LessonsLearned #WebDev"
  },
  
  {
    content: `Conseil que j'aurais aimé avoir à mes débuts :

Garde 20% de ton temps pour apprendre.

J'étais à 100% projets clients → 0% apprentissage.
Résultat : même stack pendant 2 ans, stagnation.

Maintenant :
→ 1 nouveau tuto par semaine
→ Side projects perso le weekend
→ Veille tech quotidienne (15 min)

Tu progresses pas si tu codes toujours la même chose.

Vous faites comment pour rester à jour ?`,
    type: "experience_lesson",
    hashtags: "#DevLife #Learning #Growth"
  },
  
  {
    content: `Premier projet freelance :
80€ pour un site vitrine.
40h de travail.
Soit 2€/heure. Bravo champion.

Mais le client a doublé ses réservations en 2 mois.
Il m'a recommandé à 3 autres personnes.
J'ai appris 10x plus qu'en cours.

Parfois les "mauvais" deals sont les meilleurs investissements.

Quel a été votre premier projet ?`,
    type: "experience_lesson",
    hashtags: "#FirstProject #Freelance #WebDev"
  },
  
  {
    content: `Vérité sur le freelancing à 18 ans :

✅ Liberté de choix
✅ Expérience concrète
✅ Revenus variables (ça motive)

❌ Pas de congés payés
❌ Pas de mentor direct
❌ Gérer compta + projets + études

Le plus dur ?
Savoir quand s'arrêter de bosser.

Y'a pas de "fin de journée" quand ton bureau = ta chambre.

Les autres freelances, vous gérez comment ?`,
    type: "experience_lesson",
    hashtags: "#FreelanceLife #RealTalk #WorkLifeBalance"
  },
  
  {
    content: `J'ai perdu un client parce que j'étais trop cheap.

Oui, TROP cheap.

J'ai proposé 300€ pour un site.
Il voulait payer 1000€.

Il a eu peur : "pourquoi si peu ? Y'a un truc ?"
Il est parti voir ailleurs.

Leçon : prix bas = manque de confiance.
Vos compétences ont de la valeur. Assumez-les.

Vous avez déjà sous-estimé vos tarifs ?`,
    type: "experience_lesson",
    hashtags: "#Freelance #Pricing #SelfWorth"
  },
  
  {
    content: `Ce que 50+ projets freelance m'ont appris :

La technique compte pour 30%.
Le reste ? Communication.

→ Répondre rapidement aux messages
→ Tenir informé le client (même si ça avance pas)
→ Expliquer en langage simple
→ Gérer les attentes dès le début

Un dev moyen avec bonne comm' > dev expert silencieux.

Change my mind.`,
    type: "experience_lesson",
    hashtags: "#Communication #Freelance #SoftSkills"
  },
  
  {
    content: `Erreur que je vois partout chez les jeunes devs :

Vouloir tout apprendre en même temps.

React + Vue + Angular + Node + Python + Go + Rust...
Résultat : niveau débutant sur tout, expert sur rien.

Mieux :
→ Maîtriser 1-2 technos à fond
→ Les utiliser sur de vrais projets
→ Devenir vraiment bon
→ PUIS élargir

Profondeur > Largeur.

Vous êtes team "expert d'une techno" ou "touche à tout" ?`,
    type: "experience_lesson",
    hashtags: "#Learning #Focus #DevCareer"
  },
  
  {
    content: `Mon setup de productivité en freelance :

❌ PAS de notifications Slack/Discord en journée
❌ PAS de réseaux sociaux avant 18h
❌ PAS de musique avec paroles quand je code

✅ Sessions Pomodoro (25 min focus)
✅ To-do list papier (satisfaction de barrer !)
✅ Playlists lofi en boucle

Résultat : 5h de vraie concentration > 10h dispersées.

Votre meilleur hack productivité ?`,
    type: "experience_lesson",
    hashtags: "#Productivity #Focus #FreelanceLife"
  },
  
  {
    content: `Ce qu'on m'a dit : "Fais de la pub sur Instagram pour trouver des clients"

Ce qui a vraiment marché :
→ Recommandations de clients satisfaits (80% de mes projets)
→ Répondre sur des forums/groupes Facebook (15%)
→ Portfolio propre sur GitHub (5%)
→ Instagram : 0%

Le meilleur marketing = faire du bon boulot.
Les clients parlent.

Comment vous trouvez vos clients ?`,
    type: "experience_lesson",
    hashtags: "#Marketing #ClientAcquisition #Freelance"
  },
  
  // ========== TECH_DEBATE (10 posts) ==========
  
  {
    content: `Débat : TypeScript sur un petit projet perso, overkill ou pas ?

Mon cas :
→ App Vue.js perso (gestion budget)
→ 2000 lignes de code
→ Que moi qui code dessus

Avec TS :
✅ Refactoring hyper safe
✅ Autocomplete au top
✅ Moins de bugs stupides

Sans TS :
✅ Setup instantané
✅ Moins de config
✅ Plus rapide pour prototyper

Verdict : je reste sur TS même en solo.
Le temps gagné en debug > temps perdu en config.

Votre avis ?`,
    type: "tech_debate",
    hashtags: "#TypeScript #JavaScript #DevDebate"
  },
  
  {
    content: `Question : Tailwind CSS vs CSS pur, c'est quoi le verdict en 2025 ?

Tailwind :
✅ Développement ultra rapide
✅ Design system cohérent
✅ Responsive facile

CSS pur :
✅ Contrôle total
✅ Pas de dépendance
✅ Fichier plus léger

Perso : Tailwind sur 100% de mes projets depuis 6 mois.
Plus envie de créer des noms de classes à rallonge.

Mais je comprends les puristes CSS.

Vous êtes team quoi ?`,
    type: "tech_debate",
    hashtags: "#TailwindCSS #CSS #WebDev"
  },
  
  {
    content: `Tests unitaires sur TOUS les projets, vraiment nécessaire ?

Sur mon dernier projet :
→ J'ai écrit des tests pour chaque fonction
→ Temps de dev x1.5
→ Mais 0 bug en prod depuis 2 mois

Sans tests :
→ Développement plus rapide
→ Mais debug en prod = enfer
→ Client pas content

Pour un side project solo ? Peut-être overkill.
Pour un projet client ? Indispensable.

Vous testez à quel point vos projets ?`,
    type: "tech_debate",
    hashtags: "#Testing #QualityCode #DevLife"
  },
  
  {
    content: `Vue.js vs React : mon retour après avoir utilisé les 2.

Vue :
✅ Courbe d'apprentissage douce
✅ Template HTML classiques
✅ Documentation française top

React :
✅ Écosystème immense
✅ Plus de jobs
✅ Communauté énorme

J'ai commencé avec Vue. Aucun regret.
Maintenant je touche à React pour le marché du travail.

Conseil : apprends celui qui te plaît PUIS l'autre.
Les concepts sont similaires.

Vous avez commencé par lequel ?`,
    type: "tech_debate",
    hashtags: "#VueJS #React #Frontend"
  },
  
  {
    content: `Docker en dev local : gain de temps ou perte de temps ?

Pour :
✅ Même env pour toute l'équipe
✅ Pas de "ça marche sur ma machine"
✅ Setup propre

Contre :
❌ Courbe d'apprentissage
❌ Ressources CPU/RAM
❌ Parfois plus lent que natif

Perso : j'apprends encore.
Sur un projet solo ? Pas encore convaincu.
En équipe ? Ça a du sens.

Vous utilisez Docker au quotidien ?`,
    type: "tech_debate",
    hashtags: "#Docker #DevOps #DevEnvironment"
  },
  
  {
    content: `Frameworks CSS : Bootstrap vs Tailwind vs rien ?

Bootstrap 2025 :
→ Rapide pour prototyper
→ Mais tous les sites se ressemblent
→ Beaucoup de CSS inutilisé

Tailwind :
→ Utility-first = rapide
→ Design unique facilement
→ Mais HTML verbeux

CSS pur :
→ Contrôle total
→ Apprentissage solide
→ Mais plus long

Mon choix : Tailwind.
Le HTML verbeux me dérange pas si je gagne 3x en vitesse.

Vous utilisez quoi ?`,
    type: "tech_debate",
    hashtags: "#CSS #WebDev #Framework"
  },
  
  {
    content: `MongoDB vs PostgreSQL pour un projet web ?

Je vois tout le monde dire "PostgreSQL always".
Mais MongoDB a été parfait sur mon dernier projet :

→ Schema flexible (startup = pivot fréquents)
→ JSON natif (API REST friendly)
→ Scaling horizontal facile

PostgreSQL :
→ Relations complexes OK
→ Transactions ACID
→ Mature et stable

Verdict : dépend du projet.
Pas de "silver bullet".

Quelle DB vous utilisez le plus ?`,
    type: "tech_debate",
    hashtags: "#Database #MongoDB #PostgreSQL"
  },
  
  {
    content: `Git flow vs GitHub flow vs trunk-based : vous faites comment ?

Mes 3 ans de freelance :
→ Solo = commits direct sur main (oui je sais...)
→ Petit projet = GitHub flow (main + feature branches)
→ Projet étudiant actuel = Git flow (dev + main + feature)

Git flow en équipe = lourd mais nécessaire.
GitHub flow = sweet spot pour moi.

Trunk-based ? Jamais testé en vrai.

Vous gérez comment vos branches ?`,
    type: "tech_debate",
    hashtags: "#Git #Workflow #BestPractices"
  },
  
  {
    content: `REST API vs GraphQL : le débat qui divise.

J'ai fait que du REST pendant 3 ans.
Là je test GraphQL sur un projet.

REST :
✅ Simple à comprendre
✅ Cachable facilement
✅ Standard établi

GraphQL :
✅ Client récupère que ce qu'il veut
✅ Moins de requêtes
✅ Documentation auto

Honnêtement ? GraphQL me semble overkill pour 80% des projets.
Mais top pour les apps complexes.

Vous utilisez GraphQL en prod ?`,
    type: "tech_debate",
    hashtags: "#API #GraphQL #REST"
  },
  
  {
    content: `npm vs yarn vs pnpm : ça change vraiment quelque chose ?

J'utilise npm depuis toujours.
Collègues me disent "essaie pnpm c'est plus rapide".

Honnêtement ?
→ npm marche
→ Tout le monde le connaît
→ Pourquoi changer ?

Mais je vois pnpm de plus en plus.
Workspace monorepo = vraiment mieux ?

Vous avez migré de npm ? Ça valait le coup ?`,
    type: "tech_debate",
    hashtags: "#npm #PackageManager #JavaScript"
  },
  
  // ========== CURRENT_PROJECT (10 posts) ==========
  
  {
    content: `Projet de groupe en cours : app événementielle gamifiée.

Stack : Vue.js + Node.js + TypeScript
Équipe : 5 devs, méthode Agile

Le challenge ?
Pas le code. C'est coordonner 5 agendas, 5 visions, 5 styles.

Git conflicts, débats d'archi, specs qui changent...
Welcome to real dev 😅

Mais c'est là qu'on apprend vraiment.

Les autres étudiants, c'est comment vos projets d'équipe ?`,
    type: "current_project",
    hashtags: "#DevLife #Teamwork #StudentDev"
  },
  
  {
    content: `Side project du moment : tracker de dépenses minimaliste.

Pourquoi ?
Toutes les apps existantes sont trop compliquées.
Je veux juste : entrer un montant, une catégorie, voir un graphique.

Stack :
→ Vue.js (SPA rapide)
→ LocalStorage (pas besoin de back pour v1)
→ Chart.js (graphiques simples)

Objectif : finir en 1 semaine.
On est à J+3, 60% fait.

Vous aussi vous recréez des apps qui existent déjà ?`,
    type: "current_project",
    hashtags: "#SideProject #Vue #BuildInPublic"
  },
  
  {
    content: `Refonte de mon portfolio en cours.

Ancien :
→ Template WordPress basique
→ Lent (3s de chargement)
→ Pas responsive

Nouveau :
→ Next.js + Tailwind
→ < 1s de chargement
→ Dark mode natif
→ Animé mais subtil

Leçon : ton portfolio = ta vitrine.
Si ton portfolio est lent, le client pense que tes sites le seront aussi.

Vous avez refait combien de fois votre portfolio ?`,
    type: "current_project",
    hashtags: "#Portfolio #WebDev #PersonalBranding"
  },
  
  {
    content: `Migration d'un vieux projet PHP vers Node.js.

Code écrit il y a 2 ans = illisible.
J'ai honte.

Mais :
→ Ça marche depuis 2 ans sans bug
→ Client content
→ Pourquoi migrer alors ?

Raison : le client veut des nouvelles features.
Ajouter du code sur du legacy = impossible.

Refonte complète = 2 semaines de travail.

Vous refactorez à quel point vos vieux projets ?`,
    type: "current_project",
    hashtags: "#Refactoring #Legacy #Migration"
  },
  
  {
    content: `Projet BUT S4 : système de gestion pour association étudiante.

Features :
→ Gestion membres
→ Planning événements
→ Comptabilité simplifiée
→ Emailing automatique

Ce qui me plaît :
Vrai besoin, vraies contraintes, vrai client.
Pas un projet fictif.

Ce qui me fait peur :
Le client veut ça pour dans 4 semaines.
On est 3. On a cours à côté.

Gérer les attentes = 50% du job.

Projets étudiants : utopie ou réalité ?`,
    type: "current_project",
    hashtags: "#StudentProject #RealWorld #BUT"
  },
  
  {
    content: `En train de créer un bot Telegram pour automatiser mes posts LinkedIn.

Workflow :
1. Génère un post avec IA
2. Trouve une image Unsplash
3. Envoie sur Telegram pour validation
4. Post automatiquement si OK

Stack :
→ Node.js + n8n (automation)
→ API Gemini (génération texte)
→ API Unsplash (images)
→ API Telegram (notification)

Résultat : de 1h/jour à 5min/jour.

Automatiser = gagner du temps pour ce qui compte.

Qu'est-ce que vous automatisez dans votre workflow ?`,
    type: "current_project",
    hashtags: "#Automation #Productivity #AI"
  },
  
  {
    content: `Prototype en cours : app de pomodoro avec suivi de productivité.

Pourquoi encore une app pomodoro ?
Parce que je veux :
→ Stats détaillées (pas juste un timer)
→ Intégration Google Calendar
→ Suggestions de pauses basées sur l'activité

Tech :
→ Electron (app desktop)
→ Vue.js (UI)
→ SQLite (données locales)

Sera-t-elle terminée ? Probablement pas.
Vais-je apprendre plein de trucs ? Oui.

Les side projects = terrains d'apprentissage.`,
    type: "current_project",
    hashtags: "#SideProject #Learning #Productivity"
  },
  
  {
    content: `Contribution open source en cours sur un projet Vue.js.

C'est ma première vraie contribution.

Process :
→ Fork le repo
→ Crée une branche
→ Fix le bug
→ Pull request
→ Attendre review... (stressant)

Ce que j'ai appris :
→ Lire le code des autres = difficile
→ Tests unitaires = obligatoires
→ Code review = humiliant mais formateur

Open source = meilleure école après le terrain.

Vous contribuez à des projets open source ?`,
    type: "current_project",
    hashtags: "#OpenSource #Vue #Learning"
  },
  
  {
    content: `Projet personnel : mini SaaS de génération de factures.

Parce que je galère avec la facturation freelance.

Features :
→ Templates de factures pro
→ Export PDF automatique
→ Suivi paiements
→ Relances automatiques

Pas besoin de Stripe/PayPal intégré.
Juste générer et tracker.

Monétisation ?
Freemium : 3 factures/mois gratuit, puis 5€/mois.

Lancer un SaaS = sur ma to-do depuis 1 an.
Cette fois je le fais.`,
    type: "current_project",
    hashtags: "#SaaS #Freelance #BuildInPublic"
  },
  
  {
    content: `Apprentissage du jour : Docker pour mon projet actuel.

Avant :
"Installe Node 18, PostgreSQL 15, Redis..."
= 2h de setup pour un nouveau dev

Maintenant :
docker-compose up
= 5 minutes

Je comprends enfin l'intérêt.

Par contre la courbe d'apprentissage... 
3 jours pour comprendre volumes, networks, etc.

Mais ça vaut le coup.

Docker : vous l'utilisez depuis quand ?`,
    type: "current_project",
    hashtags: "#Docker #DevOps #Learning"
  },
  
  // ========== PRACTICAL_ADVICE (10 posts) ==========
  
  {
    content: `3 erreurs classiques sur les sites web (que je faisais aussi) :

❌ Oublier le responsive mobile
→ 70% du trafic vient du mobile. Si ça bug sur iPhone, vous avez perdu.

❌ Négliger le SEO de base
→ Balises title, meta description, alt sur les images. 10 min, gros impact.

❌ Images non optimisées
→ Des PNG de 5MB qui tuent les temps de chargement. WebP + compression = must.

Ces 3 trucs transforment un site amateur en site pro.

Quelle était votre pire erreur de débutant ?`,
    type: "practical_advice",
    hashtags: "#WebDev #Tips #BestPractices"
  },
  
  {
    content: `Comment facturer en freelance (ce que j'aurais aimé savoir) :

❌ Tarif horaire trop bas par peur de perdre le client
✅ Calcule TES charges (impôts, URSSAF, matos, logiciels)
✅ Ajoute une marge pour les imprévus (y'en aura)
✅ Assume ton tarif

Mon évolution :
→ Débuts : 15€/h
→ 6 mois : 30€/h
→ Maintenant : 50€/h (et je refuse du monde)

Plus tu te valorises, plus on te valorise.

Quel est votre tarif ?`,
    type: "practical_advice",
    hashtags: "#Freelance #Pricing #Business"
  },
  
  {
    content: `Setup de développement qui m'a fait gagner 2h/jour :

1. VS Code + extensions killer :
→ ESLint (detect erreurs)
→ Prettier (format auto)
→ GitLens (historique git inline)

2. Terminal amélioré :
→ Oh My Zsh (autocomplete++)
→ Alias pour commandes fréquentes

3. Snippets custom :
→ "vcomp" = template Vue component
→ "apir" = template API route Express

Investis 1 journée dans ton setup = rentable à vie.

Votre meilleur outil de productivité ?`,
    type: "practical_advice",
    hashtags: "#Productivity #VSCode #DevSetup"
  },
  
  {
    content: `Git : les commandes que j'utilise vraiment tous les jours.

git add .
git commit -m "message"
git push
git pull
git status
git log --oneline

C'est tout. 90% du temps.

Le reste (rebase, cherry-pick, etc.) :
→ Google quand j'en ai besoin
→ Pas la peine de tout mémoriser

Conseil : maîtrise les bases à fond.
Les trucs avancés viendront naturellement.

Vous utilisez souvent rebase/stash/cherry-pick ?`,
    type: "practical_advice",
    hashtags: "#Git #Tips #DevLife"
  },
  
  {
    content: `Sauvegarder ton code : la règle 3-2-1.

3 copies de tes données
2 supports différents (disque dur + cloud)
1 copie hors site

Mon setup :
→ Git remote (GitHub) ✅
→ Disque dur externe ✅
→ Google Drive backup hebdo ✅

Pourquoi ?
J'ai perdu 1 mois de travail il y a 2 ans.
Disque dur mort, pas de backup.

Jamais plus.

Vous sauvegardez comment vos projets ?`,
    type: "practical_advice",
    hashtags: "#Backup #DataSafety #DevTips"
  },
  
  {
    content: `Optimiser un site web en 5 actions :

1. WebP pour les images (−70% de poids)
2. Lazy loading (charge images à la demande)
3. Minify CSS/JS (webpack/vite le fait)
4. Gzip activé côté serveur
5. CDN pour les assets statiques

Résultat réel sur un projet :
→ Avant : 8s de chargement
→ Après : 2.1s

Taux de rebond divisé par 2.

Performance = UX = conversions.

Vous optimisez à quel point vos sites ?`,
    type: "practical_advice",
    hashtags: "#Performance #WebDev #Optimization"
  },
  
  {
    content: `Apprendre à coder : mes 3 ressources incontournables.

1. Documentation officielle
→ Pas sexy mais exhaustif
→ Source de vérité

2. YouTube (Grafikart, Traversy Media)
→ Voir quelqu'un coder = comprendre le flow
→ Gratuit et à ton rythme

3. Projets persos
→ Tuto = passif
→ Construire = actif
→ C'est en codant qu'on apprend

Bootcamps/formations payantes ?
Si t'es discipliné = pas obligatoire.

Comment vous avez appris ?`,
    type: "practical_advice",
    hashtags: "#Learning #SelfTaught #Resources"
  },
  
  {
    content: `Gérer son temps en freelance + études :

Lundi-Vendredi :
→ 8h-12h : cours
→ 14h-18h : projets clients (4h focus)
→ 20h-21h : veille tech

Weekend :
→ Samedi : repos (vraiment)
→ Dimanche : side projects persos

Règle d'or :
PAS de travail client après 18h.
Sinon = burnout garanti.

L'équilibre > la productivité extrême.

Vous gérez comment études + freelance ?`,
    type: "practical_advice",
    hashtags: "#TimeManagement #WorkLifeBalance #Student"
  },
  
  {
    content: `Trouver des clients freelance (ce qui marche vraiment) :

❌ Cold email en masse : 0%
❌ Pub Instagram : 0%
❌ Démarchage LinkedIn : 5%

✅ Recommandations clients : 80%
✅ Réponses dans groupes Facebook : 15%
✅ Portfolio GitHub/site perso : 5%

La clé : faire du bon boulot.
Les clients contents parlent.
Les mauvais aussi (mais en mal).

Meilleur investissement = satisfaire le client actuel.

Comment vous trouvez vos clients ?`,
    type: "practical_advice",
    hashtags: "#ClientAcquisition #Freelance #Marketing"
  },
  
  {
    content: `Sécurité web : les bases à ne PAS négliger.

✅ Hash les mots de passe (bcrypt)
✅ HTTPS activé (Let's Encrypt = gratuit)
✅ Validation inputs (TOUJOURS côté serveur)
✅ SQL injection protection (requêtes préparées)
✅ CORS configuré correctement

J'ai vu des sites avec :
→ Mots de passe en clair en BDD
→ Pas de HTTPS
→ Aucune validation

2025 et ça existe encore.

Ne soyez pas ce dev.

Vous avez déjà piraté (accidentellement) vos propres apps ?`,
    type: "practical_advice",
    hashtags: "#Security #WebDev #BestPractices"
  },
  
  // ========== TECH_DISCOVERY (10 posts) ==========
  
  {
    content: `Je viens de découvrir Vite pour remplacer Webpack.

Différence de vitesse :
→ Webpack : 30s de build
→ Vite : 3s

Hot reload instantané vs 5s d'attente.

C'est pas juste plus rapide.
C'est tellement rapide que ça change l'expérience de dev.

Tu modifies, tu vois instantanément.

Pourquoi j'ai attendu si longtemps pour tester ?

Vous utilisez Vite ou encore sur Webpack ?`,
    type: "tech_discovery",
    hashtags: "#Vite #Webpack #BuildTools"
  },
  
  {
    content: `Feature Vue 3.4 qui change la vie : defineModel().

Avant (Vue 2 style) :
→ Props
→ Emit
→ v-model
→ 20 lignes de code

Maintenant :
→ defineModel()
→ 1 ligne

Two-way binding simplifié à l'extrême.

C'est ces petites optimisations qui font qu'on adore un framework.

Veille techno = essentiel.

Comment vous restez à jour ?`,
    type: "tech_discovery",
    hashtags: "#VueJS #Frontend #WebDev"
  },
  
  {
    content: `Découverte du jour : Bun (remplaçant Node.js).

Promesses :
→ 3x plus rapide que Node
→ TypeScript natif
→ Compatible npm packages

Test sur un projet perso :
→ npm run dev : 2.3s
→ bun run dev : 0.8s

Par contre :
Ecosystème jeune, quelques bugs.

Je reste sur Node pour la prod.
Mais Bun = à surveiller en 2025.

Vous testez les nouvelles technos ou vous attendez la maturité ?`,
    type: "tech_discovery",
    hashtags: "#Bun #NodeJS #JavaScript"
  },
  
  {
    content: `Astuce découverte cette semaine : GitHub Copilot en terminal.

Avant :
→ Oublie une commande git
→ Google "git undo last commit"
→ StackOverflow
→ Copie commande

Maintenant :
→ "copilot suggest 'undo last commit'"
→ Commande suggérée instantanément

Ça marche pour docker, git, npm, tout.

AI assistants = game changers.

Vous utilisez Copilot / ChatGPT au quotidien ?`,
    type: "tech_discovery",
    hashtags: "#AI #Copilot #Productivity"
  },
  
  {
    content: `Test de shadcn/ui : composants React/Vue prêts à l'emploi.

Différence avec les autres libs :
→ Pas installé comme package npm
→ Tu copies le code dans ton projet
→ Tu modifies comme tu veux

Avantage : contrôle total.
Inconvénient : pas de updates automatiques.

J'ai mis en place un dashboard en 2h.
Sans ça = 2 jours de CSS.

Vous utilisez des composants libraries ?`,
    type: "tech_discovery",
    hashtags: "#UI #Components #Frontend"
  },
  
  {
    content: `J'ai découvert Drizzle ORM et franchement... impressionné.

Comparé à Prisma que j'utilise :
→ Plus léger (pas de génération de fichiers)
→ Plus rapide
→ TypeScript-first natif

Par contre :
→ Moins mature
→ Moins de docs
→ Community plus petite

Prisma reste mon choix pour maintenant.
Mais Drizzle = à surveiller.

Quel ORM vous utilisez ?`,
    type: "tech_discovery",
    hashtags: "#ORM #Database #TypeScript"
  },
  
  {
    content: `Nouveauté CSS 2025 : :has() selector.

Avant (JS obligatoire) :
if (div.querySelector('img')) { }

Maintenant (pure CSS) :
div:has(img) { }

Tu peux styler un parent selon ses enfants.
En CSS pur. Sans JS.

Des trucs qui étaient impossibles deviennent triviaux.

CSS moderne = puissant.

Vous suivez les nouveautés CSS ?`,
    type: "tech_discovery",
    hashtags: "#CSS #WebDev #ModernCSS"
  },
  
  {
    content: `Test de Turso : SQLite en cloud.

Concept :
→ Performance de SQLite
→ Mais hébergé et scalable
→ Edge database (proche users)

Use case parfait :
Petites apps qui veulent la simplicité de SQLite mais en prod.

Prix : gratuit jusqu'à 500 MB.

Alternative intéressante à Supabase/Firebase pour petits projets.

Vous utilisez quoi comme BaaS ?`,
    type: "tech_discovery",
    hashtags: "#Database #SQLite #Cloud"
  },
  
  {
    content: `Fonctionnalité macOS que je viens de découvrir après 3 ans de dev...

Stage Manager.

Organise automatiquement tes fenêtres par projet/contexte.

Avant :
→ 15 fenêtres VS Code ouvertes
→ Je cherche 2 min pour trouver le bon projet

Maintenant :
→ Swipe entre contexts
→ Chaque projet = son espace

Comment j'ai pu vivre sans ça ?

Quel est votre meilleur trick productivité OS ?`,
    type: "tech_discovery",
    hashtags: "#Productivity #macOS #WorkflowTips"
  },
  
  {
    content: `Outil découvert : Bruno (alternative à Postman).

Différences :
→ Open source
→ Stocke tout en local (pas de cloud sync forcé)
→ Git-friendly (fichiers texte)

Postman = lourd, demande connexion.
Bruno = léger, offline-first.

Pour tester des APIs en dev : parfait.

Vous utilisez quoi pour tester vos APIs ?`,
    type: "tech_discovery",
    hashtags: "#API #Tools #Testing"
  },
  
  // ========== MILESTONE (10 posts) ==========
  
  {
    content: `Barre des 50 projets freelance dépassée 🎯

Le parcours :
→ Maroc → France
→ 2022 → 2025
→ 15 ans → 18 ans
→ 0 projet → 50+ livrés

Ce qui a changé :
✅ Je code 3x plus vite
✅ Je détecte les red flags client instantanément
✅ Je facture correctement
✅ Je livre dans les temps (presque toujours 😅)

Ce qui n'a pas changé :
💻 Résoudre des problèmes en code = toujours aussi satisfaisant
🎯 Chaque projet reste un challenge

Prochaine étape : décrocher un stage où apprendre d'une vraie équipe tech.`,
    type: "milestone",
    hashtags: "#Milestone #Freelance #Journey"
  },
  
  {
    content: `Premier client qui m'a payé 1000€+ pour un projet.

Flashback :
→ Mes débuts : 80€ le site
→ Il y a 6 mois : 300€ en moyenne
→ Ce mois : 1200€ pour une app web

Différence ?
Pas forcément les compétences.
Mais :
→ Portfolio solide
→ Témoignages clients
→ Confiance en mes tarifs
→ Client qui valorise le travail

L'important : j'ai livré un projet dont je suis fier.

Quel a été votre premier "gros" projet ?`,
    type: "milestone",
    hashtags: "#Freelance #Growth #Success"
  },
  
  {
    content: `1 an sur GitHub : bilan.

Contributions :
→ 847 commits cette année
→ 23 repos publics
→ 3 repos avec 10+ stars

Apprentissage :
→ Git flow maîtrisé
→ Open source démystifié
→ Code plus propre (review publique = motivation)

Next level :
→ Contribuer à de gros projets open source
→ Créer un package npm utile

GitHub = CV vivant.

Vous avez combien de commits cette année ?`,
    type: "milestone",
    hashtags: "#GitHub #OpenSource #DevLife"
  },
  
  {
    content: `First time speaker : présentation devant 30 étudiants.

Sujet : "Freelancing à 18 ans : retour d'expérience"

Stress level : 9/10
Préparation : 2 semaines
Durée réelle : 45 min (prévu 30...)

Feedback :
→ 5 étudiants m'ont contacté après
→ 2 veulent se lancer en freelance
→ 1 a déjà son premier client

Partager ce qu'on a appris = meilleure façon de vraiment le maîtriser.

Vous avez déjà fait des présentations publiques ?`,
    type: "milestone",
    hashtags: "#PublicSpeaking #Sharing #Experience"
  },
  
  {
    content: `Projet le plus long bouclé : 4 mois de dev.

C'était un SaaS de gestion pour auto-école :
→ Planning élèves
→ Suivi heures de conduite
→ Facturation
→ Espace élève + moniteur

Stack : Vue.js + Laravel + PostgreSQL

Ce que j'ai appris :
→ Architecture d'app complexe
→ Tests indispensables sur gros projets
→ Communication client = crucial
→ 4 mois = loooong en solo

Fierté : le client l'utilise tous les jours depuis 6 mois.

Votre projet le plus long ?`,
    type: "milestone",
    hashtags: "#SaaS #ProjectManagement #Achievement"
  },
  
  {
    content: `Première contribution open source acceptée ✅

Repo : projet Vue.js communautaire
Contribution : fix bug + ajout feature
Pull request : merged après 3 reviews

Sensation :
→ Stressant (code review publique)
→ Formateur (feedback de devs expérimentés)
→ Satisfaisant (mon code utilisé par des milliers de personnes)

Open source = école gratuite de haut niveau.

Prochain objectif : contribuer à Vue.js core.

Vous contribuez à quels projets ?`,
    type: "milestone",
    hashtags: "#OpenSource #Contribution #Learning"
  },
  
  {
    content: `100 followers sur LinkedIn 🎯

Ça peut sembler peu.
Mais c'est :
→ 100 personnes qui s'intéressent à mon parcours
→ 5 opportunités de networking
→ 2 clients potentiels dans le lot

J'ai appris :
→ Authenticité > posts formatés
→ Partager ses galères = engagement
→ Régularité > fréquence

Next : 500 followers d'ici 6 mois.

Vous êtes sur LinkedIn ? On se connecte ?`,
    type: "milestone",
    hashtags: "#LinkedIn #Networking #PersonalBranding"
  },
  
  {
    content: `Première app publiée en production avec 0 bugs signalés depuis 3 mois.

Secret ?
→ Tests unitaires (85% coverage)
→ Tests end-to-end (Cypress)
→ Beta avec 10 users pendant 2 semaines
→ Monitoring erreurs (Sentry)

Avant je considérais tests = perte de temps.
Maintenant je considère pas de tests = irresponsable.

La vraie maturité de dev = tester son code.

Vous testez à quel point vos projets ?`,
    type: "milestone",
    hashtags: "#Testing #Quality #DevLife"
  },
  
  {
    content: `Diplôme de fin de S3 BUT Informatique validé 🎓

Bilan :
→ Théorie ++
→ Pratique ++ (surtout grâce au freelance)
→ Travail d'équipe appris

Meilleure décision :
Combiner études + freelance.

L'un complète l'autre :
→ Cours = bases solides
→ Freelance = application réelle

Prochaine étape : S4 puis stage.

Les autres étudiants dev, vous cumulez avec quoi ?`,
    type: "milestone",
    hashtags: "#Student #BUT #Education"
  },
  
  {
    content: `Mon premier article de blog publié.

Sujet : "Comment j'ai débuté en freelance à 15 ans"

Stats après 1 mois :
→ 2400 vues
→ 45 partages
→ 12 messages reçus
→ 1 client signé grâce à ça

Leçon :
Partager son expérience = meilleur marketing.

Les gens achètent à des gens, pas à des marques.

Vous bloguez ? Vous avez un site perso ?`,
    type: "milestone",
    hashtags: "#Blogging #ContentCreation #PersonalBrand"
  },
  
  // ========== SUCCESS_STORY (10 posts) ==========
  
  {
    content: `Flashback septembre 2022.

15 ans, je me lance sur Fiverr sans trop savoir où je vais.

Premier client : site vitrine pour un restaurant.
Budget : 80€
Temps passé : 40h (rookie mistake)
Résultat : le client a doublé ses réservations en 2 mois !

Il m'a recommandé à 3 autres restos.

Aujourd'hui, 50+ projets après :
→ Sites e-commerce
→ Applications web custom
→ Clients internationaux
→ Facturation pro (enfin !)

Impact concret : un site que j'ai développé a généré 25k€ de CA en 6 mois.

Le freelancing m'a appris ce qu'aucun cours ne m'aurait appris.`,
    type: "success_story",
    hashtags: "#SuccessStory #Freelance #Journey"
  },
  
  {
    content: `Client qui m'a fait le plus progresser :

Un avocat qui voulait digitaliser son cabinet.

Demandes :
→ Gestion dossiers
→ Agenda clients
→ Facturation automatique
→ Signature électronique
→ Sécurité max (données sensibles)

J'avais jamais fait ça.
J'ai dit oui quand même.

3 mois de dev intense.
J'ai appris :
→ Architecture app complexe
→ Sécurité (RGPD, encryption)
→ Tests rigoureux
→ Déploiement pro

Résultat : app utilisée par 3 avocats + 5 assistants depuis 1 an.

Accepter un projet trop gros = meilleur accélérateur de compétences.`,
    type: "success_story",
    hashtags: "#Challenge #Growth #RealProject"
  },
  
  {
    content: `Projet qui m'a fait réaliser que j'aimais vraiment ça :

App de gestion pour une petite entreprise (5 employés).

Leur problème :
Tout sur papier. Post-its partout. Infos perdues.

Ma solution :
Dashboard simple : tâches, deadlines, fichiers partagés.

Feedback après 1 mois :
"On a gagné 2h/jour. C'est révolutionnaire pour nous."

Ce moment où tu réalises :
Tu résous pas juste un problème technique.
Tu améliores concrètement la vie des gens.

C'est pour ça que je code.`,
    type: "success_story",
    hashtags: "#Impact #Purpose #WebDev"
  },
  
  {
    content: `Premier projet où j'ai été payé PLUS que demandé.

J'avais proposé 600€ pour un site e-commerce.

Livraison :
→ Site responsive parfait
→ Paiement en ligne intégré
→ Dashboard admin complet
→ Formation du client (2h)
→ Support 1 mois inclus

Le client :
"Voilà 1000€. Tu as fait un super boulot."

Leçon :
Surpasser les attentes = meilleur investissement.
Le client a recommandé 4 autres personnes.

Ce client = 5000€ de CA indirect sur 2 ans.`,
    type: "success_story",
    hashtags: "#ClientSatisfaction #Freelance #Success"
  },
  
  {
    content: `Moment de fierté : mon code utilisé par 300+ personnes.

Projet : plateforme d'événements pour une association étudiante.

Features :
→ Inscription événements
→ QR codes validation
→ Gamification (points XP)
→ Classements

Stats après 3 mois :
→ 312 utilisateurs actifs
→ 28 événements organisés
→ 0 bug critique

Voir ton code utilisé en vrai par des vraies personnes...
Y'a pas de meilleure satisfaction.

Quel projet vous a rendu le plus fier ?`,
    type: "success_story",
    hashtags: "#Pride #RealUsage #ImpactfulWork"
  },
  
  {
    content: `Client impossible devenu meilleur ambassadeur.

Contexte :
Client exigeant. Changements constants. 15 aller-retours.

J'aurais pu lâcher l'affaire.
Au lieu de ça : patience + communication ++

Résultat final : exactement ce qu'il voulait.

Aujourd'hui :
→ Client fidèle (4 projets en 2 ans)
→ Me recommande à tous ses contacts
→ Reviews 5 étoiles partout

Leçon :
Un client difficile bien géré > 10 clients faciles.

Votre pire client devenu meilleur client ?`,
    type: "success_story",
    hashtags: "#ClientRelations #Patience #Success"
  },
  
  {
    content: `Projet qui a validé que je pouvais faire ça pro :

Application de réservation pour coiffeurs (3 salons).

Complexité :
→ Multi-users (coiffeurs + clients)
→ Sync calendriers en temps réel
→ Paiements en ligne
→ Notifications SMS
→ Dashboard stats

Solo. 3 mois. Pendant mes études.

Livré dans les temps. 0 bug majeur.

Le patron m'a dit :
"T'as 17 ans et tu fais mieux que des agences à 10k€."

Moment où j'ai su : je peux en vivre.`,
    type: "success_story",
    hashtags: "#Confidence #Professional #BigProject"
  },
  
  {
    content: `Success mesurable : site que j'ai fait en 2023 toujours en ligne et actif.

Ça peut sembler basique.
Mais :
→ Hébergement que j'ai configuré
→ Mises à jour de sécurité que je gère
→ Nouvelles features ajoutées régulièrement

Client content. Site performant. Business qui tourne.

Dans le dev, la vraie réussite c'est pas juste livrer.
C'est livrer quelque chose qui DURE.

Combien de vos projets sont encore en ligne ?`,
    type: "success_story",
    hashtags: "#Longevity #Maintenance #Success"
  },
  
  {
    content: `Transformation qui me rend fier :

Commerce local qui n'avait pas de site web.
Uniquement Facebook (mal géré).

J'ai créé :
→ Site vitrine pro
→ Système de commande en ligne
→ Google My Business optimisé
→ SEO local

Résultat en 6 mois :
→ +200% de visibilité en ligne
→ 40% du CA vient du site
→ 5 avis Google 5 étoiles

Aider un commerce local à se digitaliser = gratifiant.

Vous avez aidé des commerces locaux ?`,
    type: "success_story",
    hashtags: "#LocalBusiness #Digital #Impact"
  },
  
  {
    content: `Premier projet payé en crypto (ETH).

Client international, plus simple pour lui en crypto.

Montant : 0.8 ETH (≈ 2000€ à l'époque)

Aujourd'hui cette crypto vaut... 
(je garde pour vous 😅)

Anecdote :
J'avais 16 ans. Expliquer à mes parents que je suis payé en "monnaie internet" = galère.

Freelance international = expériences uniques.

Vous acceptez les cryptos ?`,
    type: "success_story",
    hashtags: "#Crypto #InternationalClient #Freelance"
  },
  
  // ========== REFLECTION (10 posts) ==========
  
  {
    content: `Question du jour : en tant que dev, quelle responsabilité sur l'impact environnemental de ce qu'on code ?

Stats qui font réfléchir :
Le numérique = 4% des émissions mondiales de CO2 (et ça augmente).

Paradoxe :
La tech peut résoudre des problèmes environnementaux.
Mais nos infrastructures consomment massivement.

Ce qu'on peut faire :
✅ Code optimisé = moins de calculs = moins d'énergie
✅ Hébergeurs verts (OVH, Infomaniak)
✅ Sites légers (< 1MB)
✅ Éviter le bloatware

Perso, j'optimise mes projets aussi pour l'impact.

Vous y pensez dans vos projets ?`,
    type: "reflection",
    hashtags: "#GreenTech #Sustainability #DevResponsible"
  },
  
  {
    content: `Réflexion : l'IA va-t-elle remplacer les devs juniors ?

Mon avis après avoir utilisé ChatGPT/Copilot pendant 6 mois :

❌ Non, l'IA remplace pas.
✅ Mais elle change le métier.

Ce qui reste humain :
→ Comprendre le besoin client
→ Architecture d'une app complexe
→ Debug de problèmes bizarres
→ Décisions techniques

Ce que l'IA fait bien :
→ Code boilerplate
→ Suggestions de fixes
→ Documentation
→ Code de base rapide

Conclusion : les devs qui utilisent l'IA > les devs qui la refusent.

Vous utilisez l'IA au quotidien ?`,
    type: "reflection",
    hashtags: "#AI #Future #DevCareer"
  },
  
  {
    content: `Débat : faut-il se spécialiser ou rester généraliste ?

J'ai longtemps été généraliste :
Frontend, backend, design, SEO, un peu de mobile...

Avantage : autonomie totale.
Inconvénient : expert de rien.

Maintenant je me spécialise (Vue.js + Node.js).

Observation :
→ Les spécialistes sont mieux payés
→ Mais les généralistes trouvent plus facilement du travail

En freelance : généraliste = plus flexible.
En entreprise : spécialiste = plus valorisé.

Vous êtes team spécialisation ou généraliste ?`,
    type: "reflection",
    hashtags: "#Career #Specialization #DevPath"
  },
  
  {
    content: `Pensée du jour : le syndrome de l'imposteur est réel.

Situation récente :
On me propose un projet React.
Je connais Vue mais pas React.

Mon cerveau :
"T'es un imposteur, tu vas échouer, refuse."

Ma décision :
"J'apprends React en 2 semaines et je fais le projet."

Résultat : projet livré, client content, React appris.

L'imposteur syndrome = signe que tu sors de ta zone de confort.
C'est là que tu progresses.

Vous le ressentez aussi ?`,
    type: "reflection",
    hashtags: "#ImpostorSyndrome #Growth #Mindset"
  },
  
  {
    content: `Question éthique : accepter un projet dont tu désapprouves le but ?

Cas concret :
On me propose 2000€ pour un site de paris sportifs.

Je refuse les jeux d'argent. Éthiquement pas OK pour moi.

J'ai refusé. 2000€ en moins.
Regrets ? Aucun.

Freelancing = liberté de choisir ses clients.
Ton code = ton éthique.

Par contre :
Un autre dev a accepté.
L'argent a pas disparu.

Vous avez des lignes rouges ?`,
    type: "reflection",
    hashtags: "#Ethics #Freelance #Values"
  },
  
  {
    content: `Réalité du "passion coding" :

Twitter : "Je code 12h/jour par amour du code"
Réalité : burnout garanti.

Mon expérience :
→ Débuts : code 10h/jour, weekends compris
→ Résultat : fatigue, perte de motivation, code de mauvaise qualité

Maintenant :
→ 6h de code focus/jour maximum
→ Weekends = 0 code client (side projects perso OK)
→ Sport + sorties = obligatoire

Paradoxe :
Moins de temps = meilleure qualité.

Le code c'est un marathon, pas un sprint.

Vous codez combien d'heures/jour ?`,
    type: "reflection",
    hashtags: "#Balance #Burnout #RealTalk"
  },
  
  {
    content: `Pensée : les diplômes comptent encore en dev ?

Mon cas :
→ 3 ans de freelance
→ 50+ projets
→ Clients satisfaits
→ Mais "juste" un BUT Informatique en cours

Observation :
→ Startups : diplôme = secondaire
→ Grandes boîtes : diplôme = requis
→ Clients directs : diplôme = on s'en fout

Freelance = compétences comptent plus que papiers.
Salariat = diplôme ouvre des portes.

Mon plan : finir le BUT quand même.
Parce que "au cas où".

Diplôme = important pour vous ?`,
    type: "reflection",
    hashtags: "#Education #Degree #Career"
  },
  
  {
    content: `Réflexion : coder à 18 ans vs coder à 30 ans ?

J'ai 18 ans. J'ai l'énergie et le temps.
Mais pas l'expérience et la maturité.

Un dev senior de 35 ans m'a dit :
"Profite de ton énergie maintenant. À 30 ans t'auras famille, responsabilités. Moins de temps pour side projects."

En même temps :
À 30 ans = meilleur réseau, crédibilité, salaire.

Avantage des jeunes :
→ Apprendre vite
→ Prendre des risques
→ Pas (encore) de contraintes

Devs seniors : vous confirmez ?`,
    type: "reflection",
    hashtags: "#Age #Career #Experience"
  },
  
  {
    content: `Question : faut-il toujours utiliser les dernières technos ?

Exemple concret :
Client veut un site. Simple. Vitrine.

Option A : Next.js 14 + Tailwind + TypeScript
→ Over-engineered
→ Cool sur le CV
→ Maintenance future complexe

Option B : HTML/CSS/JS vanilla
→ Simple, rapide
→ Client peut maintenir lui-même
→ Pas sexy sur le CV

J'ai choisi... B.

La bonne techno = celle adaptée au besoin.
Pas la plus hype.

Vous sur-engineez parfois pour l'expérience ?`,
    type: "reflection",
    hashtags: "#Technology #KeepItSimple #RightTool"
  },
  
  {
    content: `Pensée : le dev c'est 20% code, 80% Google/StackOverflow ?

Meme vs Réalité.

Vérité :
→ Débutant : 80% Google, 20% code
→ Intermédiaire : 50/50
→ Senior : 20% Google, 80% code

Différence ?
→ Les seniors googlent les bonnes questions
→ Comprennent les réponses rapidement
→ Adaptent au contexte

Google/ChatGPT = outils. Pas des béquilles.

L'important : comprendre ce que tu copies.

Vous googlez encore beaucoup ?`,
    type: "reflection",
    hashtags: "#Learning #Development #RealTalk"
  },
  
  // ========== INTERNSHIP_SEARCH (10 posts) ==========
  
  {
    content: `Recherche de stage : mode sérieux activé 🎯

Contexte :
8-10 semaines, avril-juin 2025
Fin de S4 BUT Informatique

Ce que je recherche :
✅ Équipe tech qui pratique vraiment l'Agile
✅ Code en production (pas des todos fictifs)
✅ Devs seniors qui aiment partager
✅ Challenges techniques réels

Ce que j'apporte :
💪 3 ans freelance, 50+ projets
💪 Stack : Vue.js, Node.js, TypeScript, PostgreSQL
💪 Autonomie + apprentissage rapide
💪 Esprit d'équipe (projet groupe en cours)

Flexible sur : stack, taille, remote/présentiel.
Priorité : apprendre d'une vraie équipe.

Vous recrutez ?`,
    type: "internship_search",
    hashtags: "#Stage #Belfort #Recrutement"
  },
  
  {
    content: `Stage recherché : dev web/fullstack (avril-juin 2025).

Mon profil :
→ Étudiant BUT Informatique S4
→ 3 ans d'expérience freelance
→ Stack actuelle : Vue + Node + TypeScript

Ce qui me motive :
Travailler en équipe.

3 ans en solo = compétences techniques OK.
Maintenant besoin : code reviews, pair programming, process pro.

Idéal :
→ Startup/PME tech
→ Belfort ou Nord Franche-Comté
→ Remote partiel acceptable

Objectif : apprendre, pas juste exécuter.

Des pistes ?`,
    type: "internship_search",
    hashtags: "#Internship #Developer #Belfort"
  },
  
  {
    content: `En recherche de stage dev (8-10 semaines).

Pourquoi moi :
→ Background freelance = autonomie
→ Projets réels livrés = pas juste théorie
→ Habitué aux deadlines et clients réels
→ Envie d'apprendre d'une équipe structurée

Ce que je veux éviter :
❌ Stage "café + photocopies"
❌ Code qui finit jamais en prod
❌ Tâches sans contexte ni explication

Ce que je cherche :
✅ Contribuer sur des vrais projets
✅ Mentors accessibles
✅ Culture d'apprentissage

Entreprises tech de Belfort/Franche-Comté : on discute ?`,
    type: "internship_search",
    hashtags: "#StageIT #TechIntern #Belfort"
  },
  
  {
    content: `Ouvert aux opportunités de stage (avril-juin 2025).

Mon parcours atypique :
→ Freelance depuis 15 ans
→ Maintenant 18 ans, en BUT Info
→ Besoin d'expérience en entreprise structurée

Compétences :
Frontend : Vue.js, React (bases), Tailwind
Backend : Node.js, Express, API REST
Database : PostgreSQL, MongoDB
Tools : Git, Docker (learning), Agile

Objectif stage :
Comprendre comment fonctionne une vraie équipe de dev.

Belfort et alentours, ou remote.

Intéressé ?`,
    type: "internship_search",
    hashtags: "#JobSearch #Internship #WebDev"
  },
  
  {
    content: `Stage de fin de S4 : je cherche l'équipe idéale.

Ce que je NE cherche pas :
→ Grosses corporations avec process lourds
→ Stages "observer sans toucher"
→ Missions floues sans objectifs

Ce que je CHERCHE :
→ Startup ou scale-up dynamique
→ Équipe qui ship du code régulièrement
→ Environnement où on peut proposer des idées
→ Devs passionnés (pas juste 9h-17h)

Ma valeur ajoutée :
3 ans de projets réels = je connais la production.

Qui recrute des stagiaires dev motivés ?`,
    type: "internship_search",
    hashtags: "#Startup #Internship #Motivated"
  },
  
  {
    content: `Appel à réseau : stage dev recherché (2-3 mois).

Timing : avril-juin 2025
Localisation : Belfort ou remote

Mon profil :
→ Développeur fullstack (Vue + Node principalement)
→ Expérience freelance (gestion projets de A à Z)
→ Étudiant sérieux et autonome

Vos besoins possibles :
→ Renfort sur projet existant
→ POC à développer rapidement
→ Features à implémenter
→ Maintenance et amélioration d'app

Je m'adapte à votre stack.

Connaissez-vous des entreprises qui recrutent ?`,
    type: "internship_search",
    hashtags: "#Network #StageRecherche #DevFullstack"
  },
  
  {
    content: `Stage dev : ce que je peux apporter à votre équipe.

Atouts :
→ Déjà livré 50+ projets (pas théorique)
→ Habitué à travailler en autonomie
→ Communication client maîtrisée
→ Apprend vite (3 ans freelance = adaptabilité)

Ce que je viens chercher :
→ Travailler en équipe (ma faiblesse actuelle)
→ Apprendre les best practices d'une boîte structurée
→ Contribuer sur projets d'envergure
→ Code reviews et mentoring

Gagnant-gagnant :
Vous : stagiaire opérationnel rapidement
Moi : expérience team indispensable

On en parle ?`,
    type: "internship_search",
    hashtags: "#Stage #Value #Teamwork"
  },
  
  {
    content: `Recherche stage dev : intérêt particulier pour industrie tech locale.

Cible :
→ Alstom (systèmes ferroviaires + IT)
→ Peugeot Sochaux (digital factory)
→ McPhy (hydrogène vert + IoT)
→ SNCF (solutions digitales)

Pourquoi l'industrie :
Différent du web classique.
Contraintes réelles, impact physique, responsabilité.

Mon profil :
Dev web expérimenté qui veut découvrir l'industriel tech.

Ces entreprises recrutent des stagiaires dev ?
Contactez-moi.`,
    type: "internship_search",
    hashtags: "#Industry #Alstom #Belfort"
  },
  
  {
    content: `Stage dev : flexible sur la stack, pas sur la culture.

Je peux apprendre :
→ N'importe quel framework JS
→ Nouveau langage backend
→ Nouvelles technos

Je ne peux PAS apprendre :
→ Dans une culture toxique
→ Sans feedback ni guidance
→ Sur des projets sans sens

Mes critères :
✅ Équipe bienveillante
✅ Communication transparente
✅ Droit à l'erreur (j'apprends)
✅ Objectifs clairs

La stack s'apprend. La culture non.

Votre boîte coche ces cases ?`,
    type: "internship_search",
    hashtags: "#Culture #Internship #Values"
  },
  
  {
    content: `Dernier appel : stage dev avril-juin 2025.

Situation :
→ Candidatures envoyées : 15
→ Réponses : 3
→ Entretiens : 1
→ Offres : 0 (encore)

Réalité du marché :
Trouver un stage = aussi difficile qu'un CDI.

Mon approche maintenant :
→ Réseau > candidatures classiques
→ Montrer mes projets concrets
→ Contacter directement les CTOs

Si vous connaissez une boîte qui cherche un stagiaire dev :
Je suis là. Motivé. Compétent. Prêt.

Merci de partager.`,
    type: "internship_search",
    hashtags: "#StageRecherche #Help #Developer"
  },
  
  // ========== LOCAL_INDUSTRY (10 posts) ==========
  
  {
    content: `Belfort et la tech industrielle, ça fait sens.

Découverte :
→ Alstom (trains connectés)
→ General Electric (énergie)
→ McPhy (hydrogène vert + IoT)
→ Peugeot à 30 min (digital factory)

Tous dans un rayon de 20 km.

Ce qui m'intéresse :
C'est pas que du web.
Systèmes embarqués, IoT, temps réel, sécurité critique.

La différence ?
Un bug dans une app web = gênant.
Un bug dans un système ferroviaire = grave.

Des devs qui bossent dans l'industrie locale ?`,
    type: "local_industry",
    hashtags: "#Belfort #IndustrieTech #Innovation"
  },
  
  {
    content: `Alstom Belfort recrute des devs pour systèmes de signalisation.

Stack mentionnée :
→ C++ (temps réel)
→ Python (data processing)
→ Systèmes critiques

Challenge :
Code qui doit marcher. Toujours. Sans exception.

Différent de mes projets freelance où :
→ Bug = je corrige rapidement
→ Pas de vie en jeu

L'industrie tech = autre niveau de responsabilité.

Ça me tente pour un stage.

Vous avez déjà bossé sur du code critique ?`,
    type: "local_industry",
    hashtags: "#Alstom #CriticalSystems #Belfort"
  },
  
  {
    content: `McPhy (hydrogène vert) cherche des profils IoT + cloud.

Projet :
Digitaliser leur chaîne de production d'hydrogène.

Technologies :
→ Capteurs IoT
→ Cloud (Azure mentionné)
→ Data analytics
→ Dashboards temps réel

C'est le genre de projets qui mélangent :
→ Dev classique (web/cloud)
→ Hardware (capteurs)
→ Impact environnemental (hydrogène vert)

Green tech + industrie = futur.

Des retours d'expérience sur ces boîtes ?`,
    type: "local_industry",
    hashtags: "#McPhy #GreenTech #IoT"
  },
  
  {
    content: `Peugeot Sochaux (30 min de Belfort) développe de la maintenance prédictive.

Concept :
→ Capteurs sur machines de prod
→ IA pour prédire pannes avant qu'elles arrivent
→ Maintenance planifiée vs d'urgence

Technos :
→ IoT (capteurs)
→ Machine Learning (prédiction)
→ Data analytics
→ Dashboards

Use case concret :
Détecter qu'une machine va tomber en panne dans 3 jours.
Intervenir avant = économie massive.

L'industrie 4.0 = passionnant.

Vous bossez dans l'industrie manufacturière ?`,
    type: "local_industry",
    hashtags: "#Peugeot #Industry40 #AI"
  },
  
  {
    content: `Belfort = ancien bastion industriel en reconversion tech.

Histoire :
→ Alstom depuis toujours (trains)
→ General Electric (turbines)
→ Maintenant : digitalisation massive

Opportunités :
→ Industrie qui recrute des devs
→ Pas que du web, IoT et embarqué
→ Projets concrets avec impact physique

Pourquoi c'est cool :
Belfort c'est pas Paris/Lyon.
Mais les projets tech sont là.
Moins de concurrence, plus d'opportunités.

Les dev de Belfort, on se connecte ?`,
    type: "local_industry",
    hashtags: "#Belfort #TechLocal #Opportunities"
  },
  
  {
    content: `SNCF développe des solutions digitales à Belfort.

Projets :
→ Apps de maintenance trains
→ Systèmes de gestion de flotte
→ Outils internes digitalisation

Ce qui m'intrigue :
C'est du développement "normal" (web/mobile).
Mais avec contraintes industrielles.

Exemple :
App de maintenance doit marcher :
→ Offline (tunnels, zones blanches)
→ Sur tablettes durcies
→ Avec gants (interface adaptée)

Dev web + contraintes industrielles = nouveau challenge.

Vous avez développé pour l'industrie ?`,
    type: "local_industry",
    hashtags: "#SNCF #Railway #Digital"
  },
  
  {
    content: `Visite d'un FabLab à Belfort cette semaine.

Découverte :
→ Imprimantes 3D
→ Découpe laser
→ Arduino/Raspberry Pi
→ Prototypage rapide

Lien avec le dev :
→ IoT (programmer des capteurs)
→ Prototypage d'idées
→ Hardware + software

Projet perso qui me tente :
Créer un objet connecté simple.
Capteur température + alerte sur app.

Hardware + code = combo puissant.

Vous faites du hardware ?`,
    type: "local_industry",
    hashtags: "#FabLab #IoT #Belfort"
  },
  
  {
    content: `Belfort accueille un hackathon industrie 4.0 le mois prochain.

Thème :
Solutions digitales pour l'industrie locale.

Challenges :
→ Maintenance prédictive
→ Optimisation production
→ Réduction impact environnemental

Participants :
Étudiants + professionnels + entreprises locales.

Je vais y participer.

Hackathons = meilleures façons de :
→ Résoudre vrais problèmes
→ Networker
→ Apprendre en accéléré

Vous faites des hackathons ?`,
    type: "local_industry",
    hashtags: "#Hackathon #Industry #Belfort"
  },
  
  {
    content: `Nord Franche-Comté = écosystème tech sous-estimé.

Chiffres :
→ 15+ entreprises tech/industrie
→ Milliers d'emplois tech
→ Formation BUT Informatique sur place
→ Proximité Suisse/Allemagne

Avantages :
→ Coût de la vie < Paris
→ Qualité de vie
→ Opportunités réelles
→ Moins de concurrence

Inconvénients :
→ Moins visible que grandes métropoles
→ Écosystème startup limité

Mais pour débuter une carrière tech : très viable.

Devs de province, votre retour ?`,
    type: "local_industry",
    hashtags: "#TechLocal #FrancheComté #Career"
  },
  
  {
    content: `Rencontre avec un ingénieur Alstom cette semaine.

Insights :
→ "On cherche des devs qui comprennent l'industriel"
→ Stack : C++, Python, systèmes temps réel
→ Process rigoureux (aéronautique/ferroviaire)
→ Tests exhaustifs obligatoires

Différence web vs industrie :
→ Web : ship fast, fix later
→ Industrie : test everything, ship when perfect

Mindset différent.

Apprendre l'industriel = élargir ses horizons.

Ça vous tente le dev industriel ?`,
    type: "local_industry",
    hashtags: "#Engineering #Industry #Career"
  }
  
];





