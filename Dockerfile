FROM node:20 AS build

WORKDIR /app

ARG API_URL
ENV API_URL=$API_URL

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build



FROM node:20

WORKDIR /app

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
