# Multi-stage Dockerfile: builds client, installs server deps, copies built client into server/public
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .

# Build client
RUN cd client && npm install --silent && npm run build

# Install server deps
RUN cd server && npm install --production --silent

# Move built client into server/public
RUN rm -rf server/public || true && mkdir -p server/public && cp -r client/dist/* server/public/

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/server /app/server
WORKDIR /app/server
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "index.js"]
