module.exports = function (grunt) {
  // CSS files to be built (relative to less directory, no extension)
  let cssObjs = [
    'pre',
    'critical',
    'deprecated',
    'legacy',
    'main',
    'print',
    //'modules/pagination',
    //'modules/infographics',
  ];

  let jsCssObjs = [
    'js-css/band_imagery',
    'js-css/events-band',
    'js-css/events',
    'js-css/formvalidator',
    'js-css/font-serif',
    'js-css/modals',
    'js-css/monthwidget',
    'js-css/notices',
    'js-css/slideshows',
    'js-css/tabs',
    'js-css/unlalert',
    'plugins/ui/css/jquery-ui-wdn'
  ];

  // project layout variables (directories)
  let mainDir = 'wdn',                                    // wdn
    buildDir = 'build',                                   // build
    templateDir = mainDir + '/templates_5.3',             // wdn/templates_5.3
    templateImages = templateDir + '/images',             // wdn/templates_5.3/images
    templateScss = templateDir + '/scss',                 // wdn/templates_5.3/scss
    templateCss = templateDir + '/css',                   // wdn/templates_5.3/css
    templateJs = templateDir + '/js',                     // wdn/templates_5.3/js
    templateJsSrc = templateDir + '/js-src',              // wdn/templates_5.3/js-src
    templateJsCss = templateJs + '/js-css',               // wdn/templates_5.3/js/js-css
    builtJsDir = 'compressed',                            // compressed
    buildJsDir = buildDir + '/' + builtJsDir,             // build/compressed - folder removed at end of grunt js task
    templateCompileJs = templateJs + '/' + builtJsDir,    // wdn/templates_5.3/js/compressed
    templateIncludeDir = templateDir + '/includes',       // wdn/templates_5.3/includes
    templateHtmlDir = 'Templates',                        // Templates
    templateSharedDir = 'sharedcode',                     // sharedcode
    zipDir = 'downloads',                                 // downloads
    allSubFilesGlob = '/**';

  let hereDir = './';

  // files for keyword replacement (e.g. DEP_VERSION)(should match .gitattributes file)
  let filterFiles = [
    templateHtmlDir + '/*.dwt*',
    templateIncludeDir + '/global/*.html',
    templateIncludeDir + '/local/*.html',
  ];

  // polyfill modules that need sync loading (should match scripts loaded in debug.js)
  let polyfillMods = [
    'mustard-initializer', // make sure that polyfill.io and other mustard are loaded first before other scripts
    'ga',
    'requireLib',
    'wdn'
  ];

  // modules added here will be added to rjsConfig modules below
  let wdnBuildPlugins = [
    'band_imagery',
    'carousel',
    'datepickers',
    'events-band',
    'events',
    'font-serif',
    'jqueryui',
    'mediaelement_wdn',
    'modal',
    'monthwidget',
    'notice',
    'scroll-animations',
    'slideshows',
    'tabs'
  ];

  // module exclusions for plugins not built into all
  let wdnPluginExclusions = [
    'require-css/css',
    'require-css/normalize',
    'jquery',
    'wdn'
  ];

  /**
  /* Array containing bundled files created by rjs in build/compressed to be
  /* excluded from being copied/synced back to template's js/compressed folder
   */
  let syncJsIgnore = [
    '!build.txt',
    '!js-css/**',
    '!analytics.*',
    '!debug.*',
    '!fontfaceobserver.*',
    '!fontsloaded.*',
    '!ga.*',
    '!jquery.*',
    '!legacy.*',
    '!main-execute-mods.*',
    '!main-wdn-plugins.*',
    '!main.*',
    '!navigation.*',
    '!require.*',
    '!require-css/**',
    '!search.*',
    '!skipnav.*',
    '!unlalert.*',
    '!wdn*',
    '!cta-nav.*'
  ];

  // requirejs configuration and customization options
  let rjsCliFlags = (grunt.option('rjs-flags') || '').split(' ');
  let rjsConfig = {
    moduleConfig : {
      wdnTemplatePath: '/',
      unlChatURL: false
    },
    appDir: templateJs + '/',
    baseUrl: './',
    dir: buildJsDir, /** dir path to save build output, dir is removed at end of js task by clean:js, not using
      keepBuildDir option */
    optimize: 'none',
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
      //specify modules to include their immediate and deep dependencies in the final module file
      // pro: one less HTTP request, con: if other modules share the same dependency, then dependency is not reusable
      {
        name: 'all',
        create: true,
        include: polyfillMods.concat(['main', 'require-css/css']),
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

  /**
   * Add modules specified in wdnBuildPlugins into rjsConfig.modules
   * to have their dependencies bundled into a single module file
   */
   wdnBuildPlugins.forEach(function(plugin) {
    rjsConfig.modules.push({
      name: plugin,
      exclude: wdnPluginExclusions
    });
  });

  // common variables for task configuration
  let gitFilters = require('./.git_filters/lib/git-filters.js');

  // dynamic target files built from variables above
  let scssGlobAllTmpFiles = {}; // contains file names of temp scss files built from scss globber
  cssObjs.forEach(function(file) {
    scssGlobAllTmpFiles[file + '.tmp.scss'] = file + '.scss';
  });

  let scssAllFiles = {}; // contains file patterns of temp scss files to compile scss from
  cssObjs.forEach(function(file) {
    if (file.startsWith('pre')) return; // exclude this from Sass files compiled to CSS
    scssAllFiles[templateCss + '/' + file + '.css'] = templateScss + '/' + file + '.tmp.scss';
  });

  let scssJsFiles = {};
  jsCssObjs.forEach(function(file) {
    scssJsFiles[templateJs + '/' + file + '.css'] = templateJsSrc + '/' + file + '.scss';
  });

  // load all grunt plugins matching the ['grunt-*', '@*/grunt-*'] patterns
  require('load-grunt-tasks')(grunt);
  let nodeSass = require('node-sass');
  let jpegrecompress = require('imagemin-jpeg-recompress')
  let svgo = require('imagemin-svgo')
  let webp = require('imagemin-webp');
  let zopfli = require('imagemin-zopfli');

  /**
   * Setting up grunt tasks
   */
  grunt.initConfig({

    imagemin: {
      jpegrecompress: {
        options: {
          use: [jpegrecompress({
            accurate: true
          })]
        },
        files: [{
          expand: true,
          cwd: templateImages + '/src',
          src: '*.jpg',
          dest: templateImages
        }]
      },
      svgo: {
        options: {
          use: [svgo({
            removeViewBox: false
          })]
        },
        files: [{
          expand: true,
          cwd: templateImages + '/src',
          src: '*.svg',
          dest: templateImages
        }]
      },
      webp: {
        options: {
          use: [webp({
            quality: 75
          })]
        },
        files: [{
          expand: true,
          cwd: templateImages + '/src',
          src: ['*.jpg', '*.png'],
          dest: templateImages,
          ext: '.webp'
        }]
      },
      zopfli: {
        options: {
          use: [zopfli({
            more: true
          })]
        },
        files: [{
          expand: true,
          cwd: templateImages + '/src',
          src: '*.png',
          dest: templateImages
        }]
      }
    },

    stylelint: {
      options: {
        configFile: '.stylelintrc',
        syntax: 'scss'
      },
      src: [
        templateScss + '/**/*.scss'
      ]
    },

    sassGlobber: {
      options: {sassRoot: templateScss},
      all: {
        files: [scssGlobAllTmpFiles]
      }
    },

    sass: {
      main: {
        options: {
          implementation: nodeSass,
          sourceMap: true,
          precision: 2,
        },
        files: scssAllFiles
      },
      plugins: {
        options: {
          implementation: nodeSass,
          sourceMap: true,
          precision: 2,
        },
        files: scssJsFiles
      }
    },

    postcss: {
      main: {
        options: {
          processors: [
            require('postcss-normalize')({allowDuplicates: true}),
            require('autoprefixer')(),
            require('cssnano')()
          ],
          map: true
        },
        src: templateCss + '/*.css'
      },
      plugins: {
        options: {
          processors: [
            require('autoprefixer')(),
            require('cssnano')()
          ],
          map: true
        },
        src: templateJsCss + '/*.css'
      }
    },

    //set babel preset in .babelrc file
    "babel": {
      options: {
        //let rjs generate the sourcemap
        sourceMap: false
      },
      wdn: {
        'expand': true,
        'cwd': templateJsSrc,
        'src': ['**/*.babel.js'],
        'dest': templateJs,
        'ext': '.js'
      },
      dcfUtility: {
        'expand': true,
        'cwd': 'node_modules/dcf/js',
        'src': ['**/dcf-utility.js'],
        'dest': templateJs,
        'ext': '.js'
      },
      dcf: {
        'expand': true,
        'cwd': 'node_modules/dcf/js',
        'src': ['**/*.js', '!**/dcf-utility.js'],
        'dest': templateJs,
        'ext': '.js'
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
            '!**/*.scss',
            '!**/*.src.js',
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
      scss: Object.keys(scssGlobAllTmpFiles).map((fileName) => `${templateScss}/${fileName}`),
      css: [templateCss].concat(Object.keys(scssJsFiles)),
      js: [templateJs],
      "js-build": [buildJsDir],
      dist: [zipDir + '/*.zip', zipDir + '/*.gz']
    },

    copy: {
      babelNoTranspile: {
        files: [{
          expand: true,
          cwd: templateJsSrc,
          src: ['**', '!**/*.babel.js'],
          dest: templateJs,
          filter: 'isFile'
        }]
      }
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
      main: ['css-main', 'js'],
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
        files: [templateScss + '/**/*.scss', templateJsSrc + '/js-css/*.scss'],
        tasks: ['sassGlobber', 'sass', 'postcss']
      },
      js: {
        files: [templateJs + '/**/*.js', '!' + templateCompileJs + '/**/*.js'],
        tasks: ['js']
      },
      includes: {
        files: [buildDir + '/**/*.html', templateScss + '/**/*.scss', templateJs + '/js-css/*.scss'],
        tasks: ['includes']
      }
    },

  });

  // keyword replacement task: restore keywords
  grunt.registerTask('filter-clean', 'Clean files that are tagged for git filters', function() {
    let opts = this.options({files:[]});
    let files = grunt.file.expand(opts.files);
    files.forEach(function(input) {
      grunt.file.write(input, gitFilters.clean(grunt.file.read(input), true));
    });
  });

  // keyword replacement task: replace keywords
  grunt.registerTask('filter-smudge', 'Smudge files that are tagged for git filters', function() {
    let opts = this.options({files:[]});
    let files = grunt.file.expand(opts.files);
    files.forEach(function(input) {
      gitFilters._startSmudge(input);
      grunt.file.write(input, gitFilters.smudge(grunt.file.read(input), true));
    });
  });

  grunt.registerMultiTask('archive', 'Archive files together', function() {
    let fs = require('fs');
    let path = require('path');
    let tar = require('tar-fs');
    let zlib = require('zlib');

    // XZ modules has some compiler problems ATM
    // let xz = require('xz');

    let done = this.async();

    // Fallback options (e.g. base64, compression)
    let options = this.options({
      compression: 'gzip'
    });

    this.files.forEach(function(file) {
      let destDir = path.dirname(file.dest);
      // Create the destination directory
      grunt.file.mkdir(destDir);
      let destStream = fs.createWriteStream(file.dest);
      let compressionStream;

      // if (options.compression === 'gzip') {
      compressionStream = zlib.createGzip();
      // } else {
      // 	compressionStream = new xz.Compressor();
      // }

      let pack = tar.pack('./', {
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

  grunt.registerTask('images', ['newer:imagemin']);
  grunt.registerTask('css-main', ['sassGlobber', 'sass:main', 'postcss:main']);
  grunt.registerTask('css-plugins', ['sassGlobber', 'sass:plugins', 'postcss:plugins']);
  grunt.registerTask('js-main', ['css-plugins', 'babel:dcfUtility', 'babel:dcf', 'babel:wdn', 'copy:babelNoTranspile', 'requirejs', 'sync:js', 'clean:js-build']);
  grunt.registerTask('js', ['clean:js', 'css-plugins', 'babel:wdn', 'copy:babelNoTranspile', 'requirejs', 'sync:js', 'clean:js-build']);

  // establish grunt composed tasks
  // TODO check with Ryan if sassGlobber needs to be at the start of Grunt task
  grunt.registerTask('default', ['images', 'sassGlobber', 'clean:js', 'css-main', 'js-main']);
  // legacy targets from Makefile
  grunt.registerTask('dist', ['default', 'filter-smudge', 'concurrent:dist']);
  grunt.registerTask('all', ['default']);  /** mark for deletion */
};
