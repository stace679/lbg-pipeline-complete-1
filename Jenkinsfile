pipeline{
 environment {
 registry = "victorialloyd/vatcal"
        registryCredentials = "dockerhub_id"
        dockerImage = ""
    }
    agent any
        stages {
            stage('Checkout') {
        steps {
          // Get some code from a GitHub repository
          git branch: 'main', url: 'https://github.com/QA-Instructor/lbg-pipeline-complete-1.git'
        }
    }
            stage('SonarQube Analysis') {
            environment {
                scannerHome = tool 'sonarqube'
            }
                steps {
                    withSonarQubeEnv('sonar-qube-1') {        
                    sh "${scannerHome}/bin/sonar-scanner"
                }
                timeout(time: 10, unit: 'MINUTES'){
                waitForQualityGate abortPipeline: true
                }
            }
        }
        stage('Install') {
                steps {
                // RInstall the ReactJS dependencies
                sh "npm install"
                }
            }
            stage('Test') {
                steps {
                // Run the ReactJS tests
                sh "npm test"
                }
            }
            stage ('Build Docker Image'){
                steps{
                    script {
                        dockerImage = docker.build(registry)
                    }
                }
            }

            stage ("Push to Docker Hub"){
                steps {
                    script {
                        docker.withRegistry('', registryCredentials) {
                            dockerImage.push("${env.BUILD_NUMBER}")
                            dockerImage.push("latest")
                        }
                    }
                }
            }

            stage ("Clean up"){
                steps {
                    script {
                        sh 'docker image prune --all --force --filter "until=48h"'
                           }
                }
            }
        }
}
