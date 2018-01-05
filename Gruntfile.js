module.exports = function (grunt) {
	// CSS files to be built (relative to less directory, no extension)
	var cssObjs = [
		'all',
		//'modules/pagination',
		//'modules/infographics',
		//'critical'
	];

	var jsCssObjs = [
		//'js-css/band_imagery',
		//'js-css/display-font',
		//'js-css/events',
		//'js-css/events-band',
		//'js-css/extlatin',
		//'js-css/formvalidator',
		//'js-css/monthwidget',
		//'js-css/notices',
		//'js-css/rsswidget',
		//'js-css/script-font',
		//'js-css/smallcaps',
		//'js-css/unlalert',
		//'plugins/qtip/wdn.qtip',
		//'plugins/ui/css/jquery-ui-wdn'
	];

	// project layout variables (directories)
	var mainDir = 'wdn',
		buildDir = 'build',
		templateDir = mainDir + '/templates_5.0',
		templateScss = templateDir + '/scss',
		templateCss = templateDir + '/css',
		templateJs = templateDir + '/js',
		builtJsDir = 'compressed',
		buildJsDir = buildDir + '/' + builtJsDir,
		templateCompileJs = templateJs + '/' + builtJsDir,
		templateIncludeDir = templateDir + '/includes',
		templateHtmlDir = 'Templates',
		templateSharedDir = 'sharedcode',
		zipDir = 'downloads',
		allSubFilesGlob = '/**';

	var hereDir = './';

	// files for keyword replacement (should match .gitattributes)
	var filterFiles = [
		templateHtmlDir + '/*.dwt*',
		templateIncludeDir + '/scriptsandstyles*.html',
		templateIncludeDir + '/speedy_body_scripts.html'
	];

	// polyfill modules that need sync loading (should match scripts loaded in debug.js)
	var polyfillMods = [
		//'modernizr-wdn',
		//'ga',
		'requireLib',
		'wdn'
	];

	var wdnBuildPlugins = [
		//'band_imagery',
		//'carousel',
		//'display-font',
		//'events-band',
		//'events',
		//'extlatin',
		//'jqueryui',
		//'mediaelement_wdn',
		//'modal',
		//'monthwidget',
		//'notice',
		//'rss_widget',
		//'script-font',
		//'smallcaps',
		//'tooltip'
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
		'!fontfaceobserver.*',
		'!fontsloaded.*',
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
	var gitFilters = require('./.git_filters/lib/git-filters.js');

	// dynamic target files built from variables above
	var scssAllFiles = {};

	cssObjs.forEach(function(file) {
		scssAllFiles[templateCss + '/' + file + '.css'] = templateScss + '/' + file + '.scss';
	});

	var scssJsFiles = {};
	jsCssObjs.forEach(function(file) {
		scssJsFiles[templateJs + '/' + file + '.css'] = templateJs + '/' + file + '.scss';
	});

	// load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
	require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        sass: {
            all: {
                files: scssAllFiles,
                options: {
                    sourceMap: true,
                    includePaths: [
                        __dirname+'/node_modules/modularscale-sass/stylesheets'
                    ]
                }
            },
            js: {
                options: {
                    sourceMap: true
                },
                files: scssJsFiles
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
						'!**/*.scss'
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
			css: [templateCss].concat(Object.keys(scssJsFiles)),
			js: [templateCompileJs],
			"js-build": [buildJsDir],
			dist: [zipDir + '/*.zip', zipDir + '/*.gz']
		},

    	includes: {
        	build: {
            	cwd: buildDir,
            	src: '*.html',
            	dest: templateIncludeDir,
            	options: {
                	flatten: true,
                	includePath: [templateCss, templateCompileJs]
            	}
        	}
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
			main: ['sass:all', 'js'],
			dist: ['zip', 'archive']
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

		archive: {
			wdn: {
				src: [mainDir],
				dest: zipDir + '/wdn.tar.gz',
			},
			includes: {
				src: [templateIncludeDir],
				dest: zipDir + '/wdn_includes.tar.gz',
			},
			templates: {
				src: [templateHtmlDir, templateSharedDir],
				dest: zipDir + '/UNLTemplates.tar.gz'
			}
		},

		watch: {
			sass: {
				files: [templateScss + '/**/*.scss', templateJs + '/js-css/*.scss'],
				tasks: ['sass']
			},
//			js: {
//				files: [templateJs + '/**/*.js', '!' + templateCompileJs + '/**/*.js'],
//				tasks: ['js']
//			},
//			includes: {
//				files: [buildDir + '/**/*.html', templateScss + '/**/*.scss', templateJs + '/js-css/*.scss'],
//				tasks: ['includes']
//			}
		}
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

	grunt.registerMultiTask('archive', 'Archive files together', function() {
		var fs = require('fs');
		var path = require('path');
		var tar = require('tar-fs');
		var zlib = require('zlib');

		// XZ modules has some compiler problems ATM
		// var xz = require('xz');

		var done = this.async();

		// Fallback options (e.g. base64, compression)
		var options = this.options({
			compression: 'gzip'
		});

		this.files.forEach(function(file) {
			var destDir = path.dirname(file.dest);
			// Create the destination directory
			grunt.file.mkdir(destDir);
			var destStream = fs.createWriteStream(file.dest);
			var compressionStream;

			// if (options.compression === 'gzip') {
				compressionStream = zlib.createGzip();
			// } else {
			// 	compressionStream = new xz.Compressor();
			// }

			var pack = tar.pack('./', {
				entries: file.src
			});

			pack.on('error', function(err) {
				grunt.fail.write('Something went wrong: ' + err);
				done();
			});
			destStream.on('finish', function() {
				grunt.log.ok('File "' + file.dest + '" created.');
				done();
			});

			pack.pipe(compressionStream).pipe(destStream);
		});
	});

	// establish grunt default
	grunt.registerTask('default', ['concurrent:main']);

	// legacy targets from Makefile
	grunt.registerTask('dist', ['default', 'filter-smudge', 'concurrent:dist']);
	grunt.registerTask('all', ['default']);
	grunt.registerTask('js', ['clean:js', 'sass:js', 'requirejs', 'sync:js', 'clean:js-build']);
    grunt.registerTask('css', ['sass:all']);
};
