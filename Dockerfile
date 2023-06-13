
FROM node:18

# Create app directory
WORKDIR /api

COPY . .

RUN npm install
  
EXPOSE 5000

CMD [ "npm", "start"]
# ENTRYPOINT npm start
