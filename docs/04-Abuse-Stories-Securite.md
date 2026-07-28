# Abuse Stories & Tests de Sécurité — PMS iConnect-hotel
## Méthodologie pour ton PFA2

---

## 1. Le principe

Pour **chaque user story fonctionnelle** de ton Backlog, tu ajoutes une ou plusieurs **abuse stories** (scénario d'attaque associé) + le test de sécurité qui vérifie que le système résiste.

**Format d'une abuse story :**

> En tant qu'**attaquant** [profil], je veux **[action malveillante]** afin de **[objectif malveillant]**.
> → Comportement attendu : le système doit **[réaction de défense]**.
> → Test : **[type de test + outil]**.

Cette paire (user story + abuse story) devient une ligne de ton Backlog de sécurité, alimentée en Sprint comme le reste.

---

## 2. Grille par module (basée sur les fonctionnalités réelles d'iConnect-hotel)

### 🔐 Authentification / Accès

| User Story | Abuse Story | Comportement attendu | Test de sécurité |
|---|---|---|---|
| En tant qu'utilisateur, je me connecte avec mon compte | En tant qu'attaquant, je force le mot de passe par brute-force | Verrouillage du compte après N tentatives + alerte | Test automatisé (Hydra / script) + vérif logs |
| En tant qu'utilisateur, je reste connecté pendant ma session | En tant qu'attaquant, je vole/rejoue un token de session (session hijacking) | Expiration de session, régénération du token après login, cookie `HttpOnly`/`Secure` | Test manuel (Burp Suite) : rejouer un token expiré |
| En tant qu'admin, je configure le 2FA | En tant qu'attaquant, je contourne le 2FA (ex: en manipulant une requête API) | Le 2FA doit être vérifié côté serveur, jamais uniquement côté client | Test API (Postman/Burp) : appel direct de l'endpoint sans code 2FA |

### 🏨 Réservations (Stay View / New Reservation)

| User Story | Abuse Story | Comportement attendu | Test de sécurité |
|---|---|---|---|
| Je crée une réservation en saisissant le nom du client | En tant qu'attaquant, j'injecte du SQL/script dans le champ "Name" | Champ échappé/paramétré, aucune exécution | Test SAST (recherche requêtes non préparées) + test manuel (`' OR 1=1--`) |
| Je télécharge la pièce d'identité (Photo ID) du client | En tant qu'attaquant, j'upload un fichier `.php`/`.exe` déguisé en image | Validation du type MIME réel (pas juste l'extension), sandboxing du stockage | Test manuel : upload fichier malveillant renommé `.jpg` |
| Je modifie une réservation existante (Booking ID) | En tant qu'attaquant, je modifie l'ID dans l'URL pour accéder à la réservation d'un autre hôtel/client (IDOR) | Vérification systématique que l'utilisateur a bien le droit sur cette ressource | Test manuel : changer l'ID dans la requête, vérifier accès refusé |

### 👤 Guests (Fiches Clients)

| User Story | Abuse Story | Comportement attendu | Test de sécurité |
|---|---|---|---|
| Je recherche un client par nom/téléphone | En tant qu'attaquant, j'extrais massivement toute la base clients (scraping/énumération) | Rate limiting sur les requêtes de recherche, pagination obligatoire | Test de charge (script répétant la recherche) |
| Je stocke la pièce d'identité et les coordonnées bancaires | En tant qu'attaquant, j'accède à la base de données sans autorisation | Chiffrement des données sensibles at-rest (CIN, passeport) | Vérif config DB + test d'accès direct à la base |

### 🏢 Companies (comptes débiteurs)

| User Story | Abuse Story | Comportement attendu | Test de sécurité |
|---|---|---|---|
| Je consulte le "Total Outstanding" d'une entreprise | En tant qu'attaquant, je manipule le montant facturé via la console réseau (tampering) | Recalcul serveur systématique, jamais confiance dans une valeur envoyée par le client | Test Burp : intercepter et modifier la requête de facturation |

