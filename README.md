# UNL WDN Templates

The template files are developed and maintained by the [Web Developer Network](https://wdn.unl.edu/) (WDN) at the [University of Nebraska-Lincoln](https://www.unl.edu/). These templates are made up of HTML, CSS and JavaScript to power the underlying web presence.

## Template Usage

Template usage is subject to the [WDN Terms of Use](https://wdn.unl.edu/unledu-web-framework-terms-use).

### Templates Available

All templates variations utilize the same HTML markup, with an exception of the body class, ex: `class="document"`.

## Collaboration

All members of the WDN are invited to contribute to this project. Please make a fork of the [main repository](https://github.com/unl/wdntemplates) for local development. Once you have created and tested your code, please send a pull request to the main repository.

## Building Template Resources

Much of the template CSS and JavaScript is built using aggregators, preprocessors, and/or "minifiers". You can build a local copy of these resources with the following instructions as your guide.

The resources are built using a Gruntfile. The following tools are required to be installed.

* [Git](https://git-scm.com/) -- version control system
* [NodeJS](https://nodejs.org/) -- used to run the libraries that process and minimize LESS and JavaScript files
* [Grunt](https://gruntjs.com) -- The Grunt CLI must be installed ( `npm install -g grunt-cli` ) in order to build.

Installing the additional resources necessary to build the system can be downloaded by running `npm install` from the project root.

Once all of the above dependencies are met, simply running Grunt `grunt` at the project root will build all resources. The following are all of the supported targets.

* `default` or `all` - builds all needed CSS and JavaScript
* `clean` - removes all built files
* `js-main` - builds and minifies combined JavaScript
* `css-main` - builds all CSS files from their SCSS partials and passed through postcss
* `dist` - builds the ZIP's used for template distribution. Also does smudging of keywords such as $DEP_VERSION$ in dwt and include files

The JavaScript build process can be further customized by passing parameters. The following are the flags that are supported.

__EXAMPLE:__ Build for use in a special CDN or server location
`grunt --rjs-flags="wdnTemplatePath=//www.unl.edu/"`

__EXAMPLE:__ Customize the UNLchat url.  Could be useful for integrating a custom instance of UNLchat or for development
`grunt --rjs-flags="unlChatURl=//ucommchat-test.unl.edu/assests/js"`

__EXAMPLE:__ Build for use in debug mode for analytics
`grunt --rjs-flags="debug_mode=true"`

__EXAMPLE:__  Customize the Analytics Measurement ID
`grunt --rjs-flags="wdnProp=G-9DM5F2WV3Y"`

__EXAMPLE:__ Two or more parameters are separated with a space
`grunt --rjs-flags="wdnTemplatePath=//www.unl.edu/ unlChatURl=//ucommchat-test.unl.edu/assests/js"`

__PLEASE NOTE:__ The build process has been optimized for a Linux or OS X environment. While it is technically possible to build on Windows, the specifics of setting up your environment correctly are beyond the scope of this project.

## Further support

Support of the UNL Templates is coordinated and communicated through the [WDN](https://wdn.unl.edu/).

# 5.3 Development Documentation  for Developers

## Folder Structure
### Directories
__`templates_5.3/js-src/`__
* contains JavaScript source files.
* All files in this folder will be first copied to the
`templates_5.3/js` folder (through the Grunt sync:js task) before require.js works on them
* `*.babel.js` files will be transpiled and outputted to `/js/*.js`

`templates_5.3/js-src/plugins/`
* Place vendor libraries here

`templates_5.3/js-src/mustard/`
* Place polyfill files here that are not supported in both polyfill.io and DCF

`templates_5.3/js-src/utility-scripts/`
* Place script files here that are not require.js modules or widgets but are standalone files for transpile and minification purposes

__`templates_5.3/js/`__
* Contain files and folders to be worked and bundled by require.js. Files from DCF are also pulled into this folder when the Grunt task `js-main` is ran

`templates_5.3/js/compressed/`
* Production-ready JS files, containing the require.js entry file _all.js_

__`templates_5.3/scss/*`__
* place theme SASS partials in this folder.
* main SASS files include glob patterns that will pull in DCF SASS partials for compilation
* `tmp.scss` files can be used to import styles into other projects. The most likely use case will be to use `pre.tmp.scss` to import framework variables, mixins and functions.

__`scripts/`__
* contains bash scripts for deployment and distribution

### Files
`.gitattributes`
* path to files that contain keywords such as $id$ and $DEP_VERSION$ that needs to be replaced with git commit
information by the `filter-clean` and `filter-smudge` Grunt tasks.
* Paths in this file must match the `filterFiles` variable inside of Gruntfile.js

`.git_filters/lib/git-filters.js`
* contain git filter clean and smudging methods that is imported into Gruntfile.js as gitFilters variable. Methods
are used in the `filter-clean` and `filter-smudge` Grunt tasks.

## Critical CSS
The script to remove inline critical styles once the core stylesheets have been loaded can be found in
`js-src/utility-scripts/clearCriticalCSS.js`. If changes needs to be made to the script, grab the minified and
transpiled version from `js/compressed/utility-scripts` and replace the one inside  of `head-2.html` include file.

## Polyfilling Browser Features
Polyfilling in 5.3 is done, for the most part, through [polyfill.io](https://polyfill.io). The script that
dynamically loads polyfill.io synchronously is contained within `js-src/mustard-initializer.babel.js`.
The mustard-initalizer.js file is loaded after all.js entry file has been loaded and before any of the
other require modules. This sequence of loading is defined within the Gruntfile.js under the `polyfillMods` array.

Steps to polyfill features
lacking in browsers are as follow:
1. Determine if feature is supported by polyfill.io's [feature list](https://polyfill.io/v2/docs/features/)
2. If it isn't, determine if polyfill benefits all users of _DCF_. If it does, then polyfill should be included in DCF and brought in through the DCF package.
If the polyfill use case is very niche to what we do in WDN 5.3 then place it in the `js-src/mustard` folder. Use _unminified_ files only.
3. Once the polyfill file has been included in one of the above locations, implementing the polyfill can be done in two ways:
    1. Determine if the polyfill can be included only in the modules that make use of it and then
    conditionally require the polyfill through feature testing (e.g.cutting-the-mustard).
        * For example the dialog-polyfill.js is only used inside of the `js-src/dialog-helper.babel.js` instead of being
        brought in on every single page. Inside the same file, further feature testing is done to
        conditionally require the polyfill for browsers that don't currently support the dialog element (e.g. Firefox)
    2. If the polyfill's use case is broad (e.g. object-fit polyfill) or the above step is not possible, then you can
     add the polyfill to `js-src/mustard-initializer.babel.js` by feature-testing and conditionally requiring the polyfill.
     This works best when your polyfill automatically polyfills the window global scope.

