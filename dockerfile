FROM mcr.microsoft.com/playwright:v1.57.0-noble

WORKDIR /app

# VOLUME /test-results

COPY package*.json ./ 

RUN npm cache clean --force

RUN npm install

COPY . . 

RUN npx playwright install --with-deps 

ENV CI=true 

CMD ["npx", "playwright", "test"] 