FROM php:8.2-apache

# ── Extensiones PHP necesarias ───────────────────────────────
RUN apt-get update && apt-get install -y \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libwebp-dev \
    libfreetype6-dev \
    libonig-dev \
    unzip \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install pdo pdo_mysql zip gd mbstring \
    && a2dismod mpm_event mpm_worker || true && a2enmod mpm_prefork rewrite \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ── Instalar Composer ────────────────────────────────────────
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ── Directorio de trabajo ────────────────────────────────────
WORKDIR /var/www/html
COPY . .

# ── Instalar dependencias ────────────────────────────────────
RUN composer install --no-dev --optimize-autoloader --no-interaction

# ── Permisos y Configuración ─────────────────────────────────
RUN mkdir -p uploads/activos uploads/perfiles \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/uploads \
    && sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Railway usa puertos dinámicos, esto es vital
CMD ["docker-entrypoint.sh"]