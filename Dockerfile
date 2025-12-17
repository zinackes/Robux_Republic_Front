# Use the official Node.js 22 image as the base image
FROM node:22-alpine
# Set the environment variable for production
ENV NODE_ENV=production
# Set the working directory inside the container
WORKDIR /app
# Copy all files from the current directory to the working directory
COPY . .
# Install production dependencies
RUN npm install --production
# Expose port 3000 for the application
EXPOSE 3000
# Start the application
CMD ["npm", "start"]