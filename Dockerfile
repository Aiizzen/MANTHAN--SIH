FROM node:20-bookworm

RUN apt-get update \
    && apt-get install -y python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY requirements.txt ./
RUN pip3 install --break-system-packages -r requirements.txt

COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

CMD ["npm", "start", "--", "-H", "0.0.0.0", "-p", "10000"]