### 📊 Reports / Logs

| User Story | Abuse Story | Comportement attendu | Test de sécurité |
|---|---|---|---|
| J'exporte un rapport en Excel/CSV | En tant qu'attaquant, j'injecte une formule Excel malveillante (CSV Injection) dans un champ texte qui se retrouve dans l'export | Échappement des caractères `=`, `+`, `-`, `@` en début de cellule | Test manuel : créer une réservation avec `=CMD(...)` dans un champ, exporter |
| Je consulte les Logs pour audit | En tant qu'attaquant/utilisateur interne malveillant, je modifie ou supprime une entrée de log pour effacer une trace | Logs en écriture seule (append-only), hash-chaining ou horodatage signé | Test technique : tenter une modification directe en base, vérifier détection |
| Je vois la colonne "Changed By" | En tant qu'attaquant, j'utilise un compte partagé pour agir sans être identifiable | Un compte = un utilisateur, alerte sur connexions simultanées suspectes | Revue de la politique de gestion des comptes + test de connexions multiples |

### 💰 Expenses / Payments

| User Story | Abuse Story | Comportement attendu | Test de sécurité |
|---|---|---|---|
| J'ajoute une dépense avec un justificatif (Browse) | En tant qu'attaquant, j'upload un fichier piégé comme "justificatif" | Scan antivirus des fichiers uploadés, restriction des types (PDF/JPG uniquement) | Test manuel : upload fichier avec payload |
| J'enregistre un paiement (Cash/Card) | En tant qu'attaquant, je crée de fausses transactions pour blanchir/détourner des fonds | Contrôles de cohérence (montant ≤ solde dû), journalisation immuable | Test fonctionnel + revue des logs |

### ⚙️ Paramètres (Mon Iconnect-hôtel) — POS / BE / Delete Old Data

| User Story | Abuse Story | Comportement attendu | Test de sécurité |
|---|---|---|---|
| J'utilise "Delete Old Data" pour nettoyer la base | En tant qu'attaquant/erreur humaine, je supprime des données encore nécessaires (légal/comptable) | Confirmation multi-étapes + sauvegarde automatique avant suppression, droits restreints à un rôle admin | Test : tenter l'action avec un compte non-admin |
| Je configure l'intégration WhatsApp | En tant qu'attaquant, j'exploite une clé API WhatsApp mal protégée pour envoyer des messages/phishing au nom de l'hôtel | Clés API en variables d'environnement (jamais en dur), rotation régulière | Revue de code (recherche de secrets en clair) + scan avec `gitleaks`/`trufflehog` |

---

## 3. Comment l'intégrer à ton pipeline DevSecOps

| Type de test | Outil suggéré | Moment dans le pipeline |
|---|---|---|
| Analyse statique du code (SAST) | Semgrep, Bandit (Python), ESLint security plugin | À chaque push (avant merge) |
| Recherche de secrets en dur | Gitleaks, TruffleHog | À chaque push |
| Scan de vulnérabilités des dépendances | `npm audit`, OWASP Dependency-Check | À chaque push |
| Tests d'abuse stories manuels (IDOR, injection, upload) | Burp Suite (Community), Postman | Sprint Review / avant chaque mise en prod |
| Vérification OWASP Top 10 | Checklist manuelle + OWASP ZAP (scan dynamique) | Fin de sprint |

---

## 4. Comment le présenter au jury

Pour ta soutenance, ce tableau devient un **livrable à part entière** : "Registre des Abuse Stories & Tests de Sécurité". Tu peux montrer :
1. Une user story fonctionnelle (issue du Backlog du brief)
2. Son abuse story associée
3. La preuve du test (capture d'écran Burp, résultat de scan Semgrep, log du pipeline GitHub Actions qui a bloqué le build suite à une vulnérabilité détectée)

C'est exactement le genre de traçabilité "Security by Design" que ton brief mentionne déjà — tu ne fais que la rendre concrète et démontrable.
