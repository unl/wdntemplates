# Dreamweaver Upgrade Notes for 4.1 to 5.0

1. Make a backup of your entire site before making any modifications!
2. Download the latest dwts from http://wdn.unl.edu/downloads/ and place them within your local `Templates` directory.
3. Remember to make a backup of your entire site!
4. Within Dreamweaver, from the menu bar select `Modify > Templates > Update Pages...`
5. When prompted about what to do with the missing `footercontent` region, select `Nowhere` as the destination. This editable region has been replaced by a globally maintained footer.

## Updates to Content Regions

**Remove outdated HTML comments outside of HTML tag**: Use a find/replace utility to remove the following comments from the previous framework iteration.

```
<!--[if IEMobile 7 ]><html class="ie iem7"><![endif]-->
<!--[if lt IE 7 ]><html class="ie ie6" lang="en"><![endif]-->
<!--[if IE 7 ]><html class="ie ie7" lang="en"><![endif]-->
<!--[if IE 8 ]><html class="ie ie8" lang="en"><![endif]-->
<!--[if (gte IE 9)|(gt IEMobile 7) ]><html class="ie" lang="en"><![endif]-->
<!--[if !(IEMobile) | !(IE)]><!-->
```

**Changes to local example files**: Local example files have been moved from `sharedCode` to `wdn/templates_5.*/includes/local`.
The example files are now:
* app-controls.html (for app theme)
* app-search.html (for app theme)
* footer-local.html
* nav-local.html

**New hero regions** A new region called `hero` has been added as the first child of the `main` element. This is editable to allow classes to be added to change the styling of the hero. Additionally, there are two optional regions, `herogroup1` and `herogroup2`, that can be used for adding images and call to action buttons to a hero.

**Review other regions for outdated code**: Over the years the templates have evolved and developers have often placed design (css) and experience (javascript) file references in various editable regions. You should take the time to review _all_ editable regions for things that are no longer necessary or would otherwise be considered an _override_ of the framework. Specifically, the following issues have come up during transitions:

* Old CSS in the `head` region. The following HTML was only needed in 3.1 to support the new grid markup. It now conflicts with style revisions that have been made in the latest framework css. It would be a good idea to run a site-wide find/replace for references to `templates_3.1` or `templates_4.0`.

```
<link rel="stylesheet" href="/wdn/templates_3.1/css/content/grid-v3.css" />
<!--[if lt IE 9]>
    <link rel="stylesheet" type="text/css" media="all" href="/wdn/templates_3.1/css/variations/grid-v3-ie.css" />
<![endif]-->
```

* Old analytics scripts. Often appended to the removed `footercontent` region, it should be (re)moved or updated to work with the latest analytics recommendations (Universal Analytics). If you still see code like `_gaq.push`, you should look into upgrading.
* Unnecessary HTML Comments. HTML comments are found in code that looks like `<!-- [...] -->`. These can be very helpful during site development; however, they provide little-to-no value to your website end-users that still have to download them when visiting your site. Help your end-users save money on their mobile phone bills by removing comments from your production-ready site.
* Using `WDN.jQuery` or other javascript global variable/functions: Please read about our recommended javascript loader at http://wdn.unl.edu/using-requirejs
* Anything that uses IE conditional comments. _All_ legacy versions of Internet Explorer are no longer supported, and thus the use of conditional comments (for loading additional css or javascript) are highly discouraged. It would be a good idea to do a site-wide find/replace for references to `<!--[if `.
* Redundant `<link>` or `<script>` element attributes. The HTML5 specification states that `type="text/css"` is not necessary on css stylesheet `<link>`s. Likewise, `type="text/javascipt"` is not needed for javascript scripts elements.
* CSS/JavaScript cruft. We strive to include a broad amount of interface and interaction elements in the framework. While we understand that sites may have additional needs that need to be address using other 3rd-Parry/vendor plugins of css and javascript, developers should use careful discretion when adding/keeping them. Additional scripts and stylesheets add to the overall _weight_ of a page and can cause serious, noticeable decreases in site performance (include page load). Design elements like web fonts are known to add considerable size to your pages, so care should be taken when determining how/if they are used in your content design. Because javascript is out-of-sight out-of-mind for must users, developers often forget why certain scripts are included and if they are actually doing anything. Check sites for scripts that reference elements/widgets/content that may no longer exist. Just like HTML comments, css and javascript comments should be removed/minimize to reduce the amount of data that needs to be downloaded by your end-users. This includes those awkward `//<![CDATA[` and `//]]>` comments that were needed when servers deliver HTML as XML (see http://stackoverflow.com/a/66865).
* JavaScript doing the job of CSS. CSS has advanced significantly over the past few years. Things that used to require javascript intervention can often be accomplished in css, using significantly less code. Check sites for places that have javascript that changes css related properties or classes and considering learning more about how to do complex CSS3 rules.

## Upgrading From Older Templates

Please read the upgrading documentation from previous releases, if necessary.

* 3.1 - https://github.com/unl/wdntemplates/blob/3.1.23/Templates/UPGRADING.markdown
* 4.0 - https://github.com/unl/wdntemplates/blob/4.0.35/Templates/UPGRADING.markdown
* 4.1 - https://github.com/unl/wdntemplates/blob/4.1.36/Templates/UPGRADING.markdown

## A Note Regarding Server Syncing

Starting with the 4.1 release, the need to synchronize web servers with the latest framework changes has been mostly removed. If you are using the `fixed` template file, it will use https://wdn-cdn.unl.edu/ to load all required, external framework files. If you are using SSI (server-side includes) as your server technology (usually configured as `.shtml` files on Apache HTTPD), you will still need to do minimal synchronization, as SSI does not have the ability to include files from other domains. For those that still wish to maintain their own server that does not depend on UNLcms, the `local` templates are still provided, however, you will still be required to maintain synchronization with UNLcms. For more information, see http://wdn.unl.edu/synchronizing-unledu-web-framework.
