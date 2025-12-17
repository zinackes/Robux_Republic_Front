# Use the official Node.js 22 image as the base image
FROM node:22-alpine
# Switch to a non-root user for better security
USER node
# Set the working directory inside the container
WORKDIR /app
# Ensure the working directory has the correct permissions
RUN chown node:node /app
# Copy package.json and package-lock.json to the working directory
COPY --chown=node:node --chmod=444 package.json package-lock.json ./
# Install dependencies using npm ci for a clean install
RUN npm ci
# Copy the rest of the application files to the working directory
COPY --chown=node:node --chmod=555 src ./src
COPY --chown=node:node --chmod=555 public ./public
COPY --chown=node:node --chmod=444 index.html ./
COPY --chown=node:node --chmod=444 vite.config.js ./
COPY --chown=node:node --chmod=444 jsconfig.json ./
COPY --chown=node:node --chmod=444 components.json ./
COPY --chown=node:node --chmod=444 eslint.config.js ./
# Expose port 3000 for the application
EXPOSE 3000
# Start the application
CMD ["npm", "start"]

