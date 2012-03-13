Dreamweaver Upgrade Notes
-------------------------

- Make a backup of your entire site before making any modifications!
- Download the latest dwts from [http://wdn.unl.edu/download/] and place them within your local `Templates` directory.
- Remember to make a backup of your entire site!
- Within Dreamweaver, from the menu bar select `Modify > Templates > Update Pages...`


Updates to Content Regions
--------------------------

**Converting the page titles to `<h1>` elements:**

*Removing the old `<h1>` surrounding the titlegraphic*

- Select all files and folders EXCEPT the `Templates` folder
- Open the Find & Replace dialog box
 - Choose to search `Source Code`
 - Search for `<h1>(.*)</h1>`
 - Replace with `$1`
 - Check the `Use regular expression` option
 - Verify replacements were made correctly!

*Converting the old `<h2>` to `<h1>`*

- Select all files and folders EXCEPT the `Templates` folder
- Open the Find & Replace dialog box
 - Choose to search `Source Code`
 - Search for `<h2>(.*)</h2>`
 - Replace with `<h1>$1</h1>`
 - Check the `Use regular expression` option
 - Verify replacements were made correctly!

Upgrading From 2006 Templates
-----------------------------

Any pages converted from 2006 templates may not have a `pagetitle` region. These pages will contain the default page title which MUST be changed. The page title is now required on every page.

It may be best to find all these pages and move the page title (if any) from the `maincontent` region to the `pagetitle` region.

The 2006 templates allowed an `<h2>` subhead/tagline to be placed within the `titlegraphic` region. This MUST be removed.


