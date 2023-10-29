FROM node:18-alpine

COPY ./build ./build
RUN npm install -g serve

ENTRYPOINT ["serve", "-s", "build", "-l", "5000"]

EXPOSE 5000