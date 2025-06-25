# WDN Templates v6.0 Migration Guide

## ZIP Download

For version 5.3 of the templates the download link ([https://wdn.unl.edu/downloads/wdn.zip](https://wdn.unl.edu/downloads/wdn.zip)) will stay the same. For 6.0 we will start appending the version number onto the zip file name ([https://wdn.unl.edu/downloads/wdn_6.0.zip](https://wdn.unl.edu/downloads/wdn_6.0.zip)). Similar things will happen to the other zip files `wdn_includes`, and `UNLTemplates`.

## CSS Changes

### Animations

`.dcf-motion-none` (renamed `.dcf-no-motion`)

`.dcf-animated` (use scroll-based animation classes instead)

### Aspect Ratio

`.dcf-ratio`, `.dcf-ratio-#x#` and `.dcf-ratio-child` (use `.dcf-#x#` directly on aspect ratio elements)

### Buttons

`.dcf-btn-icon` (code will automatically style SVGs and images contained inside buttons, no dedicated class needed)

### Grids

`.dcf-grid-halves`, `.dcf-grid-thirds`, etc. (use `.dcf-d-grid` and `.dcf-grid-cols-#` instead)

`.dcf-col-100%`, `.dcf-col-50%`, etc. (use combination of `.dcf-col-span-#`, `.dcf-col-start-#`, and `.dcf-col-end-#` instead)

### Height and Width

`.dcf-h-max-`, `.dcf-h-min-`, `.dcf-w-max-`, `.dcf-w-min-` classes (renamed `.dcf-max-h-`, `.dcf-min-h-`, `.dcf-max-w-`, `.dcf-min-w-` to better reflect the property names and to avoid confusion with use of values like min-content and max-content)

### Icons

`.dcf-icon-x` and `.dcf-icon-hang` (use flexbox or grid for this layout instead)

`.unl .dcf-icon-hang` (use flexbox or grid for this layout instead)

### Lists

`.dcf-list-bare` (use `role=”list”` instead)

### Paragraphs

`.dcf-dropcap` (renamed `.dcf-drop-cap` for consistent separation of words with dashes)

## JS Changes

### Plugin Auto Loader

The biggest change to the templates v6 is the removal of requireJS. This library is outdated and should be replaced by modern JavaScript features like ES Modules. To go along with the removal of requireJS we implemented a new plugin auto loader which will scan the page and based on the elements on the page it will load the corresponding plugin.

The plugin auto loader is configured by default to be enabled on page load and will watch all document mutations. This allows you to add any DCF/UNL component to the page and have the auto loader load the JS code and CSS styles automatically; this even works when you append the component to the page after the initial page load.

If you want to disable the auto loader or remove any components from the auto loader, you can customize the configuration to fit your needs. The `window.UNL` object contains all the configuration for the auto loader which is referenced on load. You can disable the whole auto loader or just the watcher if you do not want the auto loader to watch for page mutations.

```HTML
<script>
    // Disable auto loader (components will need to be manually loaded)
    window.UNL.autoLoader.config.enabled = false;
</script>
```

```HTML
<script>
    // Disable watcher (any components added after page load will
    //   need to be manually loaded)
    window.UNL.autoLoader.config.watch = false;
</script>
```

You can also add opt-in and opt-out selectors to customize which elements on the page are loaded by the auto loader and which ones are ignored. This can be configured globally for the whole auto loader or per plugin.

```HTML
<script>
    // There is also window.UNL.autoLoader.config.globalOptOutSelector
    window.UNL.autoLoader.config.globalOptInSelector = '.my-class-opt-in';

    // There is also window.UNL.autoLoader.config.plugins.PLUGIN.optOutSelector
    window.UNL.autoLoader.config.plugins.UNLTab.optOutSelector = '.my-tab-class-opt-in';
</script>
```

With every plugin configured in the auto loader, it will save a reference to that plugin along with every element that has been loaded by the plugin. There are events for when the plugin is initialized as well as when the plugin loads an element. You can also configure a callback for specific plugins for when they load an element.

```HTML
<script>
    document.addEventListener('UNLPluginInitialized', (e) => {
        console.log('Event Name: UNLPluginInitialized', e);
    });
    document.addEventListener('UNLPluginLoadedElement', (e) => {
        console.log('Event Name: UNLPluginLoadedElement', e);
    });
    window.UNL.autoLoader.config.plugins.UNLTab.onPluginLoadedElement = (loaded_element) => {
        console.log('Auto Loader onPluginLoadedElement:', loaded_element);
    }
</script>
```

With the changes described above, we also went through and made sure each component leverages the power of JavaScript classes. So, each instance of a component will also be an instance of a JavaScript class. This has many advantages such as allowing us to use custom methods for the components and allowing us to access the properties of each component. There are many ways to access these class instances; the primary way is to listen for the ready event dispatched by the component. Each component will dispatch a ready event once it has been fully loaded (each ready event has a distinct name based on the component). In the ready event’s details, it will provide a reference to the class instance.

```HTML
<script>
    document.getElementById('testTabs').addEventListener('tabsReady', (e) => {
        const testTabs = e.detail.classInstance;
        console.log(window.UNL.autoloader.plugins.UNLTab.elements);
    });
</script>
```

#### Things not in auto loader

Not everything is loaded through the auto loader. There are certain components which there are only one per page and are not tied to a specific element being present on the page. These are UNL alert, UNL banner, analytics, and chat.  These are loaded in the `header-global-1.js` file and have separate configuration in the `window.UNL` object. These all have their own configuration and ability to be enabled or disabled.

```HTML
<script>
    window.UNL.alert.config.enabled = false;
    window.UNL.analytics.config.enabled = false;
    window.UNL.banner.config.enabled = false;
    window.UNL.chat.config.enabled = false;
</script>
```

There are also things which are not tied to actual components which are not in the auto loader. Things such as jQuery, which is discussed later in this document.

#### Plugin vs Component

We have migrated all the code to be in plugins and components. But what are plugins and components? Components are relatively simple, it is the code that runs a specific component on the page. It manages the state of that component as well as any additional mark up it may need to build the component. Plugins are a big trickier, they are the code that lets the auto loader know what to load and how to load the component when it finds it on the page. The plugin will contain the query selector which the auto loader can use to locate any instances of the component, as well as the CSS and JS it needs to load for the component to load.

The idea behind plugins and components is we want the most minimal amount of code running on page during it's life time. If the page doesn't have a tabs component on the page then we should not be loading the styles and scripts that make the tabs component run. But we do need a little bit of code to know what to load and when to load it.

### Modals/Dialogs

Modals have been updated to use native browser dialog elements. They have also been updated to being called dialogs to match this change.

#### Dialog Changes

Button

- Updated `.dcf-btn-toggle-modal` to `.dcf-btn-toggle-dialog`
- Updated `data-toggles-modal` to `data-controls`

Dialog

- Updated `.dcf-modal` to `.dcf-dialog`
- `.dcf-dialog` must be on a dialog element
- No longer need to add hidden attribute on dialog (browser handles it for us)
- No longer need `div.dcf-modal-wrapper`
- Updated `.dcf-modal-header` to `.dcf-dialog-header`
- Updated `.dcf-modal-content` to `.dcf-dialog-content`
- Updated `.dcf-btn-close-modal` to `.dcf-btn-close-dialog`

#### Old modal

```HTML
<button
  class="dcf-btn dcf-btn-primary dcf-btn-toggle-modal"
  data-toggles-modal="test-modal-1"
  type="button"
  disabled
>Toggle Modal 1</button>

<div class="dcf-modal" id="test-modal-1" hidden>
  <div class="dcf-modal-wrapper">
    <div class="dcf-modal-header">
      <h3>Example Modal 1</h3>
      <button class="dcf-btn-close-modal">Close</button>
    </div>
    <div class="dcf-modal-content">
      <p>This is my modal content</p>
    </div>
  </div>
</div>
```

#### New dialog

```HTML
<button
  class="dcf-btn dcf-btn-primary dcf-btn-toggle-dialog"
  data-controls="test-modal-1"
  type="button"
  disabled
>Toggle Modal 1</button>

<dialog class="dcf-dialog" id="test-modal-1">
  <div class="dcf-dialog-header">
    <h3>Example Modal 1</h3>
    <button class="dcf-btn-close-dialog">Close</button>
  </div>
  <div class="dcf-dialog-content">
    <p>This is my modal content</p>
  </div>
</dialog>
```

#### Deprecated Modal Code

If you can’t update your modals to dialog elements, then we still have the old modal code available. You just need to reference the `/lib/modal.js` file.

```HTML
<script src="/wdn/templates_6.0/js/lib/modal.js" type="module"></script>
```

### Events Band/Events List

Events bands have been updated to match other components.

#### Event List Changes

- Added `.unl-event-list` class
- Added data attributes
  - `data-url` for events’ URL
    - This has been extended to allow URLs for upcoming, featured, search, audience, and event type
  - `data-layout` for the layout of the list
    - Values available are grid, band, and default (aka value unset)
  - `data-limit` for the number of events to display
  - `data-pinned_limit` for the number of events which would be allocated to the pinned events
  - `data-rooms` true or false if you want rooms to be displayed

#### Old Events Band

```HTML
<div id="events"></div>
<script>
  window.addEventListener('inlineJSReady', function() {
    WDN.initializePlugin('events', {
      container: '#events',
      layout: 'grid',
      limit: 4,
      rooms: false,
      featured: true,
      pinned_limit: 1,
    });
  });
</script>
```

#### New Events List

```HTML
<div
    class="unl-event-list"
    data-url="https://events.unl.edu/featured/"
    data-layout="grid"
    data-limit="4"
    data-pinned_limit="1"
></div>
```

### Lazy Loading

Browsers now support lazy loading of images and videos. Therefore, this JavaScript is no longer needed. For images this can be achieved by using the loading attribute set to lazy. For videos this can be achieved by using the preload attribute set to none.

#### Image Example

```HTML
<img loading=”lazy” src=”/test.png”>
```

#### Video Example

```HTML
<video preload=”none” src=”/test.mp4” controls>
```

### jQuery

To include jQuery into your project you just need to import the jQuery library. We have not updated jQuery versions.

```HTML
<script type="module">
    import $ from "/wdn/templates_6.0/js/lib/jquery.js";
    $('main').append('<p>Test</p>');
</script>
```

#### jQueryUI

To load jQuery UI and its styles you will need to import the jQuery UI plugin and initialize it.

```HTML
<script type="module">
    import * as jqueryUIPlugin from "/wdn/templates_6.0/js/plugins/plugin.jquery-ui.js";
    const $ = await jqueryUIPlugin.initialize();

    $(function() {
        $("#datepicker").datepicker();
    });
</script>
```

#### jQuery Form Validation

To load jQuery form validation and its styles you will need to import the jQuery form validation plugin.

```HTML
<script type="module">
    import * as validatorPlugin from "/wdn/templates_6.0/js/plugins/plugin.form-validator.js";
    const $ = await validatorPlugin.initialize();

    $('#test').submit((e) => {
        $('#inputTest').addClass('validation-failed');
        return false;
    });
</script>
```
