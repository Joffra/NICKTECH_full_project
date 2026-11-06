# NICKTECH — Site + API Java
Projet de base complet :
- Frontend HTML/CSS/JavaScript
- Backend Java 21 + Spring Boot
- Spring Data JPA
- Spring Security (structure prête)
- MySQL
- Login / Register / Logout
- Gestion utilisateurs, formations, événements, inscriptions et messages

## Démarrage
1. Installer Java 21, Maven et MySQL.
2. Créer la base avec `database/nicktech.sql`.
3. Modifier `backend/nicktech-api/src/main/resources/application.properties`.
4. Ouvrir `backend/nicktech-api` dans VS Code/IntelliJ.
5. Exécuter `mvn spring-boot:run`.
6. Ouvrir `frontend/index.html`.

Note : les endpoints d'authentification sont préparés comme structure de projet; avant une mise en production, il faut ajouter JWT/hashage des mots de passe et les règles Spring Security complètes.
