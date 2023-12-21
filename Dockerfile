FROM node:16.14.2

RUN apt-get update \
    && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY ./package.json ./
COPY ./yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 3003
ENV TZ=Asia/Tehran
RUN yarn run build
CMD [ "yarn", "run", "preview" , "--port", "3003", "--host"]