#stage 1
FROM node:12-alpine as node
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

#stage 2
FROM nginx:alpine
COPY --from=node /app/build /usr/share/nginx/html
COPY --from=node /app/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# Make our shell script executable
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/sh", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]