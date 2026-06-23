FROM node:20-alpine
WORKDIR /repo
COPY packages/shared ./packages/shared
COPY services/auth-service ./services/auth-service
WORKDIR /repo/packages/shared
RUN npm install
WORKDIR /repo/services/auth-service
RUN npm install
CMD ["node_modules/.bin/ts-node", "--transpile-only", "src/index.ts"]
