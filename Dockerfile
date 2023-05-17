FROM node:18-alpine

WORKDIR /homes/app
COPY package.json .
COPY yarn.lock .
RUN yarn install --production && yarn cache clean
COPY . .

## prune dependencies to reduce node_modules size.
RUN apk --no-cache add curl
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN node-prune

CMD ["yarn", "start"]