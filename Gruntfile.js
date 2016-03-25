module.exports = function (grunt) {
	// CSS files to be built (relative to less directory, no extension)
	var cssObjs = [
		'all',
		'print',
		'modules/pagination',
		'modules/infographics'
	];

	var jsCssObjs = [
		'js-css/band_imagery',
		'js-css/display-font',
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

	var hereDir = './';

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
		'display-font',
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

	// load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		less: {
			all: {
				options: {
					paths: [hereDir + templateLess],
					plugins: [
						autoprefixPlugin,
						lessPluginCleanCss
					]
				},
				files: lessAllFiles
			},
			js: {
				options: {
					paths: [hereDir + templateLess],
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
			dist: [zipDir + '/*.zip', zipDir + '/*.xz']
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
			main: ['less:all', 'js'],
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
				dest: zipDir + '/wdn.tar.xz',
			},
			includes: {
				src: [templateIncludeDir],
				dest: zipDir + '/wdn_includes.tar.xz',
			},
			templates: {
				src: [templateHtmlDir, templateSharedDir],
				dest: zipDir + '/UNLTemplates.tar.xz'
			}
		},

		watch: {
			less: {
				files: [templateLess + '/**/*.less', templateJs + '/js-css/*.less'],
				tasks: ['less']
			},
			js: {
				files: [templateJs + '/**/*.js', '!' + templateCompileJs + '/**/*.js'],
				tasks: ['js']
			}
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
		var xz = require('xz');

		var done = this.async();

		// Fallback options (e.g. base64, compression)
		var options = this.options({
			compression: 'xz'
		});

		this.files.forEach(function(file) {
			var destDir = path.dirname(file.dest);
			// Create the destination directory
			grunt.file.mkdir(destDir);
			var destStream = fs.createWriteStream(file.dest);
			var compressionStream;

			if (options.compression === 'gzip') {
				compressionStream = zlib.createGzip();
			} else {
				compressionStream = new xz.Compressor();
			}

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
	grunt.registerTask('js', ['clean:js', 'less:js', 'requirejs', 'sync:js', 'clean:js-build']);
};
