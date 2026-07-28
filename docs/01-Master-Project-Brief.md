Master Project Brief
Développement d'un Property Management System (PMS)
Sécurisé – Iconnect-hotel

1. Vision et Objectif du Projet

Le présent projet a pour objectif de concevoir, développer et documenter un Property Management
System (PMS) moderne, destiné au Palais Riad El Arsat, permettant de centraliser l'ensemble des
opérations hôtelières tout en intégrant une approche Security by Design (DevSecOps).


Le système devra assurer :


      • la gestion complète des réservations ;
      • l'administration des séjours des clients ;
      • la gestion financière et comptable ;
      • une traçabilité complète des opérations ;
      • un niveau élevé de sécurité garantissant la confidentialité, l'intégrité et la disponibilité des
        données.

L'objectif est de proposer une plateforme fiable, performante et conforme aux bonnes pratiques
internationales en matière de cybersécurité.




2. Méthodologie de Gestion du Projet
Le projet est conduit selon une méthodologie Agile, articulée autour de quatre phases principales.


Phase 1 – Opportunité
Cette première étape consiste à définir la vision globale du projet.


Les livrables sont :


      • Agile Business Case
      • Value Stream
      • Product Vision
      • Identification des parties prenantes
      • Analyse des besoins métiers




Phase 2 – Cadrage
Cette phase permet de préparer le développement.




                                                       1
Les activités comprennent :


     • définition des rôles (RACI Matrix) ;
     • définition des OKR (Objectives & Key Results) ;
     • création de la Story Map ;
     • élaboration de la Product Roadmap ;
     • priorisation du Product Backlog ;
     • définition des critères d'acceptation.




Phase 3 – Exécution
Le développement est organisé en Sprints de quatre semaines.


Chaque Sprint comprend :


     • Sprint Planning
     • Daily Scrum
     • Sprint Review
     • Sprint Retrospective
     • suivi de la vélocité (Burndown Chart)
     • suivi du Team Mood
     • mise à jour du Product Backlog




Phase 4 – RUN
Après la mise en production, le système entre dans une phase de maintenance continue.


Cette phase comprend :


     • gestion des incidents ;
     • correction des anomalies ;
     • amélioration continue ;
     • maintenance évolutive ;
     • suivi des performances ;
     • supervision de la sécurité.




3. Périmètre Fonctionnel
Le PMS doit intégrer les modules suivants.


3.1 Dashboard
Le Dashboard fournit une vue analytique de l'activité de l'hôtel :


     • taux d'occupation ;




                                                     2
     • revenus ;
     • réservations ;
     • statistiques principales.




3.2 Stay View
Gestion des séjours :


     • check-in ;
     • check-out ;
     • prolongation des séjours ;
     • changement de chambre.




3.3 Rooms View
Gestion des chambres :


     • chambres disponibles ;
     • chambres occupées ;
     • chambres sales ;
     • chambres propres ;
     • maintenance.




3.4 Réservations
Le système doit permettre :


     • réservation individuelle ;
     • réservation de groupe ;
     • réservation Complimentary ;
     • réservation Walk-in ;
     • modification et annulation ;
     • mise hors service (Out of Order).




3.5 Gestion des Clients (Guests)
Fonctionnalités :


     • fiche client complète ;
     • historique des séjours ;
     • préférences ;
     • documents d'identité ;
     • fidélité.




                                           3
3.6 Companies
Le module Companies permet de gérer les entreprises partenaires, les sociétés clientes et les
organisations ayant une relation commerciale avec l'hôtel.


Il offre les fonctionnalités suivantes :


      • création et gestion des fiches entreprises ;
      • enregistrement des informations de contact (nom, adresse, téléphone, e-mail) ;
      • association des réservations à une entreprise ;
      • gestion des contrats et des tarifs négociés ;
      • suivi des comptes débiteurs et des paiements ;
      • consultation de l'historique des réservations liées à chaque société ;
      • suivi des statistiques par entreprise.

Ce module facilite la collaboration avec les agences de voyages, les entreprises clientes et les
partenaires professionnels en centralisant toutes les informations nécessaires à la gestion commerciale.




3.7 Expenses
Gestion des dépenses :


      • dépenses internes ;
      • fournisseurs ;
      • suivi budgétaire ;
      • validation.




3.8 Reports
Le module Reports (Rapports) dans le système PMS d'iConnect-hotel est un outil de gestion analytique
essentiel qui transforme les données transactionnelles quotidiennes en rapports structurés pour le
pilotage de l'établissement.


Voici en détail ce que fait ce module et comment il fonctionne :


1. Génération de Rapports Personnalisés

Le module permet de créer divers types de documents selon les besoins opérationnels et financiers du
Palais Riad El Arsat :


      • Rapports d'activité : il génère des listes précises comme le Arrival Report (indispensable
        chaque matin pour préparer les check-in), les départs, ou le statut des chambres.
      • Rapports financiers : il permet de suivre les revenus, le chiffre d'affaires et les encaissements.
      • Rapport de clôture journalière : ce rapport spécifique offre un résumé quotidien incluant le
        taux d'occupation, le prix moyen par chambre (ARR), les ventes totales et le détail des recettes
        par mode de paiement.




                                                     4
2. Fonctionnalités de Filtrage et de Recherche

Pour obtenir des données précises, l'utilisateur peut configurer plusieurs paramètres :


      • Select Report : un menu déroulant pour choisir le modèle de rapport souhaité.
      • Période temporelle : définition d'une plage de dates spécifique (From Date / To Date) pour
        l'analyse.
      • Filtres complémentaires : possibilité de rechercher un client précis à l'intérieur d'un rapport
        généré (Search Guest).

3. Analyse et Exportation des Données

Une fois les critères soumis, le système traite les informations pour offrir une visibilité immédiate :


      • Consultation en temps réel : les résultats s'affichent à l'écran pour une vérification rapide.
      • Exportation Excel : un bouton Download Excel (ou CSV) permet d'extraire les données pour un
        archivage, un traitement comptable externe ou une analyse statistique approfondie.

4. Utilité Opérationnelle

En résumé, ce module sert de levier pour un pilotage efficace en permettant à la réception et à la
direction de :


      • anticiper les flux de clients ;
      • surveiller les performances financières (revenus et impayés) ;
      • garantir la transparence grâce à la journalisation des activités ;
      • prendre des décisions basées sur des chiffres réels plutôt que sur des suppositions.

Conseil pratique : si un rapport affiche le message « Report Not Available !!! », vérifiez que la période
choisie contient bien des données enregistrées dans le système.




4. Architecture DevSecOps
La sécurité est intégrée dès la phase de conception selon le principe Security by Design.


Authentification
Le système doit intégrer :


      • chiffrement des mots de passe ;
      • politique de mots de passe forts ;
      • authentification à deux facteurs (2FA) ;
      • gestion des sessions sécurisées.




                                                     5
Journalisation (Logs)
Chaque opération doit être enregistrée avec :


      • Date
      • Heure
      • Utilisateur
      • Adresse IP
      • Module
      • Action
      • Ancienne valeur
      • Nouvelle valeur
      • Changed By

Ces journaux doivent être immuables et exploitables pour les audits de sécurité.




Pipeline DevSecOps
Chaque Push GitHub déclenche automatiquement les contrôles suivants :


    1. Build Frontend
    2. Build Backend
    3. Analyse de qualité du code
    4. Analyse des vulnérabilités
    5. Vérification OWASP Top 10

La Definition of Done n'est atteinte que lorsque l'ensemble des contrôles est validé.




Défense Active
Le système doit intégrer :


      • détection des comportements anormaux ;
      • analyse automatique des logs ;
      • génération d'alertes de sécurité ;
      • blocage des attaques DoS ;
      • surveillance en temps réel.

L'objectif est de garantir une disponibilité minimale de 99,9 %.




5. Livrables
Les principaux livrables du projet sont :


      • Agile Business Case
      • Product Vision




                                                     6
     • Value Stream
     • Story Mapping
     • Product Roadmap
     • Product Backlog
     • RACI Matrix
     • OKR
     • Documentation fonctionnelle
     • Documentation technique
     • Documentation DevSecOps
     • Manuel utilisateur
     • Guide d'administration
     • Guide de sécurité
     • Plan de tests
     • Rapports d'audit
     • Manuel de formation




6. Suivi Opérationnel
Le suivi du projet comprend :


     • validation des documents avant chaque développement ;
     • mise à jour hebdomadaire du Product Backlog ;
     • génération des rapports d'avancement ;
     • conservation des journaux d'activité ;
     • suivi des incidents ;
     • amélioration continue.




7. Roadmap E-learning
Une plateforme de formation est mise en place dès la finalisation de la Product Roadmap afin
d'accompagner les utilisateurs.


Les modules proposés sont :


     • Introduction au PMS
     • Gestion des réservations
     • Gestion des chambres
     • Check-in / Check-out
     • Gestion des Companies
     • Utilisation des Reports
     • Gestion des dépenses
     • Sécurité informatique
     • Authentification 2FA
     • Sensibilisation au phishing
     • Bonnes pratiques de cybersécurité
     • Utilisation des Logs
     • Procédures d'urgence



                                                  7
• Évaluation finale et certification




                                       8

