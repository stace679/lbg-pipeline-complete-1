pipeline{
 environment {
 registry = "victorialloyd/vat-calculator-demo"
        registryCredentials = "dockerhub_id"
        dockerImage = ""
    }
    agent any
        stages {
            stage('Checkout Code') {
                steps {
                // Get some code from a GitHub repository
                git branch: 'main', url: 'https://github.com/QA-Instructor/lbg-pipeline-complete-1.git'
                }
            }
            stage('Install Dependencies') {
                steps {
                // Install the ReactJS dependencies
                sh "npm install"
                }
            }
            stage('Run Tests') {
                steps {
                // Run the ReactJS tests
                sh "npm test"
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
            stage ("Stop and remove existing container"){
                steps {
                    script {
                        sshPublisher(publishers: [sshPublisherDesc(configName: 'targetDeploymentServer', 
                        transfers: [sshTransfer(cleanRemote: false, excludes: '', 
                        execCommand: 'docker stop deployed-vat-calc && docker rm deployed-vat-calc || true', 
                        execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, 
                        patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', 
                        sourceFiles: '')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, 
                        verbose: false)])
                    }
                }
            }
             stage ("Pull latest image"){
                steps {
                    script {
                        sshPublisher(publishers: [sshPublisherDesc(configName: 'targetDeploymentServer', 
                        transfers: [sshTransfer(cleanRemote: false, excludes: '', 
                        execCommand: 'docker pull victorialloyd/vat-calculator-demo:latest', 
                        execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, 
                        patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', 
                        sourceFiles: '')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, 
                        verbose: false)])
                    }
                }
             }
            stage ("Deploy to target GCP VM"){
                steps {
                    script {
                        sshPublisher(publishers: [sshPublisherDesc(configName: 'targetDeploymentServer', 
                        transfers: [sshTransfer(cleanRemote: false, excludes: '', 
                        execCommand: 'docker run --name deployed-vat-calc -d -p 8000:80 victorialloyd/vat-calculator-demo:latest', 
                        execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, 
                        patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: '', 
                        sourceFiles: '')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, 
                        verbose: false)])
                    }
                }
            }
            stage ("Clean up unused images"){
                steps {
                    script {
                        sh 'docker image prune --all --force --filter "until=48h"'
                        sh 'docker rmi $(docker images --filter "dangling=true" -q)'
                           }
                }
            }
        }
}
