FROM node:20

WORKDIR /app

COPY . .

RUN npm install

ENV NODE_ENV "production"
RUN npm run build

EXPOSE 4322

ENTRYPOINT [ "node", "server" ]