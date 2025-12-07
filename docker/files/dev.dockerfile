FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development
ENV PORT=3000
ENV CHOKIDAR_USEPOLLING=true


COPY package*.json ./


RUN apk add --no-cache --virtual .build-deps python3 g++ make git \
  && npm ci \
  && apk del .build-deps


COPY docker/entrypoints/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

COPY . .

ENTRYPOINT ["/bin/sh", "/usr/local/bin/entrypoint.sh"]

EXPOSE 3000

CMD ["npm", "run", "dev"]

