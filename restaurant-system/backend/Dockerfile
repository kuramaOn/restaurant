# ===================================
# Stage 1: Build Stage
# ===================================
FROM node:20-slim AS builder

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

# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the backend source
COPY . .

# Build NestJS app (requires @nestjs/cli from devDependencies)
RUN npm run build

# Verify build output
RUN ls -la dist/

# ===================================
# Stage 2: Production Stage
# ===================================
FROM node:20-slim AS production

# Install OS packages needed by Prisma (openssl)
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# Working directory
WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Copy Prisma schema
COPY prisma ./prisma

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Generate Prisma client (needed at runtime)
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Runtime environment
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]
