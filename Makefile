#
# Makefile for WDN Template Dependents Build
#

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