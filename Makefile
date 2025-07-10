SHELL := /bin/bash
NODE_PATH = $(shell ./build/find-node-or-install)
PATH := $(NODE_PATH):$(shell echo $$PATH)

all:
	npm run build

npm:
	npm install

.PHONY: all npm
.SUFFIXES:
