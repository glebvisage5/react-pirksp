FROM node:20-alpine
WORKDIR /repo
COPY packages/shared ./packages/shared
COPY services/file-service ./services/file-service
WORKDIR /repo/packages/shared
RUN npm install
WORKDIR /repo/services/file-service
RUN npm install
CMD ["node_modules/.bin/ts-node", "--transpile-only", "src/index.ts"]
