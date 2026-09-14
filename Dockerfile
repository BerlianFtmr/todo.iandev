# ============================================================
# Dockerfile Production - Express.js + EJS (todo.iandev)
# Multi-stage build: install deps -> runtime ramping, non-root
# ============================================================

# ---------- Stage 1: Dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app

# Install hanya production dependencies (memanfaatkan cache layer)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ---------- Stage 2: Runtime ----------
FROM node:20-alpine AS runtime

# Metadata
LABEL org.opencontainers.image.title="todo.iandev" \
      org.opencontainers.image.description="Todo List & Progress Tracker SPA (Express.js + EJS + MySQL)" \
      org.opencontainers.image.authors="berlian fatma r"

# Zona waktu aplikasi (WIB)
ENV NODE_ENV=production \
    TZ=Asia/Jakarta \
    PORT=5000

WORKDIR /app

# Salin production dependencies dari stage deps
COPY --from=deps /app/node_modules ./node_modules

# Salin source code aplikasi
COPY package.json ./
COPY src ./src

# Jalankan sebagai non-root user (node user sudah ada di image alpine)
USER node

# Port internal aplikasi (di-map di compose)
EXPOSE 5000

# Healthcheck sederhana via endpoint root
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Jalankan server production (bukan nodemon)
CMD ["node", "src/app.js"]
