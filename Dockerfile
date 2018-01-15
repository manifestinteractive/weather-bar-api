FROM node:6.9.4

LABEL maintainer "Peter Schmalfeldt hello@weatherbar.com"
LABEL version="1.0"
LABEL description="Local Development of Weather Bar API"
LABEL vendor="Weather Bar"

# Create non-root user to run app with

RUN useradd --user-group --create-home --shell /bin/bash weatherbar

# Set working directory

WORKDIR /home/weatherbar/api

COPY package.json ./

RUN mkdir /home/weatherbar/.forever
RUN chown -R weatherbar:weatherbar /home/weatherbar/.forever
RUN chown -R weatherbar:weatherbar /home/weatherbar/api

# Change user so that everything that's npm-installed belongs to it

USER weatherbar

RUN export API_NODE_ENV=docker

# Install dependencies
RUN npm install --no-optional && npm cache clean

# Switch to root and copy over the rest of our code
# This is here, after the npm install, so that code changes don't trigger an un-caching
# of the npm install line

USER root

RUN npm install -g forever
RUN npm install -g sequelize-cli

COPY .jshintrc ./
COPY .jshintignore ./
COPY .sequelizerc ./
COPY .nvmrc ./

COPY app ./app
COPY scripts ./scripts

# Download Required Libraries
RUN rm -f ./app/flat-db/cities.mmdb
RUN curl -o ./app/flat-db/cities.mmdb.gz http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz
RUN gunzip ./app/flat-db/cities.mmdb.gz

RUN rm -f ./app/flat-db/countries.mmdb
RUN curl -o ./app/flat-db/countries.mmdb.gz http://geolite.maxmind.com/download/geoip/database/GeoLite2-Country.mmdb.gz
RUN gunzip ./app/flat-db/countries.mmdb.gz

RUN chmod 755 ./scripts/docker-compose/*.sh
RUN chown -R weatherbar:weatherbar /home/weatherbar/api

USER weatherbar

