export PATH := $(PATH):build/bin
TEMPLATE_DIR := wdn/templates_4.0

GIT := git

LESSC := lessc
LESSC_FLAGS := --yui-compress --line-numbers=comments
LESS_OBJS := all.less
LESS_OUT ?= $(LESS_OBJS:.less=.css)

RJS := r.js
RJS_FLAGS :=
JS_BUILD_CONF := build/build.js

SMUDGE_STATUS := $(shell $(GIT) config filter.rcs-keywords.smudge)

all: less js

less:
	$(LESSC) $(LESSC_FLAGS) $(TEMPLATE_DIR)/less/$(LESS_OBJS) $(TEMPLATE_DIR)/css/$(LESS_OUT)

js:
	$(RJS) -o $(JS_BUILD_CONF) $(RJS_FLAGS)

clean:
	rm -rf $(TEMPLATE_DIR)/css
	rm -rf $(TEMPLATE_DIR)/scripts/compressed

dist: all
	@if test -z "$(SMUDGE_STATUS)"; then \
		./scripts/smudge.sh; \
	fi
	zip -qr downloads/wdn.zip wdn
	zip -qr downloads/UNLTemplates.zip Templates sharedcode
	@if test -z "$(SMUDGE_STATUS)"; then \
		./scripts/clean.sh; \
	fi
	
.PHONY: all clean less js dist
