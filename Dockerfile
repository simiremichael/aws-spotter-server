
FROM node:18

# Create app directory
WORKDIR /api

COPY . .

RUN npm install

ENV MONGODB_URL="mongodb+srv://propertyfinder:iwuobe1983@property.w6k5zrn.mongodb.net/property"
ENV REACT_APP_AGENT_COOKIE_KEY="jwa"
ENV REACT_APP_COMPANY_COOKIE_KEY="jwt"
ENV REACT_APP_USER_COOKIE_KEY="jws"
ENV REACT_APP_TOKEN_KEY="test"
ENV LOCATION_KEY="AIzaSyCC1JhVqHUe1VqIqLaEpvBqdx76VI7m10Q"
ENV EMAIL_USER=residencespotterng@gmail.com
ENV EMAIL_PASSWORD=xfvdflykqdbmvedc
ENV EMAIL_SERVICE=gmail
ENV BUCKET_NAME='rs-profile-picture'
ENV BUCKET_REGION='af-south-1'
ENV ACCESS_KEY='AKIAZEKIHWOSADAR7OWI'
ENV SECRETE_ACCESS_KEY='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'
ENV COMPANY_BUCKET_NAME='rs-company-logo'
ENV COMPANY_ACCESS_KEY='AKIAZEKIHWOSGLNSL4PV'
ENV COMPANY_SECRETE_ACCESS_KEY='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'
ENV PROPERTY_BUCKET_NAME='rs-property-image'
ENV PROPERTY_ACCESS_KEY='AKIAZEKIHWOSLB7CHR6K'
ENV PROPERTY_SECRETE_ACCESS_KEY='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'
ENV AGENT_BUCKET_NAME='rs-agent-picture'
ENV AGENT_ACCESS_KEY='AKIAZEKIHWOSI77T2PA5'
ENV AGENT_SECRETE_ACCESS_KEY='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'
     
EXPOSE 5000

CMD [ "npm", "start"]
# ENTRYPOINT npm start
