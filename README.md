# UNL WDN Templates

The template files are developed and maintained by the [Web Developer Network](http://wdn.unl.edu/) (WDN) at the [University of Nebraska-Lincoln](http://www.unl.edu/). These templates are made up of HTML, CSS and JS to power the underlying web presence.

## Template Usage

Template usage is subject to the [WDN Terms of Use](http://www1.unl.edu/wdn/wiki/Terms_of_Use).

### Templates Available

All templates variations utilize the same HTML markup, with an exception of the body class, ex: `class="document"`.

## Collaboration

All members of the WDN are invited to contribute to this project. Please make a fork of the [main repository](https://github.com/unl/wdntemplates) for local development. Once you have created and tested your code, please send a pull request to the main repository.

### Building Template Resources

Much of the template CSS and JavaScript is built using aggregators, preprocessors, and/or "minifiers". You can build a local copy of these resources with the following instructions as your guide.

The resources are built using a standard Makefile for [GNU Make](http://www.gnu.org/software/make/). The Makefile uses a few additional build dependencies that MUST be installed prior to building.

* [Git](http://git-scm.com/) -- version control system
* [Java](http://www.oracle.com/technetwork/java/javase/downloads/index.html) OR [UglifyJS](https://github.com/mishoo/UglifyJS) -- used for "minifying" javascript
* [NodeJS](http://www.nodejs.org/) -- used to run the libraries that convert LESS to CSS and, optionally, UglifyJS
* [PHP](http://php.net) v5.3+  -- used as a file aggregator and an extension of GNU Make (php-cli; server not necessary)

Once all of the above dependencies are met, simply running GNU Make `make` at the project root will build all resources. The following are all of the supported targets for `make`.

* `all` - builds all needed CSS and JavaScript
* `clean` - removes all built files
* `debug` - builds debugging CSS files
* `less` - builds all CSS files from their LESS counterparts
* `zips` - builds the ZIP's used for template distribution

The JavaScript build process can be further customized by passing some flags via an environment variable to GNU Make (`COMPRESS_FLAGS`). The following are the flags that are supported.

* `-f` - Force all resources to be rebuilt
* `-c [closure|uglify-js]` - JavaScript compiler option
* `-v` - Output verbose build progress
* `-d <string>` - The source path to the template resource directory
* `-p <string>` - The URI path to where the templates will be accessed via the web server (the default is the server root `/`)

__EXAMPLE:__ Force a rebuild and use the uglifyJS library
`COMPRESS_FLAGS="-c uglify-js -f" make`

__EXAMPLE:__ Build for use in a special CDN or server location
`COMPRESS_FLAGS="-p //www.unl.edu/" make`

__PLEASE NOTE:__ The build process has been optimized for a Linux or OS X environment. While it is technically possible to build on Windows, the specifics of setting up your environment correctly are beyond the scope of this project.

## Further support

Support of the UNL Templates is coordinated and communicated through the [WDN](http://wdn.unl.edu/).