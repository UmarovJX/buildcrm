# build stage
# Choose the Image which has Node installed already
FROM node:14

# install simple http server for serving static content
RUN npm install -g http-server

RUN mkdir /app

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN yarn add core-js

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN yarn build

EXPOSE 8090
CMD [ "http-server", "dist" ]