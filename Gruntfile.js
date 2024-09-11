module.exports = function (grunt) {
  // CSS files to be built (relative to less directory, no extension)
  const cssObjs = [
    'pre',
    'critical',
    'deprecated',
    'legacy',
    'main',
    'print',
    'affiliate'
  ];

  const jsCssObjs = [
    'js-css/band_imagery',
    'js-css/button-toggles',
    'js-css/collapsible-fieldsets',
    'js-css/events-band',
    'js-css/events',
    'js-css/figcaption-toggles',
    'js-css/formvalidator',
    'js-css/font-serif',
    'js-css/modals',
    'js-css/monthwidget',
    'js-css/notices',
    'js-css/popups',
    'js-css/slideshows',
    'js-css/tabs',
    'js-css/unlalert',
    'plugins/ui/css/jquery-ui-wdn'
  ];

  // project layout variables (directories)
  const mainDir = 'wdn',                                    // wdn
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
    dcfDir = templateDir + '/dcf',                        // wdn/templates_5.3/dcf
    dcfJS = dcfDir + '/js',                               // wdn/templates_5.3/dcf/js
    dcfSCSS = dcfDir + '/scss',                           // wdn/templates_5.3/dcf/scss
    dcfSrcJS = 'node_modules/dcf/js',                     // node_modules/dcf/js
    dcfSrcSCSS = 'node_modules/dcf/scss',                 // node_modules/dcf/scss
    allSubFilesGlob = '/**';

  const hereDir = './';

  // files for keyword replacement (e.g. DEP_VERSION)(should match .gitattributes file)
  const filterFiles = [
    templateHtmlDir + '/*.dwt*',
    templateIncludeDir + '/global/*.html',
    templateIncludeDir + '/local/*.html',
  ];

  // polyfill modules that need sync loading (should match scripts loaded in debug.js)
  const polyfillMods = [
    'requireLib',
    'wdn'
  ];

  // modules added here will be added to rjsConfig modules below
  const wdnBuildPlugins = [
    'autoplay-videos',
    'band_imagery',
    'carousel',
    'collapsible-fieldsets',
    'datepickers',
    'events-band',
    'events',
    'figcaption-toggles',
    'font-serif',
    'jqueryui',
    'mediaelement_wdn',
    'modal',
    'monthwidget',
    'notice',
    'popups',
    'scroll-animations',
    'search-selects',
    'slideshows',
    'tabs',
    'button-toggles',
    'gallery'
  ];

  // module exclusions for plugins not built into all
  const wdnPluginExclusions = [
    'require-css/css',
    'require-css/normalize',
    'jquery',
    'wdn',
    'banner'
  ];

  /**
  /* Array containing bundled files created by rjs in build/compressed to be
  /* excluded from being copied/synced back to template's js/compressed folder
   */
  const syncJsIgnore = [
    '!build.txt',
    '!js-css/**',
    '!analytics.*',
    '!debug.*',
    '!fontfaceobserver.*',
    '!fontsloaded.*',
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
    '!cta-nav.*',
  ];

  // requirejs configuration and customization options
  const rjsCliFlags = (grunt.option('rjs-flags') || '').split(' ');
  const rjsConfig = {
    moduleConfig : {
      wdnTemplatePath: '/',
      unlChatURL: false,
      debug_mode: false,
      wdnProp: "",
    },
    appDir: templateJs + '/',
    baseUrl: './',
    dir: buildJsDir, /** dir path to save build output, dir is removed at end of js task by clean:js, not using
      keepBuildDir option */
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
      } else if (moduleName === 'analytics') {
        if (this.moduleConfig.debug_mode) {
          contents = contents.replace(/\/\/#DEBUG_MODE/, 'debug_mode="' + this.moduleConfig.debug_mode + '";');
        }
        if (this.moduleConfig.wdnProp) {
          contents = contents.replace(/\/\/#wdnProp/, 'wdnProp="' + this.moduleConfig.wdnProp + '";');
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
  const gitFilters = require('./.git_filters/lib/git-filters.js');

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
  const sass = require('sass');
  const jpegrecompress = require('imagemin-jpeg-recompress')
  const svgo = require('imagemin-svgo')
  const webp = require('imagemin-webp');
  const zopfli = require('imagemin-zopfli');

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
          implementation: sass,
          sourceMap: true,
          precision: 2,
        },
        files: scssAllFiles
      },
      plugins: {
        options: {
          implementation: sass,
          sourceMap: true,
          precision: 2,
        },
        files: scssJsFiles
      },
    },

    replaceMapAbsolutePaths: {
      main: {
        options: {
          files: templateCss + '/*.css.map',
        }
      }, 
      plugins: {
        options: {
          files: templateJsCss + '/*.css.map',
        }
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
        sourceMap: false,
        presets: ['@babel/preset-env']
      },
      wdn: {
        'expand': true,
        'cwd': templateJsSrc,
        'src': ['**/*.babel.js'],
        'dest': templateJs,
        'ext': '.js'
      },
      dcf: {
        options: {
          //let rjs generate the sourcemap
          sourceMap: false,
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-modules-amd']
        },
        'expand': true,
        'cwd': 'node_modules/dcf/js',
        'src': ['**/*.js'],
        'dest': templateJs,
        'ext': '.js'
      },
      gsap: {
        options: {
          //let rjs generate the sourcemap
          sourceMap: false,
          presets: ['@babel/preset-env'],
        },
        'expand': true,
        'cwd': 'node_modules/gsap/dist',
        'src': ['**/*.js'],
        'dest': templateJs + '/plugins/gsap',
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
      },
    },

    copyDir: {
      'dcf-js': {
        src: dcfSrcJS,
        dest: dcfJS,
      },
      'dcf-scss': {
        src: dcfSrcSCSS,
        dest: dcfSCSS,
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

  // Dart Sass uses absolute paths and this is a work around to get them to not do that
  grunt.registerMultiTask('replaceMapAbsolutePaths', 'Replace absolute file paths in css maps', function() {
    let opts = this.options({files:[]});
    let files = grunt.file.expand(opts.files);

    files.forEach(function(file) {
      let content = grunt.file.read(file);
      let newContent = content.replace(/(file:\/\/\/[^'",]+\/wdn)+/g, '/wdn'); // Replace globally
      let newNewContent = newContent.replace(/(file:\/\/\/[^'",]+\/dcf)+/g, '/wdn/templates_5.3/dcf'); // Replace globally
      
      // Write the updated content back to the file
      grunt.file.write(file, newNewContent);
      grunt.log.writeln('Replaced text in ' + file);
    });
  });

  // Quick and dirty copy all files in directory
  // I couldn't get the normal copy working
  grunt.registerMultiTask('copyDir', 'Copy directories from src to dest', function() {
    const src = this.data.src;
    const dest = this.data.dest;

    let filesCount = 0;

    grunt.file.recurse(src, function(abspath, rootdir, subdir, filename) {
      const destPath = dest + (subdir ? '/' + subdir : '') + '/' + filename;
      grunt.file.copy(abspath, destPath);
      filesCount++;
    });
    grunt.log.writeln('Copied ' + filesCount + ' files to ' + dest);
  });


  grunt.registerMultiTask('archive', 'Archive files together', function() {
    const fs = require('fs');
    const path = require('path');
    const tar = require('tar-fs');
    const zlib = require('zlib');

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
  grunt.registerTask('css-main', ['sassGlobber', 'sass:main', 'replaceMapAbsolutePaths:main', 'postcss:main']);
  grunt.registerTask('css-plugins', ['sassGlobber', 'sass:plugins', 'replaceMapAbsolutePaths:plugins', 'postcss:plugins']);
  grunt.registerTask('js-main', ['css-plugins', 'babel:dcf', 'babel:gsap', 'babel:wdn', 'copy:babelNoTranspile', 'requirejs', 'sync:js', 'clean:js-build']);
  grunt.registerTask('js', ['clean:js', 'css-plugins', 'babel:wdn', 'copy:babelNoTranspile', 'requirejs', 'sync:js', 'clean:js-build']);
  grunt.registerTask('dcf-copy', ['copyDir:dcf-scss', 'copyDir:dcf-js']);

  // establish grunt composed tasks
  // TODO check with Ryan if sassGlobber needs to be at the start of Grunt task
  grunt.registerTask('default', ['images', 'sassGlobber', 'clean:js', 'css-main', 'js-main', 'dcf-copy']);
  // legacy targets from Makefile
  grunt.registerTask('dist', ['default', 'filter-smudge', 'concurrent:dist']);
  grunt.registerTask('all', ['default']);  /** mark for deletion */
};
