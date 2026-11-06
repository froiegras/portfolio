FROM node:24-alpine AS build
WORKDIR /app
ENV GENERATE_SOURCEMAP=false
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html