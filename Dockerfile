# Alvyl website as a container: Node builds the prerendered static site, nginx serves it.
#   docker build -t alvyl-website .
#   docker run --rm -p 8080:80 alvyl-website      → http://localhost:8080

# ---- 1. Build ----
FROM node:24-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Blog posts and team cards come from the CMS content repo (public), as in the GitHub deploy.
ARG CMS_REPO=https://github.com/Monendra-Alvyl/alvyl-test-blog.git
RUN git clone "$CMS_REPO" /cms

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Served from the domain root. SITE_URL is the public address used in canonical/OG links.
ARG SITE_URL=http://localhost:8080
ENV BASE_PATH=/ CMS_CONTENT_DIR=/cms VITE_SITE_URL=$SITE_URL
RUN npm run build

# ---- 2. Serve ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
