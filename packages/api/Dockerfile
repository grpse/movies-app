# Download Node.js from https://foundation.nodejs.org/ and link the volume of /app to host
FROM node:20.10.0-buster
WORKDIR /app
VOLUME ["/app"]
RUN npm install
CMD ["npm", "run", "start:dev"]

EXPOSE 3000

