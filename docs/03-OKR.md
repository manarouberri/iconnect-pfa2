# OKR — PFA2 PMS iConnect-hotel Sécurisé

## Objectif 1 — Garantir une démarche Security by Design crédible et démontrable

- **KR1** : 100% des modules fonctionnels du PMS (Reservations, Guests, Companies, Reports, Logs, Expenses, Paramètres) couverts par au moins une abuse story documentée
- **KR2** : Au moins 15 tests de sécurité exécutés et documentés (manuels + automatisés)
- **KR3** : Guide de sécurité et rapport d'audit finalisés et validés par l'encadrant avant la soutenance

## Objectif 2 — Mettre en place un pipeline DevSecOps opérationnel

- **KR1** : Pipeline GitHub Actions fonctionnel déclenché à chaque push (Build, SAST, scan dépendances, détection secrets)
- **KR2** : 0 vulnérabilité critique non traitée dans le code du démonstrateur au moment de la soutenance
- **KR3** : Historique Git démontrant au moins 3 itérations de correction suite à une alerte du pipeline

## Objectif 3 — Démontrer la robustesse du démonstrateur d'authentification

- **KR1** : 2FA fonctionnel et non contournable via appel direct à l'API
- **KR2** : Logs immuables (hash-chaining ou horodatage vérifiable) résistants à une tentative de modification directe en base
- **KR3** : Aucune vulnérabilité OWASP Top 10 critique détectée lors du scan final
