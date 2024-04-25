FROM node:18.16.0-alpine
RUN sed -i 's/https/http/' /etc/apk/repositories && export HTTP_PROXY=$PROXY && apk update && apk upgrade

ENV HOME=/home/stock-price-service \
    PORT=3001 \
    NODE_ENV=development
WORKDIR $HOME
COPY src src
COPY *.json ./

RUN npm install
# RUN npm ci --only=production
RUN npm run build
USER 2600:2601
HEALTHCHECK --interval=2m --timeout=10s --start-period=20s CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/management/info || exit 1
CMD ["npm", "run", "start"]

