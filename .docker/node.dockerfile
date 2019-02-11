FROM node:10

WORKDIR /home/node/app

# Install deps
COPY ./package* ./
RUN npm install && \
    npm cache clean --force

COPY . .

EXPOSE 8080
# Start the app
CMD ["npm" "start"]