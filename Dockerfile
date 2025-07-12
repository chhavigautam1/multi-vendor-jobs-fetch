# Base Image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Set default command (overridden in docker-compose)
CMD ["npm", "run", "dev"]
