FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Next.js 15+ needs this for the React Compiler to build properly
ENV NEXT_PRIVATE_STANDALONE=true

EXPOSE 3000

CMD ["npm", "run", "dev"]