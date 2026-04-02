#!/bin/bash
set -e

# Railway inyecta $PORT dinámicamente; Apache necesita leerlo en tiempo de ejecución.
PORT="${PORT:-80}"

# Actualizar puerto en la configuración de Apache
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-enabled/000-default.conf

# Arrancar Apache en primer plano
exec apache2-foreground
