FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript (compile to JavaScript)
RUN npm run build

ENV PORT=3001
EXPOSE 4000

# Run the compiled JavaScript
CMD ["node", "dist/index.js"]