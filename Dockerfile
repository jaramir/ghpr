FROM node

RUN mkdir /opt/app
WORKDIR /opt/app

COPY package.json /opt/app
# RUN npm install

# Bundle app source
COPY . /opt/app

EXPOSE 3000
CMD [ "npm", "start" ]
