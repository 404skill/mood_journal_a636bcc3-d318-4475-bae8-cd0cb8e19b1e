# Use official Node.js LTS
FROM node:24

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
# – Copy package.json & package-lock.json (npm’s lockfile)
COPY package.json package-lock.json ./
# – Use `npm ci` for clean, reproducible installs
RUN npm ci --only=production

# Copy source
COPY . .

# Build Next.js app
# – “build” is an npm script, so use “npm run build”
RUN npm run build

# Expose port and start
EXPOSE 3000
CMD ["npm", "start"]
