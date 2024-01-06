# Node.js Dockerfile for a web application

# Stage 1: Base Image Setup
FROM node:latest

# Stage 2: Application Setup
WORKDIR /usr/app

# Copy package.json and package-lock.json to the working directory.
COPY package*.json .

# Install npm dependencies in a quiet mode to reduce log verbosity.
RUN npm install --quiet

# Copy the entire application code into the container.
COPY ./ ./

# Command to start the application in development mode.
CMD ["npm", "start", "dev"]