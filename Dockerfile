# Stage 1 — install deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2 — build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept build args and expose them to Vite
ARG VITE_REPO_NAME=prac
ARG VITE_DEPLOY_ENV=prod
ENV VITE_REPO_NAME=$VITE_REPO_NAME
ENV VITE_DEPLOY_ENV=$VITE_DEPLOY_ENV

RUN npm run build

# Stage 3 — serve with nginx (~25 MB final image)
FROM nginx:1.27-alpine AS runner
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]