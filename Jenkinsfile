pipeline {
    environment {
        NAME = 'test_marisail'
    }

    agent any
    stages {

        stage('🚚 Cloning our Git...') {
            steps {
                git branch: 'test', url: 'https://github.com/SteveBrown12/Marisail.git'
            }
        }

        stage('🏗️ Building Docker Image...') {
            steps {
                echo "------------ Building Frontend Image ------------"
                sh "docker build -t ${NAME}_frontend_${env.BUILD_NUMBER} -f Dockerfile.frontend ."

                echo "------------ Building Backend Image ------------"
                sh "docker build -t ${NAME}_backend_${env.BUILD_NUMBER} -f node-api/Dockerfile.backend ./node-api"
            }
        }

        stage('🚧 Deployment in Progress...') {
            steps {
                script {
                    def prevBuild = env.BUILD_NUMBER.toInteger() - 1
                    sh "docker stop ${NAME}_frontend_${prevBuild} || true"
                    sh "docker stop ${NAME}_backend_${prevBuild} || true"

                    echo '---------- Running Frontend Container ----------'
                    def frontendDeployStatus = sh(script: """
                        set -a
                        . /var/lib/jenkins/workspace/${NAME}/.env
                        docker run -dit -p 4173:4173 --name ${NAME}_frontend_${env.BUILD_NUMBER} ${NAME}_frontend_${env.BUILD_NUMBER}
                        set +a
                    """, returnStatus: true)

                    echo '--------- Running Backend Container ---------'
                    def backendDeployStatus = sh(script: """
                        set -a
                        . /var/lib/jenkins/workspace/${NAME}/node-api/.env
                        docker run -dit -p 3006:3006 --name ${NAME}_backend_${env.BUILD_NUMBER} ${NAME}_backend_${env.BUILD_NUMBER}
                        set +a
                    """, returnStatus: true)

                    if (frontendDeployStatus != 0 || backendDeployStatus != 0) {
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }

        stage('🧹 Clean up dawg...') {
            steps {
                script {
                    sh "docker container prune -f || true"
                    sh "docker image prune -a -f || true"
                }
            }
        }

        stage('_____________________________________________') {
            steps {
                script {
                    if (currentBuild.result == 'FAILURE') {
                        echo '🚨 Deployment Failed 🚨'
                    } else {
                        echo '🎉 Deployment Successful! 🎉'
                    }
                }
            }
        }
    }
}
