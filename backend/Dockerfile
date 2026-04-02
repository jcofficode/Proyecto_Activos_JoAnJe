FROM php:8.2-apache

# ── Extensiones PHP necesarias ───────────────────────────────
RUN apt-get update && apt-get install -y \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libwebp-dev \
    libfreetype6-dev \
    unzip \
    curl \
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        zip \
        gd \
        mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ── Habilitar mod_rewrite (para .htaccess) ───────────────────
RUN a2enmod rewrite

# ── Instalar Composer ────────────────────────────────────────
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ── Directorio de trabajo ────────────────────────────────────
WORKDIR /var/www/html

# ── Copiar aplicación ────────────────────────────────────────
COPY . .

# ── Instalar dependencias PHP (sin dev, optimizado) ──────────
RUN composer install --no-dev --optimize-autoloader --no-interaction

# ── Permisos para carpeta de uploads ────────────────────────
RUN mkdir -p uploads/activos uploads/perfiles \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/uploads

# ── Habilitar AllowOverride para .htaccess ───────────────────
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# ── Entrypoint para ajustar PORT de Railway ──────────────────
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
