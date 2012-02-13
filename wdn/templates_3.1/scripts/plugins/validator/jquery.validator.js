(function($) {
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
		test : function(v, elm) {
			var result = this._test(v, elm);
			if (result) {
				result = $.all(this.options, function(value, key) {
					if (Validator.methods[key]) {
						return Validator.methods[key](v, elm, value);
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
		include : function(v,elm,opt) { 
			return $.all(opt, function(value) {
				if (Validation.methods[value]) {
					return Validation.methods[value].test(v,elm);
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
			var self = this;
			$(':input', this.form).each(function() {
				if ($(this).is(':radio, :checkbox')) {
					$(this).click($.proxy(self.onChange, self));
				} else {
					$(this).change($.proxy(self.onChange, self));
				}
			});
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
		onSubmit : function(ev) {
			if (!this.validate()) {
				return false;
			}
		},
		validate : function(ev) {
			var result = false;
			var useTitles = this.options.useTitles;
			var results = [];
			var self = this;
			$('.validation-advice li', this.form).hide();
			try {
				$(':input', this.form).each(function() {
					var result = self.validateField(this);
					results.push(result);
					if (self.options.stopOnFirst && !result) {
						return result;
					}
				});
			} catch (e) {
				results.push(false);
				WDN.log(e);
			}
			
			var result = $.all(results);
			if (!result && this.options.focusOnError) {
				$(':input:visible.validation-failed', this.form).first().focus();
			}
			this.form.triggerHandler('validate-form', [result]);
			
			return result;
		},
		validateField : function(elm) {
			elm = $(elm);
			var self = this,
			className = elm.attr('class'),
			classlist = [];
			
			if (className) {
				var classlist = className.split(' ');
			}
			
			var result = $.all(classlist, function (item) {
				item = $.trim(item);
				if (item && Validation.methods[item]) {
					var test = self.validateTest(item, elm);
					elm.triggerHandler('validate-element', [test]);
					return test;
				}
				return true;
			});
			return result;
		},
		validateTest : function(name, elm) {
			var v = Validation.methods[name];
			if (elm.is(':visible') && !v.test(elm.val(), elm)) {
				Validation.showAdvice(name, elm, this.options);
				elm.triggerHandler('validate-update', ['failed']);
				
				return false;
			} else {
				elm.triggerHandler('validate-update', ['passed']);
				elm.removeClass('validation-failed').addClass('validation-passed');
	            if (this.options.addClassNameToContainer) {
	            	var container = Validation.getContainer(elm, this.options);
	            	if (!$('.validation-failed', container).length) {
	            		if ($.trim(elm.val()) || !elm.is(':visible')) {
	            			container.addClass('validation-passed');
	            		} else {
	            			container.removeClass('validation-passed');
	            		}
	            		container.removeClass('validation-error');
	            	}
	            }
	            
	            return true;
			}
		},
		reset : function() {
			var self = this;
			$(':input', this.form).each(function() {
				self.resetElement(this);
			});
		},
		resetElement : function (elm) {
			elm = $(elm);
			var advices = Validation.getAdviceContainer(elm, this.options);
			$('.validation-advice li', advices).hide();
			elm.removeClass('validation-failed');
            elm.removeClass('validation-passed');
            if (this.options.addClassNameToContainer) {
            	var container = Validation.getContainer(elm, this.options);
            	containter.removeClass('validation-passed').removeClass('validation-error');
            }
		}
	};
	
	Validation.methods = {
		'IsEmpty' : new Validator('IsEmpty', '', function(v) {
			return $.trim(v) == '';
		}),
		'required-entry' : new Validator('required-entry', 'This is a required field.', function(v) { 
			return !Validation.methods['IsEmpty'].test(v);
		}),
		'validate-number' : new Validator('validate-number', 'Please enter a valid number in this field.', function(v) {
			return Validation.methods['IsEmpty'].test(v) || !isNaN(parseNumber(v));
		}),
		'validate-digits' : new Validator('validate-digits', 'Please use numbers only in this field. please avoid spaces or other characters such as dots or commas.', function(v) {
			return Validation.methods['IsEmpty'].test(v) ||  !/[^\d]/.test(v);
		}),
		'validate-alpha' : new Validator('validate-alpha', 'Please use letters only (a-z or A-Z) in this field.', function(v) {
			 return Validation.methods['IsEmpty'].test(v) ||  /^[a-zA-Z]+$/.test(v);
		}),
		'validate-code' : new Validator('validate-code', 'Please use only letters (a-z), numbers (0-9) or underscore(_) in this field, first character should be a letter.', function(v) {
			return Validation.methods['IsEmpty'].test(v) ||  /^[a-z]+[a-z0-9_]+$/.test(v);
		}),
		'validate-alphanum' : new Validator('validate-alphanum', 'Please use only letters (a-z or A-Z) or numbers (0-9) only in this field. No spaces or other characters are allowed.', function(v) {
			return Validation.methods['IsEmpty'].test(v) ||  /^[a-zA-Z0-9]+$/.test(v);
		}),
		'validate-phoneStrict' : new Validator('validate-phoneStrict', 'Please enter a valid phone number. For example (123) 456-7890 or 123-456-7890.', function(v) {
			return Validation.methods['IsEmpty'].test(v) || /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/.test(v);
		}),
		'validate-phoneLax' : new Validator('validate-phoneLax', 'Please enter a valid phone number. For example (123) 456-7890 or 123-456-7890.', function(v) {
			return Validation.methods['IsEmpty'].test(v) || /^((\d[-. ]?)?((\(\d{3}\))|\d{3}))?[-. ]?\d{3}[-. ]?\d{4}$/.test(v);
		}),
		'validate-date' : new Validator('validate-date', 'Please enter a valid date.', function(v) {
			var test = new Date(v);
            return Validation.methods['IsEmpty'].test(v) || !isNaN(test);
		}),
		'validate-email' : new Validator('validate-email', 'Please enter a valid email address. For example johndoe@domain.com', function(v) {
			return Validation.methods['IsEmpty'].test(v) || /^[a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]+(\.[a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.([a-z]{2,})/i.test(v);
		}),
		'validate-url' : new Validator('validate-url', 'Please enter a valid URL. http:// is required', function(v) {
			return Validation.methods['IsEmpty'].test(v) || /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(v);
		}),
		'validate-zip' : new Validator('validate-zip', 'Please enter a valid zip code. For example 90602 or 90602-1234.', function(v) {
			return Validation.methods['IsEmpty'].test(v) || /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(v);
		}),
		'validate-currency-dollar' : new Validator('validate-currency-dollar', 'Please enter a valid $ amount. For example $100.00.', function(v) {
			return Validation.methods['IsEmpty'].test(v) ||  /^\$?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/.test(v);
		}),
		'validate-one-required' : new Validator('validate-one-required', 'Please select one of the above options.', function(v, elm) {
			var p = elm.parent();
			var options = $(':input', p);
			return $.any(options, function(elm) {
				return $(elm).val();
			});
		}),
		'validate-one-required-by-name' : new Validator('validate-one-required-by-name', 'Please select one of the options.', function(v, elm) {
			var cleanName = elm.attr('name').replace(/([\\"])/g, '\\$1');
			var inputs = $('input[name=' + cleanName + ']:checked');
			return inputs.length > 0;
		}),
		'validate-unsigned-number' : new Validator('validate-unsigned-number', 'Please enter a valid number in this field.', function(v) {
			v = parseNumber(v);
            return (!isNaN(v) && v>=0);
		}),
		'validate-greater-than-zero' : new Validator('validate-greater-than-zero', 'Please enter a number greater than 0 in this field.', function(v) {
			if (v.length) {
				return parseFloat(v) > 0;
			}
			return true;
		}),
		'validate-zero-or-greater' : new Validator('validate-zero-or-greater', 'Please enter a number 0 or greater in this field.', function(v) {
			if (v.length) {
				return parseFloat(v) >= 0;
			}
			return true;
		}),
		'validate-percents' : new Validator('validate-percents', 'Please enter a number lower than 100', {min:0, max:100})
	};
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
		var adviceContainer = elm.closest('.advice-container');
		if (!adviceContainer.length) {
			adviceContainer = Validation.getContainer(elm, options);
		}
		
		return adviceContainer;
	};
	Validation.showAdvice = function(name, elm, options) {
		var container = Validation.getContainer(elm, options);
		if (options.addClassNameToContainer) {
			container.removeClass('validation-passed').addClass('validation-error');
		}
		
		var adviceContainer = elm.closest('.advice-container');
		if (!adviceContainer.length) {
			elm.removeClass('validation-passed').addClass('validation-failed');
		} else {
			adviceContainer.removeClass('validation-passed').addClass('validation-failed');
			container = adviceContainer;
		}
		
		var advices = container.children('.validation-advice');
		if (!advices.length) {
			advices = $('<ul class="validation-advice" />');
			container.append(advices);
		}
		
		var advice = $('li.advice-' + name, advices);
		if (!advice.length) {
			advice = $('<li class="advice-' + name + '" />').hide();
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
			if (!$(this).data('validation')) {
				$(this).data('validation', new Validation($(this), opts));
			}
		});
		
		return this;
	};
	
	$.fn.validation.defaults = {
		onSubmit : true,
		stopOnFirst : false,
		immediate : false,
		focusOnError : true,
		useTitles : false,
		addClassNameToContainer: false,
		containerClassName: 'input-box'
	};
	
	$.validation = {
		addMethod : function(className, error, test, options) {
			Validation.methods[className] = new Validator(className, error, test, options);
		}
	};
})(WDN.jQuery);