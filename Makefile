#
# Makefile for WDN Template Dependents Build
#

COMPRESS_FLAGS =
JS_COMPILER =

COMPRESS = php build/compress.php ${COMPRESS_FLAGS} ${JS_COMPILER}
GIT = git
JAVA = java

JS_PLUGIN = wdn/templates_3.1/scripts/plugins/validator/jquery.validator.min.js
JS_SRC = wdn/templates_3.1/scripts/plugins/validator/jquery.validator.js

all:
	@@echo "Compressing Desktop and Mobile CSS and JS"
	${COMPRESS}
	@@echo "Done"
	@@echo "Running git status"
	${GIT} status wdn/templates_3.1
	@@echo "Any modified files are ready to be committed with git commit wdn/templates_3.1"
	@@echo "Commit compressed files, then run \`make zips\` to update .zip files."

clean:
	${COMPRESS} clean

debug:
	${COMPRESS} debug

less:
	${COMPRESS} less

zips:
	@@echo "Making ZIPs"
	${GIT} archive -o downloads/wdn.zip HEAD wdn 
	@@echo "Done building the wdn.zip file."
	${GIT} archive -o downloads/UNLTemplates.zip HEAD Templates sharedcode
	@@echo "Done building the UNLTemplates.zip file."
	@@echo "Running git status"
	${GIT} status *.zip
	@@echo "Any modified files are ready to be committed with git commit *.zip"

js-plugin: ${JS_PLUGIN}

${JS_PLUGIN}: ${JS_SRC}
	${JAVA} -jar build/bin/compiler.jar --js=${JS_SRC} --js_output_file=${JS_PLUGIN}

.PHONY: all clean debug less less-css zips js-plugin