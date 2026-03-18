# Stage 1: build the application
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Stage 2: create the production image
FROM node:24-alpine

WORKDIR /app

# Copy only what we need from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/ ./

# Azure App Service expects the container to listen on port 8080 by default
EXPOSE 8080
ENV PORT=8080

# Start the application
CMD ["npm", "start"]
