FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

# Uncomment the next line if you are building your code for production
# RUN npm ci --only=production

COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
