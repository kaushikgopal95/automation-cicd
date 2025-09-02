# Professional Local CI/CD Pipeline Setup with Docker Hub

## Prerequisites
- Docker Desktop installed and running
- Jenkins installed on your machine
- Docker Hub account

## Step 1: Docker Hub Setup
1. Create a Docker Hub account at [hub.docker.com](https://hub.docker.com)
2. Create a new repository named `plantbot` (or your preferred name)
3. Note your Docker Hub username

## Step 2: Update Jenkinsfile
1. Replace `your-dockerhub-username` in the Jenkinsfile with your actual Docker Hub username
2. Example: `DOCKERHUB_USERNAME = 'johnsmith'`

## Step 3: Jenkins Credentials Setup
1. Open Jenkins dashboard
2. Go to **Manage Jenkins** → **Credentials** → **System** → **Global credentials**
3. Click **Add Credentials**
4. Choose **Username with password**
5. Set:
   - **ID**: `dockerhub-credentials`
   - **Username**: Your Docker Hub username
   - **Password**: Your Docker Hub password or access token
   - **Description**: Docker Hub credentials

## Step 4: Pipeline Configuration
1. Create a new Jenkins pipeline job
2. Point it to your Git repository
3. Use the updated Jenkinsfile

## How It Works
1. **Build**: Creates Docker images with staging/production targets
2. **Push**: Uploads images to Docker Hub (professional registry)
3. **Deploy Staging**: Runs staging container on localhost:3001
4. **Test**: Runs Cypress tests against staging
5. **Deploy Production**: If tests pass, deploys to localhost:3002

## Benefits of This Approach
- **Professional**: Uses industry-standard Docker Hub
- **Portable**: Images can be pulled from anywhere
- **Version Control**: Each build gets a unique tag
- **Real-world**: Mirrors production CI/CD practices
- **Learning**: Teaches Docker Hub integration

## URLs
- **Staging**: http://localhost:3001
- **Production**: http://localhost:3002
- **Docker Hub**: https://hub.docker.com/r/your-username/plantbot

## Next Steps
1. Run your first pipeline build
2. Check Docker Hub for your uploaded images
3. Verify staging and production deployments work
4. Customize the pipeline as needed
