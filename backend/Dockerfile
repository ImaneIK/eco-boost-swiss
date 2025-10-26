FROM node:20-slim
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY dist/ .
EXPOSE 5678
CMD ["node", "index.js"]