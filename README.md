# DevSecOps Workshop

Application Next.js **volontairement vulnérable** + pipeline Jenkins (SonarQube + Semgrep).
⚠️ Ne jamais déployer en production.

## 1. Démarrer l'infra

```bash
# Linux uniquement (requis par SonarQube/Elasticsearch)
sudo sysctl -w vm.max_map_count=262144

docker compose up -d --build
```

| Service   | URL                   | Accès initial                                  |
|-----------|-----------------------|------------------------------------------------|
| Jenkins   | http://localhost:8080 | mot de passe: `docker logs jenkins`            |
| SonarQube | http://localhost:9000 | admin / admin (changement demandé au 1er login)|
| Staging   | http://localhost:3001 | créé par le pipeline                           |

## 2. Configurer Jenkins

1. Terminer l'assistant d'installation (les plugins nécessaires sont déjà préinstallés).
2. SonarQube: *My Account > Security > Generate Tokens* (type *User*) et copier le token.
3. Jenkins: *Manage Jenkins > Credentials > Global > Add Credentials*
   - Kind: **Secret text**, Secret: le token Sonar, ID: **`sonar-token`**
4. Pousser ce projet sur un dépôt Git (GitHub, Gitea...).
5. Jenkins: *New Item > Pipeline > Pipeline script from SCM* > Git > URL du dépôt, branche, Script Path `Jenkinsfile`.
6. *Build Now*.

## 3. Pipeline

`Checkout` > `Install & Build` > `SAST (SonarQube || Semgrep)` > `Docker Build` > `Deploy Staging`

- Rapports Semgrep: artefacts du build (`semgrep-report.json`, `semgrep.sarif`)
- Rapport Sonar: http://localhost:9000, projet `devsecops-workshop`

## 4. Vulnérabilités plantées

| Vulnérabilité               | Fichier                          | Test manuel                                                    |
|-----------------------------|----------------------------------|----------------------------------------------------------------|
| SQL injection (auth bypass) | `app/api/login/route.js`         | user: `admin' --`, mot de passe quelconque                     |
| SQL injection (UNION)       | `app/api/search/route.js`        | `' UNION SELECT id, username, password FROM users --`          |
| XSS stocké                  | `app/comments/page.js`           | commentaire: `<img src=x onerror=alert(1)>`                    |
| Command injection           | `app/api/ping/route.js`          | `/api/ping?host=127.0.0.1;id`                                  |
| Path traversal              | `app/api/file/route.js`          | `/api/file?name=../../package.json`                            |
| Secrets en dur              | `lib/config.js`                  | -                                                              |
| Hash faible (MD5)           | `lib/crypto.js`                  | -                                                              |
| Cookie non sécurisé         | `app/api/login/route.js`         | -                                                              |
| Fuite d'erreur SQL          | `app/api/login/route.js`         | `'` dans le champ user                                         |
| Conteneur en root           | `Dockerfile`                     | (pour le futur scan d'image)                                   |

## 5. Lancer l'app sans Jenkins

```bash
npm install
npm run dev   # http://localhost:3000
```

## 6. Prochaines étapes (à ajouter au Jenkinsfile)

- Quality Gate Sonar (`-Dsonar.qualitygate.wait=true`) et `--error` sur Semgrep pour faire échouer le build
- Gitleaks (secrets), Trivy / npm audit (SCA + image), OWASP ZAP (DAST sur `http://devsecops-staging:3000`)
