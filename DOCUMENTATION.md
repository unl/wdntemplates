# 5.0 Development Documentation

## Folder Structure 
### Directories and Files
`js-src/`
* All files in this folder will be first copied to the `/js` folder (through the Grunt sync:js task) before require.js 
works on them
* `*.babel.js` files in the root of `js-src/` will be Babel transpiled and moved to `/js/*.js` 

`js-src/plugins`
* Place vendor libraries here

`js-src/mustard`
* Place polyfill files here that are not supported in both polyfill.io and DCF

`js-src/utility-scripts`
* Place script files here that are not require.js modules or widgets but are standalone files for transpile and 
minification purposes

`js/`
* Contain files and folders to be worked on be bundled by require.js. Files from DCF are also pulled into this folder 
when the grunt task is ran.

`js/compressed`
* Production ready JS files, containing the require.js entry file all.js

`scss/*`
* place theme SASS partials in this folder. 
* main SASS files include glob patterns that pull in DCF SASS partials for compilation

## Critical CSS
The script to remove inline critical styles once the core stylesheets have been loaded can be found in 
`js-src/utility-scripts/clearCriticalCSS.js`. If changes needs to be made to the script, grab the minified and 
transpiled version from `js/compressed/utility-scripts` and replace the one inside  of `head-2.html` include file.

## Polyfilling Browser Features
Polyfilling in 5.0 is done, for the most part, through [polyfill.io](http://polyfill.io). The script that 
dynamically load
polyfill.io synchronously is contained within `js-src/mustard-initializer.babel.js`. The mustard-initalizer.js file is 
loaded after all.js entry file has been loaded and before any of the other require modules. This sequence of loading 
is defined within the Gruntfile.js under the `polyfillMods` array.

Steps to polyfill features 
lacking in browsers are as follow: 
1. Determine if feature is supported by polyfill.io's (feature list)[https://polyfill.io/v2/docs/features/]
2. If it isn't, determine if polyfill benefits all users of _DCF_. If it does, have polyfill be included in DCF and 
brought in through the DCF package. If the polyfill use case is very niche to what we do in WDN 5.0 then place it in 
the `js-src/mustard` folder. Use unminified files only.
3. Once the polyfill file has been included in one of the above locations, implementing the polyfill can be done in 
two ways:
    1. Determine if the polyfill can be included only when there are modules that make use of the polyfill and then 
    conditionally require the polyfill through feature testing (e.g.cutting-the-mustard). 
        * For example the dialog-polyfill.js is only used inside of the `js-src/dialog-helper.babel.js` instead of being brought in on every single page. Inside the same file, further feature testing is done to 
        conditionally require the polyfill for browsers that don't currently support the dialog element (e.g. Firefox)
    2. If the polyfill's use case is broad (e.g. object-fit polyfill) or the above step is not possible, then you can
     add the polyfill to `js-src/mustard-initializer.babel.js` by feature-testing and conditionally requiring the polyfill. This works best when your polyfill automatically polyfills the window global scope.
     