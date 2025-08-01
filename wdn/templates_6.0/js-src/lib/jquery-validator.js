(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
	var version = '2.0',
	sValidation = 'validation',
	sDataValidation = sValidation,
	sValidate = 'validate',
	sInput = ':input',
	sVisible = ':visible',
	sChecked = ':checked',
	sClickInput = '[type="radio"], [type="checkbox"]',
	sReset = '[type="reset"]',
	sAdvice = 'advice',
	sAdviceCnt = sAdvice + '-container',
	sCntCls = 'input-box',
	sReqCls = 'required-entry',
	sPass = 'passed',
	sFail = 'failed',
	sError = 'error',
	sVPassCls = sValidation + '-' + sPass,
	sVFailCls = sValidation + '-' + sFail,
	sVErrorCls = sValidation + '-' + sError,
	sVAdviceCls = sValidation + '-' + sAdvice,
	sAdvicesSel = '.' + sVAdviceCls + ' li',
	sEvtForm = sValidate + '-form',
	sEvtElm = sValidate + '-element',
	sEvtUpdate = sValidate + '-update';

	var K = function(x) { return x; };
	var parseNumber = function(v) {
	    if (typeof v != 'string') {
	        return parseFloat(v);
	    }

	    var isDot  = v.indexOf('.');
	    var isComa = v.indexOf(',');

	    if (isDot != -1 && isComa != -1) {
	        if (isComa > isDot) {
	            v = v.replace('.', '').replace(',', '.');
	        }
	        else {
	            v = v.replace(',', '');
	        }
	    }
	    else if (isComa != -1) {
	        v = v.replace(',', '.');
	    }

	    return parseFloat(v);
	};

	$.all = function(collection, callback) {
		var result = true;
		if (collection) {
			callback = callback || K;
			$.each(collection, function(idx, val) {
				result = result && callback(val, idx);
				return result;
			});
		}
		return result;
	};
	$.any = function(collection, callback) {
		var result = false;
		if (collection) {
			callback = callback || K;
			$.each(collection, function(idx, val) {
				result = callback(val, idx);
				return !result;
			});
		}
		return result;
	};

	var Validator, Validation;

	Validator = function(className, error, test, options) {
		if (typeof test == 'function') {
			this.options = options;
			this._test = test;
		} else {
			this.options = test;
			this._test = function() { return true; };
		}
		this.error = error || 'Validation failed.';
	};
	Validator.prototype = {
		test : function(v, elm, suite) {
			var result = this._test(v, elm, suite);
			if (result) {
				result = $.all(this.options, function(value, key) {
					if (Validator.methods[key]) {
						return Validator.methods[key](v, elm, value, suite);
					}
					return true;
				});
			}
			return result;
		}
	};

	Validator.methods = {
		pattern : function(v,elm,opt) {
			return opt.test(v);
		},
		minLength : function(v,elm,opt) {
			return v.length >= opt;
		},
		maxLength : function(v,elm,opt) {
			return v.length <= opt;
		},
		min : function(v,elm,opt) {
			return v >= parseFloat(opt);
		},
		max : function(v,elm,opt) {
			return v <= parseFloat(opt);
		},
		notOneOf : function(v,elm,opt) {
			return $.all(opt, function(value) {
				return v != value;
			});
		},
		oneOf : function(v,elm,opt) {
			return $.any(opt, function(value) {
				return v == value;
			});
		},
		is : function(v,elm,opt) {
			return v == opt;
		},
		isNot : function(v,elm,opt) {
			return v != opt;
		},
		equalToField : function(v,elm,opt) {
			return v == $(opt).val();
		},
		notEqualToField : function(v,elm,opt) {
			return v != $(opt).val();
		},
		include : function(v,elm,opt,suite) {
			return $.all(opt, function(value) {
				if (Validation.methods[value]) {
					return Validation.methods[value].test(v,elm,suite);
				}
				return true;
			});
		}
	};

	Validation = function(form, options) {
		this.form = form;
		if (!this.form) {
			return;
		}
		this.options = options;

		if (this.options.onSubmit) {
			this.form.submit($.proxy(this.onSubmit, this));
		}

		if (this.options.immediate) {
			this.form.on('change blur', sInput, $.proxy(this.onChange, this));
		}

		if (this.options.onReset) {
			this.form.on('click', sReset, $.proxy(this.reset, this));
		}
	};
	Validation.prototype = {
		onChange : function(ev) {
			Validation.isOnChange = true;
			var elm = ev.target;
			this.resetElement(elm);
			this.validateField(elm);
			Validation.isOnChange = false;
		},
		onSubmit : function() {
			if (!this.validate()) {
				return false;
			}
		},
		validate : function() {
			var result = false,
			results = [],
			self = this;

			$(sAdvicesSel, this.form).hide();
			try {
				$(sInput, this.form).each(function() {
					var result = self.validateField(this);
					results.push(result);
					if (self.options.stopOnFirst && !result) {
						return result;
					}
				});
			} catch (e) {
				results.push(false);
			}

			var result = $.all(results);
			if (!result && this.options.focusOnError) {
				$('.' + sVFailCls, this.form).filter(sInput + sVisible).first().focus();
			}
			this.form.triggerHandler(sEvtForm, [result]);

			return result;
		},
		validateField : function(elm) {
			var self = this,
			classlist = elm.classList || elm.className.split(/\s+/);
			elm = $(elm);

			var result = $.all(classlist, function (item) {
				if (item && Validation.methods[item]) {
					var test = self.validateTest(item, elm);
					elm.triggerHandler(sEvtElm, [test]);
					return test;
				}
				return true;
			});
			return result;
		},
		validateTest : function(name, elm) {
			var v = Validation.methods[name];
			if (elm.is(sVisible) && !v.test(elm.val(), elm, this)) {
				Validation.showAdvice(name, elm, this.options);
				elm.triggerHandler(sEvtUpdate, [sFail]);

				return false;
			} else {
				elm.triggerHandler(sEvtUpdate, [sPass]);
				elm.removeClass(sVFailCls).addClass(sVPassCls);
	            if (this.options.addClassNameToContainer) {
	            	var container = Validation.getContainer(elm, this.options);
	            	if (!$('.' + sVFailCls, container).length) {
	            		if ($.trim(elm.val()) || !elm.is(sVisible)) {
	            			container.addClass(sVPassCls);
	            		} else {
	            			container.removeClass(sVPassCls);
	            		}
	            		container.removeClass(sVErrorCls);
	            	}
	            }

	            return true;
			}
		},
		reset : function() {
			var self = this;
			$(sInput, this.form).each(function() {
				self.resetElement(this);
			});
		},
		resetElement : function (elm) {
			elm = $(elm);
			var advices = Validation.getAdviceContainer(elm, this.options);
			$(sAdvicesSel, advices).hide();
			elm.removeClass(sVFailCls);
            elm.removeClass(sVPassCls);
            if (this.options.addClassNameToContainer) {
            	var container = Validation.getContainer(elm, this.options);
            	container.removeClass(sVPassCls).removeClass(sVFailCls);
            }
		}
	};

	var tmpName = 'IsEmpty', emptyTest = tmpName, m = {};

	m[tmpName] = new Validator(tmpName, '', function(v) {
		return $.trim(v) === '';
	});

	tmpName = sReqCls;
	m[tmpName] = new Validator(tmpName, 'This is a required field.', function(v) {
		return !m[emptyTest].test(v);
	});

	tmpName = sValidate + '-number';
	m[tmpName] = new Validator(tmpName, 'Please enter a valid number in this field.', function(v) {
		return m[emptyTest].test(v) || !isNaN(parseNumber(v));
	});

	tmpName = sValidate + '-digits';
	m[tmpName] = new Validator(tmpName, 'Please use numbers only in this field. please avoid spaces or other characters such as dots or commas.', function(v) {
		return m[emptyTest].test(v) ||  !/[^\d]/.test(v);
	});

	tmpName = sValidate + '-alpha';
	m[tmpName] = new Validator(tmpName, 'Please use letters only (a-z or A-Z) in this field.', function(v) {
		 return m[emptyTest].test(v) ||  /^[a-zA-Z]+$/.test(v);
	});

	tmpName = sValidate + '-code';
	m[tmpName] = new Validator(tmpName, 'Please use only letters (a-z), numbers (0-9) or underscore(_) in this field, first character should be a letter.', function(v) {
		return m[emptyTest].test(v) ||  /^[a-z]+[a-z0-9_]+$/.test(v);
	});

	tmpName = sValidate + '-alphanum';
	m[tmpName] = new Validator(tmpName, 'Please use only letters (a-z or A-Z) or numbers (0-9) only in this field. No spaces or other characters are allowed.', function(v) {
		return m[emptyTest].test(v) ||  /^[a-zA-Z0-9]+$/.test(v);
	});

	tmpName = sValidate + '-phoneStrict';
	m[tmpName] = new Validator(tmpName, 'Please enter a valid phone number. For example (123) 456-7890 or 123-456-7890.', function(v) {
		return m[emptyTest].test(v) || /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/.test(v);
	});

	tmpName = sValidate + '-phoneLax';
	m[tmpName] = new Validator(tmpName, 'Please enter a valid phone number. For example (123) 456-7890 or 123-456-7890.', function(v) {
		return m[emptyTest].test(v) || /^((\d[-. ]?)?((\(\d{3}\))|\d{3}))?[-. ]?\d{3}[-. ]?\d{4}$/.test(v);
	});

	tmpName = sValidate + '-date';
	m[tmpName] = new Validator(tmpName, 'Please enter a valid date.', function(v) {
		var test = new Date(v);
        return m[emptyTest].test(v) || !isNaN(test);
	});

	tmpName = sValidate + '-email';
	m[tmpName] = new Validator(tmpName, 'Please enter a valid email address. For example johndoe@domain.com', function(v) {
		return m[emptyTest].test(v) || /^[a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]+(\.[a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,})/i.test(v);
	});

	tmpName = sValidate + '-url';
	m[tmpName] = new Validator(tmpName, 'Please enter a valid URL. http:// is required', function(v) {
		return m[emptyTest].test(v) || /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(v);
	});

	tmpName = sValidate + '-zip';
	m[tmpName] = new Validator(tmpName, 'Please enter a valid zip code. For example 90602 or 90602-1234.', function(v) {
		return m[emptyTest].test(v) || /^\d{5}(-\d{4})?$/.test(v);
	});

	tmpName = sValidate + '-currency-dollar';
	m[tmpName] = new Validator(tmpName, 'Please enter a valid $ amount. For example $100.00.', function(v) {
		return m[emptyTest].test(v) ||  /^\$?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/.test(v);
	});

	tmpName = sValidate + '-one-required';
	m[tmpName] = new Validator(tmpName, 'Please select one of the above options.', function(v, elm, suite) {
		var options = $(sInput, Validation.getContainer(elm, suite.options));
		return $.any(options, function(elm) {
			var r = $(elm).val();
			if ($(elm).is(sClickInput)) {
				r = r && $(elm).is(sChecked);
			}
			return r;
		});
	});

	tmpName = sValidate + '-one-required-by-name';
	m[tmpName] = new Validator(tmpName, 'Please select one of the options.', function(v, elm) {
		var cleanName = elm.attr('name').replace(/([\\"])/g, '\\$1'),
		inputs = $('input[name="' + cleanName + '"]' + sChecked, elm[0].form);
		return inputs.length > 0;
	});

	tmpName = sValidate + '-unsigned-number';
	m[tmpName] = new Validator(tmpName, 'Please enter a valid number in this field.', function(v) {
		v = parseNumber(v);
        return (!isNaN(v) && v>=0);
	});

	tmpName = sValidate + '-greater-than-zero';
	m[tmpName] = new Validator(tmpName, 'Please enter a number greater than 0 in this field.', function(v) {
		if (v.length) {
			return parseFloat(v) > 0;
		}
		return true;
	});

	tmpName = sValidate + '-zero-or-greater';
	m[tmpName] = new Validator(tmpName, 'Please enter a number 0 or greater in this field.', function(v) {
		if (v.length) {
			return parseFloat(v) >= 0;
		}
		return true;
	});

	tmpName = sValidate + '-percents';
	m[tmpName] = new Validator(tmpName, 'Please enter a number lower than 100', {min:0, max:100});

	Validation.methods = m;

	Validation.getContainer = function(elm, options) {
		var container;
		if (options.containerClassName) {
			var parents = elm.parents('.' + options.containerClassName);
			if (parents.length) {
				container = parents.first();
			}
		}
		if (!container) {
			container = elm.parent();
		}

		return container;
	};
	Validation.getAdviceContainer = function(elm, options) {
		var adviceContainer = elm.closest('.' + sAdviceCnt);
		if (!adviceContainer.length) {
			adviceContainer = Validation.getContainer(elm, options);
		}

		return adviceContainer;
	};
	Validation.showAdvice = function(name, elm, options) {
		var container = Validation.getContainer(elm, options);
		if (options.addClassNameToContainer) {
			container.removeClass(sVPassCls).addClass(sVErrorCls);
		}

		var adviceContainer = elm.closest('.' + sAdviceCnt);
		if (!adviceContainer.length) {
			elm.removeClass(sVPassCls).addClass(sVFailCls);
		} else {
			adviceContainer.removeClass(sVPassCls).addClass(sVFailCls);
			container = adviceContainer;
		}

		var advices = container.children('.' + sVAdviceCls);
		if (!advices.length) {
			advices = $('<ul/>', { "class": sVAdviceCls});
			container.append(advices);
		}

		var cls = sAdvice + '-' + name, advice = $('li.' + cls, advices);
		if (!advice.length) {
			advice = $('<li/>', {"class": cls}).hide();
			var v = Validation.methods[name];
			var errorMsg;
			if (options.useTitles && elm.attr('title')) {
				errorMsg = elm.attr('title');
			}
			if (!errorMsg) {
				errorMsg = v.error;
			}
			advice.text(errorMsg).appendTo(advices);
		}

		advice.show();
	};

	$.fn.validation = function(options) {
		var opts = $.extend({}, $.fn.validation.defaults, options);

		this.each(function() {
			if (!$(this).data(sDataValidation)) {
				$(this).data(sDataValidation, new Validation($(this), opts));
			}
		});

		return this;
	};

	$.fn.validation.defaults = {
		onSubmit : true,
		onReset : true,
		stopOnFirst : false,
		immediate : false,
		focusOnError : true,
		useTitles : false,
		addClassNameToContainer: false,
		containerClassName: sCntCls
	};

	$.validation = {
		addMethod : function(className, error, test, options) {
			Validation.methods[className] = new Validator(className, error, test, options);
		},
		version : version
	};
}));
