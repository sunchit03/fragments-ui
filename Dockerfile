# Stage 0: install the base dependencies
FROM node:22.14.0-alpine@sha256:9bef0ef1e268f60627da9ba7d7605e8831d5b56ad07487d24d1aa386336d1944 AS dependencies

LABEL maintainer="Sunchit Singh <sunchit-singh@myseneca.ca>" \
      description="Fragments UI testing web app"

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json /app/

RUN npm ci

########################################################################

# Stage 1: build the site
FROM node:22.14.0-alpine@sha256:9bef0ef1e268f60627da9ba7d7605e8831d5b56ad07487d24d1aa386336d1944 AS build

WORKDIR /app

# Copy the generated dependencies (node_modules/)
COPY --from=dependencies /app /app

# Copy the source code
COPY . .

# Build the site, creating /build
RUN npm run build

########################################################################

# Stage 2: serving the built site
FROM nginx:1.26.3-alpine@sha256:d2c11a1e63f200585d8225996fd666436277a54e8c0ba728fa9afff28f075bd7 AS deploy

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
  CMD curl --fail localhost || exit 1
