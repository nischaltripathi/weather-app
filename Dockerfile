# Use an official Node.js image as a base
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the entire project
COPY . .

# Copy .env file (if exists)
COPY .env .env

# Build the Next.js application
RUN npm run build

# -- Production image --
FROM node:22-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy .env file for runtime variables
COPY --from=builder /app/.env .env

# Set environment variables
ENV NODE_ENV=DEV

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]