# Use the official Node.js 22 image as the base image
FROM node:22-alpine AS build
# Switch to a non-root user for better security
USER node
# Set the working directory inside the container
WORKDIR /app
# Ensure the working directory has the correct permissions
RUN chown node:node /app
# Copy package.json and package-lock.json to the working directory
COPY --chown=node:node package.json package-lock.json ./
# Install project dependencies
RUN npm ci
# Copy only the necessary files for the application
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public
COPY --chown=node:node index.html ./
COPY --chown=node:node vite.config.js ./
COPY --chown=node:node jsconfig.json ./
COPY --chown=node:node components.json ./
COPY --chown=node:node eslint.config.js ./


ARG VITE_BASE_API_URL
ENV VITE_BASE_API_URL=$VITE_BASE_API_URL
RUN npm run

FROM node:22-alpine

WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
