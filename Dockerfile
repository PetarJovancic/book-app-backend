FROM node:15.13-alpine

COPY . /

EXPOSE 1337

RUN npm i

CMD ["npm", "run", "dev"]