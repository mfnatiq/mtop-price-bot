FROM node:16.14.2-alpine3.14
COPY tsconfig.json package.json yarn.lock /
COPY src /src
RUN yarn
RUN yarn build
CMD ["yarn" , "start"]