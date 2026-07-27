# PFA2 — Sécurisation DevSecOps du PMS iConnect-hotel

**Projet de Fin d'Année 2 — Cybersécurité**
Cas d'usage : PMS iConnect-hotel (Palais Riad El Arsat)

## 🎯 Objectif du projet

Ce projet ne vise pas à recréer le PMS iConnect-hotel (produit déjà existant, développé par IT Cyber Consulting), mais à :

1. **Auditer** la sécurité de son architecture fonctionnelle (authentification, gestion des données clients, traçabilité)
2. **Concevoir et démontrer** une démarche Security by Design / DevSecOps applicable à ce type de système
3. **Développer un démonstrateur** (backend d'authentification sécurisée + logs immuables) illustrant les recommandations
4. **Mettre en place un pipeline CI/CD** (GitHub Actions) intégrant des contrôles de sécurité automatisés à chaque `push`

## 📁 Structure du dépôt

```
iconnect-pfa2/
├── docs/                          # Documentation du projet
│   ├── 01-Master-Project-Brief.md
│   ├── 02-RACI-Matrix.md
│   ├── 03-OKR.md
│   ├── 04-Abuse-Stories-Securite.md
│   └── 05-Guide-Securite.md
├── backend/                       # Démonstrateur (auth sécurisée + logs)
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
├── .github/workflows/
│   └── devsecops.yml              # Pipeline CI/CD sécurité
└── README.md
```

## 🔒 Démarche Security by Design

Chaque fonctionnalité du PMS (voir `docs/01-Master-Project-Brief.md`) est associée à des **abuse stories** (scénarios d'attaque) documentées dans `docs/04-Abuse-Stories-Securite.md`, testées manuellement et/ou automatiquement via le pipeline.

## ⚙️ Pipeline DevSecOps

À chaque `push` sur GitHub, le pipeline exécute automatiquement :
- **SAST** (analyse statique du code) — Semgrep
- **Détection de secrets** — Gitleaks
- **Scan des dépendances vulnérables** — npm audit
- **Vérification OWASP Top 10** (checklist + rapport)

Le build échoue si une vulnérabilité critique est détectée (Definition of Done).

## 🚀 Démarrer le backend en local

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## 👤 Auteure

Manar Ouberri — PFA2 Cybersécurité
