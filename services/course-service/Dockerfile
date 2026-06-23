FROM node:20-alpine
WORKDIR /repo
COPY packages/shared ./packages/shared
COPY services/course-service ./services/course-service
WORKDIR /repo/packages/shared
RUN npm install
WORKDIR /repo/services/course-service
RUN npm install
CMD ["node_modules/.bin/ts-node", "--transpile-only", "src/index.ts"]
