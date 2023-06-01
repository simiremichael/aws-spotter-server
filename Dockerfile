
FROM node:18

# Create app directory
WORKDIR /api

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "start"]
# ENTRYPOINT npm start
