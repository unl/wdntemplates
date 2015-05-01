BASEDIR="/var/www/html"

#Go to the basedir to perform commands.
cd $BASEDIR

make clean && make

echo "FINISHED!  URL: localhost:8004"
