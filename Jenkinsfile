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
                // Cloning manually with credentials
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Aman-S-07/Team-dashboard.git',
                        credentialsId: '6ce21b84-57b0-46ef-a9f7-4e84f813939e'
                    ]]
                ])
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def image = docker.build("${IMAGE_NAME}")
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
