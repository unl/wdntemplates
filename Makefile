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

clean:
	${COMPRESS} clean

debug:
	${COMPRESS} debug

less:
	${COMPRESS} less

zips:
	@@echo "Making ZIPs"
	${GIT} archive --format=zip HEAD wdn > downloads/wdn.zip 
	@@echo "Done building the wdn.zip file."
	${GIT} archive --format=zip HEAD Templates sharedcode > downloads/UNLTemplates.zip
	@@echo "Done building the UNLTemplates.zip file."

js-plugin: ${JS_PLUGIN}

${JS_PLUGIN}: ${JS_SRC}
	${JAVA} -jar build/bin/compiler.jar --js=${JS_SRC} --js_output_file=${JS_PLUGIN}

.PHONY: all clean debug less less-css zips js-plugin