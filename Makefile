export PATH := $(PATH):build/bin
ENV := /usr/bin/env

MAIN_DIR := wdn
TEMPLATE_DIR := $(MAIN_DIR)/templates_4.0
TEMPLATE_LESS := $(TEMPLATE_DIR)/less
TEMPLATE_CSS := $(TEMPLATE_DIR)/css
TEMPLATE_JS := $(TEMPLATE_DIR)/scripts
TEMPLATE_RJS := $(TEMPLATE_JS)/compressed

GIT := git
PERL := perl

LESSC := lessc
LESSC_FLAGS := --clean-css
LESSC_SHELL := $(ENV) PATH=$(PATH) $(LESSC)

LESS_MIXINS := $(TEMPLATE_LESS)/_mixins/all.less
LESS_MIXINS_DEPS := $(filter %.less, $(shell $(LESSC_SHELL) -M $(LESS_MIXINS) .tmp))
LESS_ALL := all.less
LESS_ALL_OUT := all.css
LESS_ALL_OUT_IE := all_oldie.css
CSS_OBJS := \
	$(TEMPLATE_CSS)/$(LESS_ALL_OUT) \
	$(TEMPLATE_CSS)/$(LESS_ALL_OUT_IE) \
	$(TEMPLATE_CSS)/ie.css \
	$(TEMPLATE_CSS)/print.css \
	$(TEMPLATE_CSS)/layouts/events.css \
	$(TEMPLATE_CSS)/layouts/events-band.css \
	$(TEMPLATE_CSS)/layouts/formvalidator.css \
	$(TEMPLATE_CSS)/layouts/monthwidget.css \
	$(TEMPLATE_CSS)/layouts/unlalert.css \
	$(TEMPLATE_CSS)/modules/band_imagery.css \
	$(TEMPLATE_CSS)/modules/notices.css \
	$(TEMPLATE_CSS)/modules/pagination.css \
	$(TEMPLATE_CSS)/modules/randomizer.css \
	$(TEMPLATE_CSS)/modules/rsswidget.css \
	$(TEMPLATE_CSS)/modules/vcard.css \
	$(TEMPLATE_CSS)/modules/infographics.css \
	$(TEMPLATE_JS)/plugins/qtip/wdn.qtip.css \
	$(TEMPLATE_JS)/plugins/qtip/wdn.qtip.min.css

MQ_STRIP := build/mq-strip.pl

RJS := r.js
RJS_FLAGS :=
RJS_BUILD_CONF := build/build.js
JS_ALL_OUT := $(TEMPLATE_RJS)/all.js
JS_DEPS := $(TEMPLATE_JS)/*.js

SMUDGE_STATUS := $(shell $(GIT) config filter.rcs-keywords.smudge)

all: envtest less js

less: $(CSS_OBJS)

$(shell $(LESSC_SHELL) -M $(TEMPLATE_LESS)/$(LESS_ALL) $(TEMPLATE_CSS)/$(LESS_ALL_OUT))

$(shell $(LESSC_SHELL) -M $(TEMPLATE_LESS)/$(LESS_ALL) $(TEMPLATE_CSS)/$(LESS_ALL_OUT_IE))
	$(ENV) $(LESSC) $(TEMPLATE_LESS)/$(LESS_ALL) | $(MQ_STRIP) | $(ENV) $(LESSC) $(LESSC_FLAGS) - > $@

$(TEMPLATE_CSS)/%.css: $(TEMPLATE_LESS)/%.less $(LESS_MIXINS_DEPS)
	@mkdir -p $(@D)
	$(ENV) $(LESSC) $(LESSC_FLAGS) $< $@

$(TEMPLATE_JS)/plugins/qtip/wdn.qtip.css: $(TEMPLATE_JS)/plugins/qtip/wdn.qtip.less $(TEMPLATE_JS)/plugins/qtip/jquery.qtip.css $(LESS_MIXINS_DEPS)
	$(ENV) $(LESSC) $< $@

$(TEMPLATE_JS)/plugins/qtip/wdn.qtip.min.css: $(TEMPLATE_JS)/plugins/qtip/wdn.qtip.less $(TEMPLATE_JS)/plugins/qtip/jquery.qtip.css $(LESS_MIXINS_DEPS)
	$(ENV) $(LESSC) $(LESSC_FLAGS) $< $@

js: $(JS_ALL_OUT)

$(JS_ALL_OUT): $(RJS_BUILD_CONF) $(JS_DEPS)
	$(ENV) $(RJS) -o $< $(RJS_FLAGS)

envtest:
	@LESSC=$(LESSC) ./scripts/envtest.sh

clean:
	rm -rf $(TEMPLATE_CSS)
	rm -rf $(TEMPLATE_RJS)

dist: all
	@if test -z "$(SMUDGE_STATUS)"; then \
		./scripts/smudge.sh; \
	fi
	zip -qr downloads/wdn.zip $(MAIN_DIR)
	zip -qr downloads/wdn_includes.zip $(TEMPLATE_DIR)/includes
	zip -qr downloads/UNLTemplates.zip Templates sharedcode
	@if test -z "$(SMUDGE_STATUS)"; then \
		./scripts/clean.sh; \
	fi
	
.PHONY: all clean less js dist envtest
.SUFFIXES:
