FROM node:20-alpine
WORKDIR /repo
COPY packages/shared ./packages/shared
COPY services/gta-service ./services/gta-service
WORKDIR /repo/packages/shared
RUN npm install
WORKDIR /repo/services/gta-service
RUN npm install
CMD ["node_modules/.bin/ts-node", "--transpile-only", "src/index.ts"]
