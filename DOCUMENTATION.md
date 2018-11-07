# 5.0 Development Documentation

## Folder Structure 
### Directories and Files
`js-src/`
* All files in this folder will be first copied to the `/js` folder before require.js works on them
* `*.babel.js` files in the root of `js-src` will be Babel transpiled and moved to `/js/*.js` 

`js-src/plugins`
Place vendor libraries here

`js-src/mustard`
Place polyfill files here that are not supported in both polyfill.io and DCF


## Polyfilling Browser Features
Polyfilling for 5.0 for the most part is done through [polyfill.io](http://polyfill.io). Steps to polyfill features 
lacking in browsers are as follow: 
1. Determine if feature is supported by polyfill.io's (feature list)[https://polyfill.io/v2/docs/features/]
2. If it isn't, determine if polyfill benefits all users of _DCF_. If it does, have polyfill be included in DCF and 
brought in through the DCF package. If the polyfill use case is very niche to what we do in WDN 5.0 then place it in 
the `js-src/mustard` folder. Use unminified files only.
3. Once the polyfill file has been included in one of the above locations, implementing the polyfill can be done in 
two ways:
    1. Determine if the polyfill can be included only when there are scripts that make use of the polyfill and then 
    conditionally require the polyfill through feature testing (e.g.cutting-the-mustard). 
        * For example the dialog-polyfill.js is used inside of the `js-src/dialog-helper.babel.js` instead of being 
        brought in on every single page. Inside `js-src/dialog-helper.babel.js`, further feature testing is done to 
        conditionally require the polyfill for browsers that don't currently support the dialog element (e.g. Firefox)
    2. If the polyfill's use case is broad (e.g. object-fit polyfill) or the above step is not possible, then you can
     add to the `js-src/mustard-initializer.babel.js` to feature-test and conditionally require the polyfill. This 
     works best when your polyfill automatically polyfills the window global scope.
     
