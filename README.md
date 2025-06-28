# Automation CICD Project

## Overview
This project demonstrates a full CI/CD pipeline for a web application using Docker, Jenkins, Playwright, and Netlify. It is designed to help beginners and QA engineers understand how modern automation and deployment workflows work.

---

## Key Files and Their Purpose

- **Dockerfile**: Multi-stage build for development, staging (QA), and production environments for your app.
- **docker-compose.dev.yml**: Runs the app in development mode with hot reload for local development.
- **docker-compose.qa.yml**: Builds and runs the app and Playwright tests for QA/staging.
- **docker-compose.prod.yml**: Builds and runs the app for production deployment.
- **Dockerfile.jenkins**: Custom Dockerfile to build a Jenkins image with Docker CLI and Compose installed, so Jenkins can run Docker commands in the pipeline.
- **docker-compose.jenkins.yml**: Runs Jenkins as a container, using the custom image, with Docker socket mounted for pipeline builds.
- **jenkinsfile**: Defines the CI/CD pipeline steps (build, test, deploy) for Jenkins.
- **tests/api/UI/sample.spec.ts**: Example Playwright test to check if the homepage loads.

---

## CI/CD Flow

1. **Development**
   - Developers use `docker-compose.dev.yml` to run the app locally.
   - Code is pushed to the `staging` branch for QA/testing.

2. **Staging (QA)**
   - Jenkins pipeline is triggered on the `staging` branch (using polling or webhook).
   - Jenkins builds the app and runs Playwright tests using `docker-compose.qa.yml`.
   - If tests pass, code can be merged to `main`.
   - Netlify automatically deploys the `staging` branch to a staging URL for team review.

3. **Production**
   - Code is merged to `main`.
   - Jenkins pipeline can be set to run again for production checks.
   - Netlify deploys the `main` branch to the production URL.

---

## Problems Faced & Solutions

### 1. **Docker Socket Permission Issues on Windows**
- **Problem:** Jenkins container could not access Docker on the host due to permission errors with `/var/run/docker.sock`.
- **Solution:**
  - Use WSL2 (Windows Subsystem for Linux 2) for a true Linux environment, where Docker socket permissions work as expected.
  - Ensure the `docker` group inside the Jenkins container matches the host's Docker group GID.

### 2. **GitHub Authentication**
- **Problem:** GitHub removed password authentication for git operations.
- **Solution:** Use a Personal Access Token (PAT) as your git password when pushing code or connecting Jenkins.

### 3. **Jenkins Pipeline Not Triggering Automatically**
- **Problem:** Jenkins did not run on code push.
- **Solution:**
  - Use polling as a temporary solution.
  - For full automation, set up a GitHub webhook to notify Jenkins of code changes.

### 4. **Branch Protection and Status Checks**
- **Problem:** Code could be merged to `main` without passing tests.
- **Solution:** Set up GitHub branch protection rules to require Jenkins status checks to pass before merging.

---

## Step-by-Step Setup Instructions

### 1. **Install Prerequisites**
- **Docker Desktop** (with WSL2 backend enabled)
- **Ubuntu (WSL2)**
- **Git**

### 2. **Clone the Repository**
```sh
git clone https://github.com/yourusername/automation-cicd.git
cd automation-cicd
```

### 3. **Build and Run Jenkins in WSL2**
```sh
docker-compose -f docker-compose.jenkins.yml up -d --build
```
- Access Jenkins at [http://localhost:8080](http://localhost:8080)
- Get the initial admin password from the Jenkins container:
  ```sh
  docker exec -it <jenkins_container_name> cat /var/jenkins_home/secrets/initialAdminPassword
  ```

### 4. **Set Up Jenkins Pipeline**
- Create a new pipeline job in Jenkins.
- Connect it to your GitHub repository.
- Set the branch to `staging` for QA/testing.
- Use your Personal Access Token for authentication.

### 5. **Set Up Netlify Deploys**
- Connect your repo to Netlify.
- Set up deploys for both `staging` and `main` branches.
- Use `bun run build` as the build command and `dist` as the publish directory.

### 6. **Set Up GitHub Branch Protection**
- Go to GitHub repo > Settings > Branches > Add ruleset for `main`.
- Require status checks to pass (select your Jenkins build).
- Optionally, require pull request reviews.

### 7. **Run the Full Flow**
- Push code to `staging` branch.
- Jenkins runs pipeline, Playwright tests execute.
- If tests pass, create a pull request from `staging` to `main`.
- Only merge if all checks pass.
- Netlify deploys to production after merge.

---

## Troubleshooting Tips
- If Jenkins cannot access Docker, check group permissions and use WSL2.
- If Jenkins pipeline is not triggered, check polling interval or webhook setup.
- If Playwright tests fail, check the test URL and Netlify deploy status.
- For any git authentication issues, use a Personal Access Token.

---

## Final Notes
- This setup is designed for learning and can be extended for real-world projects.
- Always use separate Dockerfiles for Jenkins and your app for clarity and maintainability.
- Use WSL2 for the best compatibility on Windows.

If you have any questions or need help, feel free to ask!
