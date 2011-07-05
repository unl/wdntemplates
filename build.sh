#!/bin/sh
echo 'Compressing CSS and JS'
php wdn/templates_3.0/build/compress.php

echo 'Compressing Mobile CSS and JS'
php wdn/templates_3.0/build/compress_mobile.php

echo 'Done'

echo 'Running svn status wdn/templates_3.0'
svn status wdn/templates_3.0 | grep -v "^X" | grep -v "external item"

echo 'Any modified files are ready to be committed with svn commit wdn/templates_3.0'

echo 'Commit compressed files, then execute zip_builder.sh to update .zip files.'