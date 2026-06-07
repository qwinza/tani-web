# Dockerfile - Container Security (Hardened)
# Menggunakan base image minimal (Alpine) untuk meminimalisir attack surface

FROM php:8.2-fpm-alpine

# Set working directory
WORKDIR /var/www

# Install system dependencies & PHP extensions yang dibutuhkan
RUN apk update && apk add --no-style-cache \
    build-base \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    unzip \
    git \
    curl \
    oniguruma-dev \
    libxml2-dev

RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd

# Salin konfigurasi PHP yang aman untuk production
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Pengerasan php.ini (Menonaktifkan fungsi berbahaya, menyembunyikan versi PHP)
RUN echo "expose_php = Off" >> "$PHP_INI_DIR/php.ini" && \
    echo "disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_multi_exec,parse_ini_file,show_source" >> "$PHP_INI_DIR/php.ini" && \
    echo "allow_url_fopen = Off" >> "$PHP_INI_DIR/php.ini"

# Membuat Grup dan User Non-Root (laravel) untuk keamanan container
RUN addgroup -g 1000 laravel && \
    adduser -G laravel -u 1000 -s /bin/sh -D laravel

# Menyalin kode sumber aplikasi
COPY --chown=laravel:laravel . /var/www

# Mengatur izin direktori agar aman (Laravel storage & cache butuh akses tulis bagi user laravel)
RUN chmod -R 755 /var/www && \
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Beralih ke user non-root demi meminimalkan resiko privilege escalation
USER laravel

# Expose port 9000 untuk PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
