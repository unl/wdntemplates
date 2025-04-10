# UNL WDN Templates

The template files are developed and maintained by the [Web Developer Network](https://wdn.unl.edu/) (WDN) at the [University of Nebraska-Lincoln](https://www.unl.edu/). These templates are made up of HTML, CSS and JavaScript to power the underlying web presence.

## Template Usage

Template usage is subject to the [WDN Terms of Use](https://wdn.unl.edu/about-framework/terms-use/).

### Templates Available

All templates variations utilize the same HTML markup, with an exception of the body class, ex: `class="document"`.

## Collaboration

All members of the WDN are invited to contribute to this project. Please make a fork of the [main repository](https://github.com/unl/wdntemplates) for local development. Once you have created and tested your code, please send a pull request to the main repository.

## Building Template Resources

The WDN Templates uses Vite to build and process the code. Vite allows us to use
many useful features like preprocessing, minifier, js maps, tree shaking, etc.

### Installation

1. Install Git [Git installation guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. Clone the WDN Templates: `git clone https://github.com/unl/wdntemplates.git`
3. Install Node version 22.13.0 [Node installation guide](https://nodejs.org/en/download)
4. Install Node dependencies: `npm ci`
5. Run Vite build command: `npm run build`

### Installing Dev Environment (Working on DCF and WDN Templates)

1. Install using the normal installation above
2. Install DCF as another project on your machine (preferably not in the WDN templates project directory)
    1. Clone DCF: `git clone https://github.com/digitalcampusframework/dcf.git`
    2. Install DCF's Node dependencies: `npm ci`
3. Remove DCF from `node_modules` folder: `rm node_modules/dcf`
4. Create a symlink to replace DCF in `node_modules` with your cloned project: `ln -s /path/to/wdn/node_modules/dcf /path/to/your/dcf`
5. Create `.env.local` in the project root
    1. Add `DCF_DIR` to the the file and set it equal to the path to your DCF project: `DCF_DIR=/path/to/your/dcf`
        - This is to help eslint be able to find the files we reference. Not sure why it doesn't work with symlinks
    2. Add `DEVELOPMENT` to the file and et it equal to true.
        - This will make eslint run on every vite build
6. Now you should be able to work on DCF and the WDN templates side by side and have vite build use your in development DCF code
    - Reminder: Remember to set the correct branches for both projects to avoid errors
    - Tip: VSCode lets you open both projects in the same window using Workspaces

### Environment Variables

We are using Vite's environment variables to enable us to insert variables into the code.

The default values for these variables are in the `.env` file. For local
development you can create a `.env.local` which will override the default values.

| Name | Description |
| DEVELOPMENT | If set to true will load ESLint plugin in vite to prevent building unless lint passes without errors |
| DCF_DIR | Sometimes in development using a symlink to a develop DCF is helpful but that causes ESLint errors. This will let you define the path for the DCF directory if symlinks are present |

## Further support

Support of the UNL Templates is coordinated and communicated through the [WDN](https://wdn.unl.edu/).

## 5.3 Development Documentation for Developers

### Directories

__`templates_6.0/js-src/`__

Contains all the javascript for the project

__`templates_6.0/js-src/plugins/`__

Contains the plugins which contain the code required to load specific components
and features. Ideally this would contain the minimal amount of code.

Exported functions in each plugin:

| Function Name           | Async | Return Type              | Description |
| ----------------------- | ----- | ------------------------ | ----------- |
| `getQuerySelector`    | No    | String                   | Gets the query selector which is used for this plugin's component |
| `getIsInitialized`    | No    | Boolean                  | Returns if the plugin has been initialized yet |
| `initialize`            | Yes   | Void                     | Initializes plugin |
| `loadElement`          | Yes   | Class Instance           | Loads the element using the component class and returns the class instance |
| `loadElements`         | Yes   | Array of Class Instances | Loads the array elements using the component class and returns the array of class instances |
| `loadElementsOnPage` | Yes   | Array of Class Instance  | Loads the all matching elements on the page using the component class and returns the array of class instance |

__`templates_6.0/js-src/components/`__

Contains the components that are using on the page. The code consists of the
building, managing, and interacting with the component. These are typically
built atop the DCF JS components.

This should only export a class reference.

__`templates_6.0/js/`__

Contains the built, bundled, and minified JS files as well as their JS maps.

__`templates_6.0/scss/`__

Contains the SCSS for the templates which is built off the DCF SCSS. Variables
are set up to allow the WDN Templates to override the DCF defaults.

__`templates_6.0/css/`__

Contains the built, bundled, and minified CSS files.

__`scripts/`__

Contains bash scripts for deployment and distribution

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
