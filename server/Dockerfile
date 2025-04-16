# Build stage
FROM node:18 AS builder
WORKDIR /app

COPY business-partners-common/package*.json ./business-partners-common/
# If business-partners-common has dependencies, install them as well
# Uncomment the following line if necessary
RUN npm install --prefix business-partners-common

# Copy the package.json files for both server and business-partners-common
COPY server/package*.json ./server/
# Install dependencies for server
RUN npm install --prefix server



# Copy the rest of the server and business-partners-common files
COPY server/ ./server/
COPY business-partners-common/ ./business-partners-common/

# Build the server if there's a build step
# Uncomment and adjust the following line according to your build command
RUN npm run build --prefix server

# Final stage
FROM node:18
WORKDIR /app

# Copy built server and business-partners-common from builder stage
COPY --from=builder /app/server ./server
COPY --from=builder /app/business-partners-common ./business-partners-common

# Expose the port the app runs on
EXPOSE 3001

# Set the working directory to /app/server to run the server commands
WORKDIR /app/server

# Command to run the application
CMD ["npm", "start"]
