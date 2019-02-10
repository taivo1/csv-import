FROM node:10

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /home/node/app && cp -a /tmp/node_modules /home/node/app/

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /home/node/app
COPY . /home/node/app

EXPOSE 8080
CMD ["npm" "start"]