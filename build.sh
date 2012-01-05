#!/bin/sh
echo 'Compressing Desktop and Mobile CSS and JS'
php build/compress.php

echo 'Done'

echo 'Running git status wdn/templates_3.0'
git status wdn/templates_3.0

echo 'Any modified files are ready to be committed with git commit wdn/templates_3.0'

echo 'Commit compressed files, then execute zip_builder.sh to update .zip files.'