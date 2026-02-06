#!/bin/sh
set -e

timestamp()
{
 date +"%Y-%m-%d %T"
}

runConsoleSymfonyCommand () {
    echo "$(timestamp):[run] php bin/console $1"
    output=`php bin/console $1`
    echo "$(timestamp):[run] Output command 'php bin/console $1' ${output}"
    exitcode=$?
    if [ "$exitcode" != "0" ];
    then
        exit 1;
    fi
}

if [[ -z "$DEBUG" ]]
then
    echo "$(timestamp):[run] Debug disabled"
    [ -f /etc/php7/conf.d/xdebug.ini ] && mv /etc/php7/conf.d/xdebug.ini /etc/php7/conf.d/xdebug.off
else
    echo "$(timestamp):[run] Debug enabled"
    [ -f /etc/php7/conf.d/xdebug.off ] && mv /etc/php7/conf.d/xdebug.off /etc/php7/conf.d/xdebug.ini
fi

# Fix for Windows Docker volume permission issues
# Move cache and log directories to container-internal storage
echo "$(timestamp):[run] Setting up cache directories for Windows Docker compatibility"
mkdir -p /tmp/symfony/cache /tmp/symfony/log
chmod -R 777 /tmp/symfony
rm -rf /var/www/html/var/cache /var/www/html/var/log 2>/dev/null || true
mkdir -p /var/www/html/var
ln -sf /tmp/symfony/cache /var/www/html/var/cache
ln -sf /tmp/symfony/log /var/www/html/var/log

echo "$(timestamp):[run] Clearing and warming up cache"
php bin/console cache:clear || echo "$(timestamp):[run] Cache clear completed with warnings"

echo "$(timestamp):[run] Running supervisord";
/usr/bin/supervisord -c ./docker/config/supervisord.conf
