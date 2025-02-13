# Use the official PHP 8.3 FPM image
FROM php:8.3-fpm

# Install system dependencies required to build PHP extensions and other tools
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libzip-dev \
    zip \
    unzip \
    git

# Configure and install the gd extension with support for freetype and jpeg
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Install additional PHP extensions required by your project:
# pdo_mysql for MySQL connectivity, mbstring for multibyte string handling,
# zip for archive support, exif for image metadata, and pcntl for process control.
RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl

# Set the working directory in the container
WORKDIR /var/www/html

# Copy composer files first to leverage Docker layer caching
COPY composer.json composer.lock ./

# Install Composer (using the official Composer image to copy the binary)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install PHP dependencies using Composer
RUN composer install --no-dev --optimize-autoloader

# Copy the rest of your Laravel application code into the container
COPY . .

# Ensure proper permissions for Laravel (adjust if necessary)
RUN chown -R www-data:www-data /var/www/html

# Expose port 9000 (PHP-FPM default)
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
