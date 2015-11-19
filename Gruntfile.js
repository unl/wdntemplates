module.exports = function (grunt) {
    // CSS files to be built (relative to less directory, no extension)
    var cssObjs = [
		'all',
		'ie',
		'print',
		'modules/pagination',
		'modules/vcard',
		'modules/infographics'
    ];

    var jsCssObjs = [
        'js-css/band_imagery',
        'js-css/events',
    	'js-css/events-band',
    	'js-css/extlatin',
    	'js-css/formvalidator',
    	'js-css/monthwidget',
    	'js-css/notices',
    	'js-css/rsswidget',
    	'js-css/smallcaps',
    	'js-css/unlalert',
    	'plugins/qtip/wdn.qtip',
    	'plugins/ui/css/jquery-ui-wdn'
    ];

    // project layout variables (directories)
    var mainDir = 'wdn',
	    templateDir = mainDir + '/templates_4.1',
	    templateLess = templateDir + '/less',
	    templateCss = templateDir + '/css',
	    templateJs = templateDir + '/scripts',
	    builtJsDir = 'compressed',
	    buildJsDir = 'build/' + builtJsDir,
	    templateCompileJs = templateJs + '/' + builtJsDir,
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

    // polyfill modules that need sync loading (should match scripts loaded in debug.js)
    var polyfillMods = [
    	'modernizr-wdn',
    	'ga',
		'requireLib',
		'wdn'
    ];

    var wdnBuildPlugins = [
    	'band_imagery',
    	'carousel',
    	'events-band',
    	'events',
    	'extlatin',
    	'jqueryui',
    	'mediaelement_wdn',
    	'modal',
    	'monthwidget',
    	'notice',
    	'rss_widget',
    	'smallcaps',
    	'tooltip'
    ];

    // module exclustions for plugins not built into all
    var wdnPluginExclusions = [
    	'require-css/css',
    	'require-css/normalize',
    	'jquery',
    	'wdn',
    	'plugins/hoverIntent/jquery.hoverIntent'
    ];

    // exclude build/bundled files from sync back to wdn folder
    var syncJsIgnore = [
    	'!build.txt',
    	'!js-css/**',
    	'!analytics.*',
    	'!debug.*',
    	'!form_validation.*',
    	'!ga.*',
    	'!jquery.*',
    	'!legacy.*',
    	'!main-execute-mods.*',
    	'!main-wdn-plugins.*',
    	'!main.*',
    	'!modernizr*',
    	'!navigation.*',
    	'!require.*',
    	'!require-css/**',
    	'!search.*',
    	'!skipnav.*',
    	'!socialmediashare.*',
    	'!unlalert.*',
    	'!wdn*'
    ];

    // requirejs configuration and customization options
    var rjsCliFlags = (grunt.option('rjs-flags') || '').split(' ');
    var rjsConfig = {
    	moduleConfig : {
    		wdnTemplatePath: '/',
    	    unlChatURL: false
    	},
    	appDir: templateJs + '/',
    	baseUrl: './',
    	dir: buildJsDir,
        optimize: 'uglify2',
        logLevel: 2,
        preserveLicenseComments: false,
        generateSourceMaps: true,
        paths: {
        	'requireLib': 'require'
        },
        map: {
        	"*": {
        		css: 'require-css/css'
        	}
    	},
        modules: [
            {
            	name: 'all',
            	create: true,
        		include: polyfillMods.concat('main'),
        		exclude: ['require-css/normalize']
            }
        ],
        onBuildRead: function (moduleName, path, contents) {
    		if (moduleName === 'wdn') {
    			if (this.moduleConfig.wdnTemplatePath) {
    				contents = contents.replace(/\/\/#TEMPLATE_PATH/, 'template_path="' + this.moduleConfig.wdnTemplatePath + '";');
    			}
    		} else if (moduleName === 'main') {
                if (this.moduleConfig.unlChatURL) {
                    contents = contents.replace(/\/\/#UNLCHAT_URL/, 'unlchat_url="' + this.moduleConfig.unlChatURL + '";');
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

    	rjsConfig.moduleConfig[flagPair[0]] = flagPair[1] || true;
    });

    rjsConfig.deployRoot = rjsConfig.moduleConfig.wdnTemplatePath + templateCompileJs + '/';

    wdnBuildPlugins.forEach(function(plugin) {
    	rjsConfig.modules.push({
        	name: plugin,
        	exclude: wdnPluginExclusions
        });
    });

    // common variables for task configuration
	var autoprefixPlugin = new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]});
    var lessPluginCleanCss = new (require('less-plugin-clean-css'))();
    var gitFilters = require('./.git_filters/lib/git-filters.js');

    // dynamic target files built from variables above
    var lessAllFiles = {};

    cssObjs.forEach(function(file) {
        lessAllFiles[templateCss + '/' + file + '.css'] = templateLess + '/' + file + '.less';
    });

    var lessJsFiles = {};
    jsCssObjs.forEach(function(file) {
    	lessJsFiles[templateJs + '/' + file + '.css'] = templateJs + '/' + file + '.less';
    });

    var lessAllIEFiles = {};
    lessAllIEFiles[templateCss + '/all_oldie.css'] = templateLess + '/all.less';

    // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
    	less: {
    		all: {
    			options: {
    				paths: ['./wdn/templates_4.1/less'],
    				plugins: [
						autoprefixPlugin,
						lessPluginCleanCss
					]
    			},
    			files: lessAllFiles
    		},
    		"all-ie": {
    			options: {
    				paths: ['./wdn/templates_4.1/less'],
    			},
    			files: lessAllIEFiles
    		},
    		js: {
    			options: {
    				paths: ['./wdn/templates_4.1/less'],
    				plugins: [
						lessPluginCleanCss
					]
    			},
    			files: lessJsFiles
    		}
    	},

    	requirejs: {
    		all: {
    			options: rjsConfig
    		}
    	},

    	sync: {
    		js: {
    			files: [{
    				cwd: buildJsDir,
    				src: [
    					'**',
    					'!**/*.patch',
    					'!**/*.md',
    					'!**/*.less'
					].concat(syncJsIgnore),
    				dest: templateCompileJs
    			}]
    		}
    	},

    	bump: {
    		options: {
    			files: ['package.json', 'VERSION_DEP'],
    			commitMessage: 'Bumped dependency version number to %VERSION%',
    			commitFiles: ['package.json', 'VERSION_DEP'],
    			tagName: '%VERSION%',
    			tagMessage: 'Release %VERSION%',
				regExp: /((?:['"]?version['"]?\s*:\s*['"]?)?)(\d+\.\d+\.\d+(-dev\.\d+)?(-\d+)?)[\dA-a.-]*(['"]?)/i
    		}
    	},

    	clean: {
			css: [templateCss].concat(Object.keys(lessJsFiles)),
			js: [templateCompileJs],
			"js-build": [buildJsDir],
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
    		main: ['less:all', 'js', 'ie-css']
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
    			tasks: ['js']
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
        	var CleanCSS = require('clean-css');
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
    grunt.registerTask('js', ['clean:js', 'less:js', 'requirejs', 'sync:js', 'clean:js-build']);
};
