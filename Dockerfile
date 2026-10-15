FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

# NB: le conteneur tourne en root (volontaire, à corriger plus tard avec le scan d'image)
CMD ["npm", "start"]
