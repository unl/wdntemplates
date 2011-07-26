<?php
    header('Content-type: text/css');
    echo <<<EOD
/**
 * This file is an add-on for the UNL WDN templates in Dreamweaver.
 * http://wdn.unl.edu/
 *
 * These styles can be assign in Dreamweaver's "Design-Time" renderer
 * Using the instructions found at
 * CS5/5.5: http://help.adobe.com/en_US/dreamweaver/cs/using/WScbb6b82af5544594822510a94ae8d65-7e17a.html
 * CS4: http://help.adobe.com/en_US/Dreamweaver/10.0_Using/WScbb6b82af5544594822510a94ae8d65-7e17a.html
 * CS3: http://livedocs.adobe.com/en_US/Dreamweaver/9.0/WScbb6b82af5544594822510a94ae8d65-7e17.html
 */

html{
    font-size: 100%;
}
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, /*tbody, tfoot, thead, tr, th, td,*/
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
    display: block;
}
body {
    line-height: 1;
    font-size: 1em;
}
ol, ul {
    list-style: none;
}
blockquote, q {
    quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
    content: '';
    content: none;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}

EOD;
    ob_start("compressDt");
    function compressDt($buffer) {
        $buffer = str_replace('/* DESIGNTIME */', '> *', $buffer);
        /* remove comments */
        $buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer);
        /* remove tabs, spaces, newlines, etc. */
        $buffer = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $buffer);
        $buffer = str_replace(', ', ',', $buffer);
        return $buffer;
    }

    /* your css files */
    $files = array(
    'wrapper',
    'grid',
    'header/header',
    'header/toolbarcontent',
    'header/tooltabs',
    'header/toolbar',
    'header/idm',
    'header/colorbox',
    'navigation/breadcrumbs',
    'navigation/navigation',
    'footer/feedback',
    'footer/footer',
    'footer/rating',
    'content/basestyles',
    'content/tabs',
    'content/columns',
    'content/headers',
    'content/images',
    'content/mime',
    'content/titlegraphic',
    'content/zenbox',
    'content/zentable',
    'variations/liquid',
    'variations/fixed',
    'variations/popup',
    'variations/document',
    'variations/secure',
    'fonts/fonts',
    );
    foreach ($files as $file) {
        $dir = '';
        if (strpos($file,'/')!==false) {
            list($dir) = explode('/',$file);
            $dir .= '/';
        }
        $corrected = convertPaths(file_get_contents(dirname(__FILE__)."/../css/$file.css"), $dir);
        echo preg_replace('/\@import[\s]+url\(.*\);/', '', $corrected);
    }

    ob_end_flush();
?>