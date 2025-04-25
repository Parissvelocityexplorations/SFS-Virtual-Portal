FROM node:20-alpine

WORKDIR /app

# Install curl for debugging
RUN apk add --no-cache curl

COPY package*.json ./

RUN npm install

COPY . .

# Make sure the port is properly exposed
EXPOSE 5173

# Add host flag to make the dev server accessible outside the container
# Force it to listen on all interfaces
ENV HOST=0.0.0.0
ENV PORT=5173

# Make sure the dev server is accessible from outside the container
CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port 5173"]