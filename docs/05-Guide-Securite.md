# Guide de Sécurité — PMS iConnect-hotel

## 1. Principes directeurs (Security by Design)

- **Confidentialité** : chiffrement des données sensibles (CIN, passeport, coordonnées bancaires) au repos et en transit (TLS obligatoire)
- **Intégrité** : logs immuables, validation systématique côté serveur (jamais confiance dans les données envoyées par le client)
- **Disponibilité** : objectif SLA 99,9%, protection anti-DoS, monitoring temps réel

## 2. Authentification

| Contrôle | Implémentation recommandée |
|---|---|
| Hashage des mots de passe | bcrypt (coût ≥ 12) ou Argon2 — jamais MD5/SHA1 en clair |
| Politique de mot de passe | 12 caractères min, complexité, vérification contre listes de mots de passe compromis (ex: Have I Been Pwned API) |
| 2FA | TOTP (Google Authenticator / Authenticator App), vérifié côté serveur uniquement |
| Gestion de session | JWT à courte durée de vie + refresh token, cookies `HttpOnly` + `Secure` + `SameSite=Strict` |
| Verrouillage de compte | Après 5 tentatives échouées, verrouillage temporaire + alerte |

## 3. Journalisation (Logs)

Chaque opération enregistrée avec : Date, Heure, Utilisateur, Adresse IP, Module, Action, Ancienne valeur, Nouvelle valeur, Changed By.

**Immuabilité** : chaque entrée de log contient le hash de l'entrée précédente (hash-chaining, principe proche d'une blockchain simplifiée), rendant toute modification a posteriori détectable.

## 4. Pipeline DevSecOps

Chaque push déclenche :
1. Build Frontend / Backend
2. Analyse de qualité du code
3. SAST (Semgrep)
4. Détection de secrets (Gitleaks)
5. Scan des dépendances (npm audit)
6. Vérification OWASP Top 10

**Definition of Done** : aucune vulnérabilité critique ou haute non résolue.

## 5. OWASP Top 10 — Points de vigilance spécifiques au PMS

| Risque OWASP | Application au PMS iConnect-hotel |
|---|---|
| A01 - Broken Access Control | IDOR sur les Booking ID / Guest ID, accès non autorisé aux données d'un autre établissement |
| A02 - Cryptographic Failures | Données CIN/passeport/bancaires non chiffrées au repos |
| A03 - Injection | Champs de saisie (Guest Name, Comments, Special Request) non paramétrés |
| A05 - Security Misconfiguration | Endpoints API exposés sans authentification (ex: Reports, Logs) |
| A07 - Identification and Authentication Failures | 2FA contournable, sessions non expirées |
| A08 - Software and Data Integrity Failures | Logs modifiables, absence de vérification d'intégrité |
| A09 - Security Logging and Monitoring Failures | Logs incomplets, absence de détection d'anomalies |

## 6. Défense active

- Détection de comportements anormaux (ex: connexions à des horaires inhabituels, volume de requêtes anormal sur "Guests")
- Alertes automatiques en cas de tentative de modification des logs
- Rate limiting sur les endpoints sensibles (recherche clients, authentification)

## 7. Recommandations pour les intégrations tierces (Paramètres → BE, POS, WhatsApp)

- Clés API stockées en variables d'environnement, jamais en dur dans le code
- Rotation régulière des secrets
- Scope minimal des permissions accordées à chaque intégration
