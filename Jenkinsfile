pipeline {
    // 1. Evitamos que todo el pipeline corra dentro de Node
    agent none 

    stages {
        stage('Instalar dependencias') {
            // 2. Usamos Node solo para esta etapa
            agent { 
                docker { image 'node:20-alpine' } 
            }
            steps {
                sh 'rm -rf node_modules package-lock.json'
                sh 'npm cache clean --force'
                sh 'npm install --no-audit --no-fund'
            }
        }
        
        stage('Ejecutar tests') {
            // Usamos Node de nuevo para los tests
            agent { 
                docker { image 'node:20-alpine' } 
            }
            steps {
                sh 'npm test'
            }
        }
        
        stage('Construir Imagen Docker') {
            // 3. Volvemos al entorno nativo de Jenkins
            agent any 
            steps {
                // Nuevo nombre de imagen: pasteleria-app
                sh 'docker build -t pasteleria-app:latest .'
            }
        }
        
        stage('Ejecutar Contenedor') {
            agent any 
            steps {
                // Destruir contenedor anterior si existe
                sh 'docker rm -f contenedor-pasteleria || true'
                // Crear el nuevo contenedor con los nuevos nombres
                sh 'docker run -d -p 3000:3000 --name contenedor-pasteleria pasteleria-app:latest'
            }
        }
    }
}