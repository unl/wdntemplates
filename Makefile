#
# Makefile for WDN Template Dependents Build
#

JS_PLUGIN = wdn/templates_3.0/scripts/plugins/validator/jquery.validator.min.js
JS_SRC = wdn/templates_3.0/scripts/plugins/validator/jquery.validator.js

all:
	@@echo "Compressing Desktop and Mobile CSS and JS"
	php build/compress.php
	@@echo "Done"
	@@echo "Running git status"
	git status wdn/templates_3.0
	@@echo "Any modified files are ready to be committed with git commit wdn/templates_3.0"
	@@echo "Commit compressed files, then run \`make zips\` to update .zip files."

all-uglifyjs:
	@@echo "Compressing Desktop and Mobile CSS and JS"
	php build/compress.php uglify-js
	@@echo "Done"
	@@echo "Running git status"
	git status wdn/templates_3.0
	@@echo "Any modified files are ready to be committed with git commit wdn/templates_3.0"
	@@echo "Commit compressed files, then run \`make zips\` to update .zip files."

zips:
	@@echo "Making ZIPs"
	git archive -o downloads/wdn.zip --prefix=wdn/ HEAD:wdn 
	@@echo "Done building the wdn.zip file."
	git archive -o downloads/UNLTemplates.zip HEAD Templates sharedcode
	@@echo "Done building the UNLTemplates.zip file."
	@@echo "Running git status"
	git status *.zip
	@@echo "Any modified files are ready to be committed with git commit *.zip"

js-plugin: ${JS_PLUGIN}

${JS_PLUGIN}: ${JS_SRC}
	java -jar build/bin/compiler.jar --js=${JS_SRC} --js_output_file=${JS_PLUGIN}