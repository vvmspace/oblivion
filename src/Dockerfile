FROM buildkite/puppeteer:latest

WORKDIR /app/src
COPY package.json ./
RUN npm install
COPY . .

#ADD crontab /crontab.txt
#RUN /usr/bin/crontab /crontab.txt

CMD npm run start