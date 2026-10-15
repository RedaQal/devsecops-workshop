pipeline {
    agent any

    environment {
        IMAGE_NAME     = 'devsecops-app'
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = 'devsecops-staging'
        DOCKER_NETWORK = 'devsecops'
        SONAR_HOST_URL = 'http://sonarqube:9000'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }

        stage('SAST') {
            parallel {

                stage('SonarQube') {
                    steps {
                        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                            sh '''
                                sonar-scanner \
                                  -Dsonar.host.url="$SONAR_HOST_URL" \
                                  -Dsonar.token="$SONAR_TOKEN"
                            '''
                        }
                    }
                }

                stage('Semgrep') {
                    steps {
                        // Pas de --error pour l'instant: on observe les résultats sans bloquer le pipeline
                        sh '''
                            semgrep scan \
                              --config p/default \
                              --config p/nodejs \
                              --config p/owasp-top-ten \
                              --metrics=off \
                              --exclude node_modules --exclude .next \
                              --json-output=semgrep-report.json \
                              --sarif-output=semgrep.sarif \
                              .
                        '''
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Deploy Staging') {
            steps {
                sh '''
                    docker rm -f ${CONTAINER_NAME} || true
                    docker run -d \
                      --name ${CONTAINER_NAME} \
                      --network ${DOCKER_NETWORK} \
                      -p 3001:3000 \
                      ${IMAGE_NAME}:${IMAGE_TAG}

                    echo "Attente du démarrage de l'application..."
                    for i in $(seq 1 20); do
                      if curl -sf http://${CONTAINER_NAME}:3000/ > /dev/null; then
                        echo "Staging OK -> http://localhost:3001"
                        exit 0
                      fi
                      sleep 3
                    done
                    echo "Le staging n'a pas démarré"
                    docker logs ${CONTAINER_NAME}
                    exit 1
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'semgrep-report.json,semgrep.sarif', allowEmptyArchive: true
        }
    }
}
