FROM node:20-alpine

# Install Python and build dependencies for the sandboxed runner
RUN apk add --no-cache python3 py3-pip make g++ && \
    ln -sf python3 /usr/bin/python

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push && npm run seed && node dist/server.js"]

