RJS_FLAGS :=

all:
	grunt --rjs-flags="$(RJS_FLAGS)"

less:
	grunt less

js:
	grunt --rjs-flags="$(RJS_FLAGS)" js

clean:
	grunt clean

dist:
	grunt dist
	
.PHONY: all clean less js dist
.SUFFIXES:
