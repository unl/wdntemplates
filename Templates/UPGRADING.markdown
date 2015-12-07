# Dreamweaver Upgrade Notes for 4.0 to 4.1

1. Make a backup of your entire site before making any modifications!
2. Download the latest dwts from http://wdn.unl.edu/download/ and place them within your local `Templates` directory.
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

**Changes to sharedcode files**: New examples for building a local footer are provided in `sharedcode/localFooter.html`. One of the examples _should_ replace your existing content for the two regions `contactinfo` and `leftcollinks`, previously filled with the files `sharedcode/footerContactInfo.html`, `sharedcode/relatedLinks.html` respectively. The examples no longer recommend adding any heading elements (`h1` - `h6`) in the local footer, instead a tag with `role=heading` will provide good accessiblity while not hurting the HTML parsed document outline. Please consider removing outdated, no longer used files from your `sharedcode` directory.

## Upgrading From Older Templates

Please read the upgrading documenation from previous releases, if necessary.

* 3.1 - https://github.com/unl/wdntemplates/blob/3.1.23/Templates/UPGRADING.markdown
* 4.0 - https://github.com/unl/wdntemplates/blob/4.0.35/Templates/UPGRADING.markdown

## A Note Regarding Server Syncing

Starting with the 4.1 release, the need to synchronize web servers with the latest framework changes has been mostly removed. If you are using the `fixed` template file, it will use https://unlcms.unl.edu/ to load all required, external framework files. If you are using SSI (server-side includes) as your server technology (usually configured as `.shtml` files on Apache HTTPD), you will still need to do minimal synchronization, as SSI does not have the ability to include files from other domains. For those that still wish to maintain their own server that does not depend on UNLcms, the `local` templates are still provided, however, you will still be required to maintain synchronization with UNLcms. For more information see http://wdn.unl.edu/synchronizing-unledu-web-framework.
