FROM nginx:alpine

# Copy custom Nginx configuration file(s)
COPY conf.d /etc/nginx/conf.d

# Copy certificates to the image
COPY certs /etc/nginx/certs

# Copy html file
COPY public /etc/nginx/html


# Expose HTTP and HTTPS ports
EXPOSE 80 443