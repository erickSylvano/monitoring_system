FROM php:8.2-fpm

# dépendances système
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Node.js et NPM
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# dépendances Node.js
RUN npm install -g npm && npm install -g vite

WORKDIR /var/www

COPY . .

RUN chown -R www-data:www-data /var/www && chmod -R 755 /var/www

# dépendances PHP
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# dépendances Node.js
RUN npm install && npm run build

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]

