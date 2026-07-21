FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts
FROM php:8.3-fpm-alpine
RUN docker-php-ext-install pdo_mysql
WORKDIR /var/www/html
COPY --from=vendor /app/vendor ./vendor
COPY . .
RUN chown -R www-data:www-data storage bootstrap/cache
USER www-data
EXPOSE 9000
CMD ["php-fpm"]
