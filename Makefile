export PATH := $(PATH):build/bin
ENV := /usr/bin/env

TEMPLATE_DIR := wdn/templates_4.0
TEMPLATE_LESS := $(TEMPLATE_DIR)/less
TEMPLATE_CSS := $(TEMPLATE_DIR)/css
TEMPLATE_JS := $(TEMPLATE_DIR)/scripts
TEMPLATE_RJS := $(TEMPLATE_JS)/compressed

GIT := git

LESSC := lessc
LESSC_FLAGS := --yui-compress --line-numbers=comments
LESSC_SHELL := $(ENV) PATH=$(PATH) $(LESSC)

LESS_MIXINS := $(TEMPLATE_LESS)/_mixins/all.less
LESS_MIXINS_DEPS := $(filter %.less, $(shell $(LESSC_SHELL) -M $(LESS_MIXINS) .tmp))
LESS_ALL := all.less
LESS_ALL_OUT := all.css
CSS_OBJS := \
	$(TEMPLATE_CSS)/$(LESS_ALL_OUT) \
	$(TEMPLATE_CSS)/print.css \
	$(TEMPLATE_CSS)/layouts/unlalert.css

RJS := r.js
RJS_FLAGS :=
RJS_BUILD_CONF := build/build.js
JS_ALL_OUT := $(TEMPLATE_RJS)/all.js
JS_DEPS := $(TEMPLATE_JS)/*.js

SMUDGE_STATUS := $(shell $(GIT) config filter.rcs-keywords.smudge)

all: less js

less: $(CSS_OBJS)

$(shell $(LESSC_SHELL) -M $(TEMPLATE_LESS)/$(LESS_ALL) $(TEMPLATE_CSS)/$(LESS_ALL_OUT))

$(TEMPLATE_CSS)/%.css: $(TEMPLATE_LESS)/%.less $(LESS_MIXINS_DEPS)
	@mkdir -p $(@D)
	$(ENV) $(LESSC) $(LESSC_FLAGS) $< $@

js: $(JS_ALL_OUT)

$(JS_ALL_OUT): $(RJS_BUILD_CONF) $(JS_DEPS)
	$(ENV) $(RJS) -o $< $(RJS_FLAGS)

clean:
	rm -rf $(TEMPLATE_CSS)
	rm -rf $(TEMPLATE_RJS)

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
.SUFFIXES:
