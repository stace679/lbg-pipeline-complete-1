// This adds a quality gate that aborts the pipeline if the quality threshold isn't met
// This adds an npm install and test stage
pipeline {
  agent any

  stages {
    stage('Checkout') {
        steps {
          // Get some code from a GitHub repository
          git branch: 'main', url: 'https://github.com/QA-Instructor/lbg-vat-calculator.git'
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
}
}