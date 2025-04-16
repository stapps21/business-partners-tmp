# Build stage
FROM node:18 AS builder
WORKDIR /app

# Copy and build the business-partners-common shared library
COPY business-partners-common/package*.json ./business-partners-common/
RUN npm install --prefix business-partners-common
COPY business-partners-common/ ./business-partners-common/
# Assuming there's a build script defined for business-partners-common
RUN npm run build --prefix business-partners-common

# Copy and build the server for types or something
COPY server/package*.json ./server/
RUN npm install --prefix server
COPY server/ ./server/
# Assuming there's a build script defined for business-partners-common
RUN npm run build --prefix server

# Copy and build the client application
COPY client/package*.json ./client/
RUN npm install --prefix client
COPY client/ ./client/
# The client build might depend on the business-partners-common build output
RUN npm run build --prefix client

# Final stage
FROM nginx:alpine
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Nginx serves on port 80 by default, change it to 3000 as per your requirements
COPY client/nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
