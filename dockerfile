# =============================================================
# Stage 1: builder
# Node 22 Alpine — installs deps, runs ESLint, runs ALL tests
# (Express API tests + Calculator Jest tests)
# =============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first — Docker layer cache means npm ci
# only re-runs when package*.json actually changes
COPY package*.json ./
RUN npm ci

# Copy everything else
COPY . .

# Gate 1: lint — fails the build if ESLint finds any errors
RUN npm run lint

# Gate 2: tests — fails the build if any test fails or coverage
# drops below the thresholds set in package.json
RUN npm run test:ci

# =============================================================
# Stage 2: production
# nginx Alpine — serves the static calculator files only.
# The Express API and node_modules are NOT copied here,
# keeping the final image small and the attack surface minimal.
# =============================================================
FROM nginx:alpine AS production

# Remove nginx default placeholder page
RUN rm -rf /usr/share/nginx/html/*

# Copy only the calculator static files from the builder stage
COPY --from=builder /app/calculator /usr/share/nginx/html

# Custom nginx config: serve on port 80, clean 404s
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    error_page 404 /index.html;\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
