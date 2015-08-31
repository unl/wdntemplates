module.exports = function (grunt) {
    // CSS files to be built (relative to less directory, no extension)
    var cssObjs = [
		'all',
		'ie',
		'print',
		'layouts/events',
		'layouts/events-band',
		'layouts/extlatin',
		'layouts/formvalidator',
		'layouts/monthwidget',
		'layouts/smallcaps',
		'layouts/unlalert',
		'modules/band_imagery',
		'modules/notices',
		'modules/pagination',
		'modules/rsswidget',
		'modules/vcard',
		'modules/infographics'
    ];
    
    // project layout variables (directories)
    var mainDir = 'wdn',
	    templateDir = mainDir + '/templates_4.0',
	    templateLess = templateDir + '/less',
	    templateCss = templateDir + '/css',
	    templateJs = templateDir + '/scripts',
	    templateCompileJs = templateJs + '/compressed',
	    templateIncludeDir = templateDir + '/includes',
	    templateHtmlDir = 'Templates',
	    templateSharedDir = 'sharedcode',
	    zipDir = 'downloads',
	    allSubFilesGlob = '/**';

    // files for keyword replacement (should match .gitattributes)
    var filterFiles = [
        templateHtmlDir + '/*.dwt*',
        templateIncludeDir + '/scriptsandstyles*.html'
    ];

    // requirejs configuration and customization options
    var rjsCliFlags = (grunt.option('rjs-flags') || '').split(' ');
    var rjsConfig = {
		baseUrl: templateJs + '/',
	    paths: {
	    	'requireLib': 'require'
	    },
	    shim: {
	        'wdn_ajax': {
	        	deps: ['jquery'],
	        	exports: 'WDN.jQuery.ajaxSettings.proxyKey'
	        }
	    },
	    optimize: 'uglify2',
	    logLevel: 2,
	    preserveLicenseComments: false,
	    generateSourceMaps: true,
	    name: 'wdn',
	    include: [
	        'wdn_ajax',
	    	'requireLib',
	    	'modernizr-wdn',
	    	'ga',
	    	'main'
	    ],
	    insertRequire: ['main'],
	    wdnTemplatePath: '/',
	    unlChatURL: false,
	    out: templateCompileJs + '/all.js',
	    onBuildRead: function (moduleName, path, contents) {
			if (moduleName === 'wdn') {
				if (this.wdnTemplatePath) {
					contents = contents.replace(/\/\/#TEMPLATE_PATH/, 'template_path="' + this.wdnTemplatePath + '";');
				}

				contents += 'window.WDN.jQuery = window.jQuery.noConflict(true);\n';
			}

	        if (moduleName === 'main') {
	            if (this.unlChatURL) {
	                contents = contents.replace(/\/\/#UNLCHAT_URL/, 'unlchat_url="' + this.unlChatURL + '";');
	            }
	        }

			return contents.replace(/WDN\.log\([^)]*\);?/g, '');
	    }
	};
    
    // override requirejs config with CLI flags
    rjsCliFlags.forEach(function(flagPair) {
    	flagPair = flagPair.trim();
    	if (!flagPair) {
    		return;
    	}
    	
    	flagPair = flagPair.split('=', 2);
    	
    	rjsConfig[flagPair[0]] = flagPair[1] || true;
    });
    
    // common variables for task configuration
    var lessPluginCleanCss = new (require('less-plugin-clean-css'))();
    var gitFilters = require('./.git_filters/lib/git-filters.js');

    // dynamic target files built from variables above
    var lessAllFiles = {};

    cssObjs.forEach(function(file) {
        lessAllFiles[templateCss + '/' + file + '.css'] = templateLess + '/' + file + '.less';
    });
    
    var wdnQtipDir = templateJs + '/plugins/qtip'; 
    lessAllFiles[wdnQtipDir + '/wdn.qtip.css'] = wdnQtipDir + '/wdn.qtip.less';
    
    var lessAllIEFiles = {};
    lessAllIEFiles[templateCss + '/all_oldie.css'] = templateLess + '/all.less';
    
    // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns 
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
    	less: {
    		all: {
    			options: {
    				paths: ['./wdn/templates_4.0/less'],
    				plugins: [
						lessPluginCleanCss
					]
    			},
    			files: lessAllFiles
    		},
    		"all-ie": {
    			options: {
    				paths: ['./wdn/templates_4.0/less'],
    			},
    			files: lessAllIEFiles
    		}
    	},
    	
    	requirejs: {
    		all: {
    			options: rjsConfig
    		}
    	},
    	
    	bump: {
    		options: {
    			files: ['package.json', 'VERSION_DEP'],
    			commitMessage: 'Bumped dependency version number to %VERSION%',
    			commitFiles: ['package.json', 'VERSION_DEP'],
    			tagName: '%VERSION%',
    			tagMessage: 'Release %VERSION%',
    			regExp: new RegExp('([\'|\"]?version[\'|\"]?[ ]*:[ ]*[\'|\"]?)?(\\d+\\.\\d+\\.\\d+(-\\.\\d+)?(-\\d+)?)[\\d||A-a|.|-]*([\'|\"]?)', 'i')
    		}
    	},
    	
    	clean: {
			css: [templateCss],
			js: [templateCompileJs],
			zip: [zipDir + '/*.zip']
    	},

        "filter-clean": {
            options: {
                files: filterFiles
            }
        },

        "filter-smudge": {
            options: {
                files: filterFiles
            }
        },
    	
    	concurrent: {
    		main: ['less:all', 'requirejs', 'ie-css']
    	},
    	
    	zip: {
    		wdn: {
    			src: [mainDir + allSubFilesGlob],
    			dest: zipDir + '/wdn.zip',
    			dot: true
    		},
    		includes: {
    			src: [templateIncludeDir + allSubFilesGlob],
    			dest: zipDir + '/wdn_includes.zip',
    			dot: true
    		},
    		templates: {
    			src: [templateHtmlDir  + allSubFilesGlob, templateSharedDir + allSubFilesGlob],
    			dest: zipDir + '/UNLTemplates.zip'
    		}
    	},
    	
    	watch: {
    		less: {
    			files: templateLess + '/**/*.less',
    			tasks: ['less:all', 'ie-css']
    		},
    		js: {
    			files: [templateJs + '/**/*.js', '!' + templateCompileJs + '/**/*.js'],
    			tasks: ['requirejs']
    		}
    	}
    });
    
    // task for stripping media queries from css
    grunt.registerTask('ie-css', 'Build and filter CSS for old IE browsers', function() {
    	var precondition = 'less:all-ie';
    	var description = 'Strip media queries from compiled less';
    	var anonTask = function() {
    		grunt.task.requires(precondition);

        	var contentFile = templateCss + '/all_oldie.css';
        	var CleanCSS = require('./node_modules/less-plugin-clean-css/node_modules/clean-css');
        	var content = grunt.file.read(contentFile);

        	content = content.replace(/@media [^{]*\{\s+\}/, '');
        	content = content.replace(/@media ([^{]*)\{((?:(?!\}\s*\})[^])*\})\s*\}/i, function(match, mq, mqContent) {
        		if (mq.indexOf('(max-width:') >= 0) {
                    return '';
        		}
        		return mqContent;
        	});
        	content = new CleanCSS().minify(content).styles;

        	grunt.file.write(contentFile, content);
    	};

		grunt.task.run(precondition).then(description, anonTask);
    });
    
    // keyword replacement task: restore keywords
    grunt.registerTask('filter-clean', 'Clean files that are tagged for git filters', function() {
    	var opts = this.options({files:[]});
        var files = grunt.file.expand(opts.files);
        files.forEach(function(input) {
            grunt.file.write(input, gitFilters.clean(grunt.file.read(input), true));
        });
    });
    
    // keyword replacement task: replace keywords
    grunt.registerTask('filter-smudge', 'Smudge files that are tagged for git filters', function() {
        var opts = this.options({files:[]});
		var files = grunt.file.expand(opts.files);
		files.forEach(function(input) {
			gitFilters._startSmudge(input);
			grunt.file.write(input, gitFilters.smudge(grunt.file.read(input), true));
		});
    });
    
    // establish grunt default
    grunt.registerTask('default', ['concurrent']);
    
    // legacy targets from Makefile
    grunt.registerTask('dist', ['default', 'filter-smudge', 'zip']);
    grunt.registerTask('all', ['default']);
    grunt.registerTask('js', ['requirejs']);
};
