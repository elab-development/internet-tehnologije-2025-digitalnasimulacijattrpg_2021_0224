# 1) deps
FROM node:25.4.0 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm ci

# 2) build
FROM node:25.4.0 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) runner
FROM node:25.4.0 AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

#  Drizzle config + schema  
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/src ./src

EXPOSE 3000
CMD ["sh", "-c", "node_modules/.bin/next start -H 0.0.0.0 -p ${PORT:-3000}"]
