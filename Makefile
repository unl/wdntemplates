# Target Directories
BUILD_DIR := build
NODE_DIR := $(BUILD_DIR)/node_modules

# NodeJS Find/Install + PATH Update
NODE_PATH := $(shell $(BUILD_DIR)/find-node-or-install)
PATH := $(NODE_PATH):$(shell echo $$PATH)

# Build Tools
GIT := git
PERL := perl

LESSC := $(NODE_DIR)/less/bin/lessc
LESSC_FLAGS := --clean-css

RJS := $(NODE_DIR)/requirejs/bin/r.js
RJS_FLAGS :=

MQ_STRIP := $(BUILD_DIR)/mq-strip.pl

# lessc is required for Makefile generation
LESSC_EXISTS := $(shell [ -x $(LESSC) ] && echo ok)
ifndef LESSC_EXISTS
	override LESSC_EXISTS := $(shell npm --prefix $(BUILD_DIR) install less)
	override LESSC := $(NODE_DIR)/less/bin/lessc
endif

# Ensure we are using the correct tool version
ENV_TEST := $(shell LESSC=$(LESSC) $(BUILD_DIR)/envtest.sh)
ifdef ENV_TEST
	$(error $(ENV_TEST))
endif

SMUDGE_STATUS := $(shell $(GIT) config filter.rcs-keywords.smudge)

# Project related directories
MAIN_DIR := wdn
TEMPLATE_DIR := $(MAIN_DIR)/templates_4.0
TEMPLATE_LESS := $(TEMPLATE_DIR)/less
TEMPLATE_CSS := $(TEMPLATE_DIR)/css
TEMPLATE_JS := $(TEMPLATE_DIR)/scripts
TEMPLATE_RJS := $(TEMPLATE_JS)/compressed

# less Targets and Dependencies
LESS_MIXINS := $(TEMPLATE_LESS)/_mixins/all.less
LESS_MIXINS_DEPS := $(filter %.less, $(shell $(LESSC) -M $(LESS_MIXINS) .tmp))
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

# JavaScript build configuration
RJS_BUILD_CONF := $(BUILD_DIR)/build.js
JS_ALL_OUT := $(TEMPLATE_RJS)/all.js
JS_DEPS := $(TEMPLATE_JS)/*.js

all: less js

less: $(CSS_OBJS)

$(shell $(LESSC) -M $(TEMPLATE_LESS)/$(LESS_ALL) $(TEMPLATE_CSS)/$(LESS_ALL_OUT))

$(shell $(LESSC) -M $(TEMPLATE_LESS)/$(LESS_ALL) $(TEMPLATE_CSS)/$(LESS_ALL_OUT_IE))
	$(LESSC) $(TEMPLATE_LESS)/$(LESS_ALL) | $(MQ_STRIP) | $(LESSC) $(LESSC_FLAGS) - > $@

$(TEMPLATE_CSS)/%.css: $(TEMPLATE_LESS)/%.less $(LESS_MIXINS_DEPS) $(LESSC)
	@mkdir -p $(@D)
	$(LESSC) $(LESSC_FLAGS) $< $@

$(TEMPLATE_JS)/plugins/qtip/wdn.qtip.css: $(TEMPLATE_JS)/plugins/qtip/wdn.qtip.less $(TEMPLATE_JS)/plugins/qtip/jquery.qtip.css $(LESS_MIXINS_DEPS)
	$(LESSC) $< $@

$(TEMPLATE_JS)/plugins/qtip/wdn.qtip.min.css: $(TEMPLATE_JS)/plugins/qtip/wdn.qtip.less $(TEMPLATE_JS)/plugins/qtip/jquery.qtip.css $(LESS_MIXINS_DEPS)
	$(LESSC) $(LESSC_FLAGS) $< $@
	
$(LESSC):
	npm --prefix $(BUILD_DIR) install lessc
	
js: $(JS_ALL_OUT)

$(JS_ALL_OUT): $(RJS_BUILD_CONF) $(JS_DEPS) $(RJS)
	$(RJS) -o $< $(RJS_FLAGS)
	
$(RJS):
	npm --prefix $(BUILD_DIR) install requirejs
	
clean:
	rm -rf $(TEMPLATE_CSS)
	rm -rf $(TEMPLATE_RJS)
	rm -rf $(NODE_DIR)

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
	
.PHONY: all clean less js dist
.SUFFIXES:
