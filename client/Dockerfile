FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Add host flag to make the dev server accessible outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]