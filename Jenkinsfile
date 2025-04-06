pipeline {
    agent any

    environment {
        IMAGE_NAME = 'team-dashboard-image'
        CONTAINER_NAME = 'team-dashboard-container'
        APP_PORT = '3000'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git 'https://github.com/Aman-S-07/Team-dashboard.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}")
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    sh "docker run -d -p ${APP_PORT}:${APP_PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}"
                }
            }
        }
    }
}

