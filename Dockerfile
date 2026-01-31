# Use a Node.js base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the Hardhat node port
EXPOSE 8545

# Command to run the node
CMD ["npx", "hardhat", "node"]