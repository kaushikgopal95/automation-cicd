# ----------------------------------- Base Stage ----------------------------------

# Base image with node 18 version will act as base image for all env
FROM node:18 as base

# Sets the default directory inside the container where commands will run.
WORKDIR /app

# Copy package files first (for better caching). All file names starting with package will 
# be copied to the working directory(./app, ./, .) 
COPY package*.json ./


# ----------------------------------- Development Stage ----------------------------------   

# installs node 18 as base image - Image 1
FROM base as development

#Install all packages dependencies mentioned in package*.json file with a clean install
RUN npm ci

#Copy source code
COPY . .

#Declares the container's listening port - Documentation purpose
EXPOSE 5173
#command to run the development server with hot reloads(Hot reloads config will be in compose file)
#"--","--host","0.0.0.0" is a mandatory input for dev environments when we are running in docker to Accept connections from any network interface"
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]  

# ----------------------------------- Staging/Test Stage ---------------------------------- 

# installs node 18 as base image - Image 2
FROM base as staging  

#Install all packages dependencies mentioned in package*.json file with a clean install
RUN npm ci

#Copy source code
COPY . .  

# Build the app
RUN npm run build

#Declares the container's listening port - Documentation purpose
EXPOSE 5173

#Serve the built files
CMD ["npm", "run", "preview"] 

# ----------------------------------- Production Stage ---------------------------------- 

# installs node 18 as base image - Image 3
FROM base as Production

#Install all packages dependencies mentioned in package*.json under dependencies with a clean install
RUN npm ci --only=production

#Copy source code
COPY . .  

# Build the app
RUN npm run build

#Declares the container's listening port - Documentation purpose
EXPOSE 5173

#Serve the built files
CMD ["npm", "run", "preview"] 