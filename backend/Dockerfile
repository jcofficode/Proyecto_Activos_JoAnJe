FROM php:8.2-apache

# ── Extensiones y Librerías ──────────────────────────────────
RUN apt-get update && apt-get install -y \
    libzip-dev libpng-dev libjpeg-dev libwebp-dev \
    libfreetype6-dev libonig-dev unzip curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install pdo pdo_mysql zip gd mbstring \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ── SOLUCIÓN AL ERROR DE MPM ─────────────────────────────────
# Deshabilitamos el modo event y habilitamos prefork que es el estándar
RUN a2dismod mpm_event || true && a2enmod mpm_prefork rewrite

# ── Composer y Código ────────────────────────────────────────
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY . .

# Instalar dependencias
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permisos
RUN mkdir -p uploads/activos uploads/perfiles \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/uploads \
    && sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# ── Arranque y Puerto ────────────────────────────────────────
# Configuramos el puerto de Railway directamente aquí para evitar fallos de scripts
CMD sed -i "s/Listen 80/Listen ${PORT:-80}/g" /etc/apache2/ports.conf \
    && sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:${PORT:-80}>/g" /etc/apache2/sites-enabled/000-default.conf \
    && apache2-foreground