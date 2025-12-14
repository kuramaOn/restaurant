# Backend Dockerfile for Render
# Node base image
FROM node:20-slim

# Install OS packages needed by Prisma (openssl)
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# Working directory
WORKDIR /app

# Copy package manifests first (leverage Docker layer cache)
COPY package*.json ./

# Copy Prisma schema for client generation
COPY prisma ./prisma

# Install dependencies and generate Prisma client
RUN npm install \
  && npx prisma generate

# Copy the rest of the backend source
COPY . .

# Build NestJS app
RUN npm run build

# Runtime environment
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Start application
CMD ["npm", "run", "start:prod"]
