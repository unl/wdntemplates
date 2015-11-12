SHELL := /bin/bash
NODE_PATH = $(shell ./build/find-node-or-install)
PATH := $(NODE_PATH):$(shell echo $$PATH)

RJS_FLAGS :=

all: npm
	grunt --rjs-flags="$(RJS_FLAGS)"

less: npm
	grunt less

js: npm
	grunt --rjs-flags="$(RJS_FLAGS)" js

clean: npm
	grunt clean

dist: npm
	grunt dist

npm:
	npm install -g grunt-cli
	npm install
	
.PHONY: all clean less js dist npm
.SUFFIXES:
