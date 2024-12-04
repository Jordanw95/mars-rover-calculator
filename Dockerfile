FROM node:20-slim

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY jest.config.js ./

# Clean install dependencies
RUN rm -rf node_modules
RUN npm cache clean --force
RUN npm install

CMD ["npm", "run", "dev"]