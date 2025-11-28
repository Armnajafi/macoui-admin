# ---------- BASE STAGE ----------
    FROM node:20-alpine AS base
    WORKDIR /app
    COPY package.json package-lock.json* ./
    
    # ---------- DEPENDENCIES ----------
    FROM base AS deps
    RUN npm install
    
    # ---------- BUILD ----------
    FROM base AS build
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    RUN npm run build
    
    # ---------- PRODUCTION ----------
    FROM node:20-alpine AS production
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    COPY --from=build /app/public ./public
    COPY --from=build /app/.next ./.next
    COPY --from=deps /app/node_modules ./node_modules
    COPY package.json .
    
    EXPOSE 3000
    
    CMD ["npm", "start"]
    