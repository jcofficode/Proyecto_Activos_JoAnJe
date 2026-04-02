#!/bin/bash
set -e

# Railway inyecta la variable $PORT. Configuramos Apache para usarla.
if [ -n "$PORT" ]; then
  sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
  sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/" /etc/apache2/sites-enabled/000-default.conf
fi

# Iniciamos Apache usando el script oficial de la imagen de PHP
exec apache2-foreground