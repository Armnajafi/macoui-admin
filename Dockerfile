FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1. Stage: نصب وابستگی‌ها
FROM base AS deps
COPY package*.json ./
RUN npm ci

# 2. Stage: ساخت پروژه
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# تنظیم متغیر محیطی برای ساخت
ENV NEXT_PUBLIC_API_URL=https://api.admin.macoui.net
ENV NODE_ENV=production

# اینجا باید مطمئن شوید که next.config.js شما output: 'standalone' دارد
RUN npm run build

# 3. Stage: اجرا
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# کپی فایل‌های ضروری از مرحله builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# کپی فایل‌های standalone (حالا server.js هم اینجاست)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
