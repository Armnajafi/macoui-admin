FROM node:20-alpine

WORKDIR /app

# نصب dependencies
COPY package*.json ./
RUN npm install

# کپی کل پروژه
COPY . .

# expose پورت dev
EXPOSE 3000

# run dev
CMD ["npm", "run", "dev"]
