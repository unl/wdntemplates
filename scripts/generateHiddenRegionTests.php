<?php

$page_to_copy = file_get_contents(__DIR__ . '/../debug.shtml');

$hide_classes = [
    'hide-wdn_institution_title',
    'hide-wdn_identity_management',
    'hide-breadcrumbs',
    'hide-wdn_navigation_wrapper',
    'hide-pagetitle',
    'hide-wdn_footer_related',
    'hide-wdn_footer_contact',
    'hide-wdn_copyright',
    'hide-wdn_attribution',
    'hide-wdn_logos',
];

foreach ($hide_classes as $class) {
    $page = str_ireplace('<body class="debug"', '<body class="debug '.$class.'"', $page_to_copy);
    file_put_contents(__DIR__ . '/../tmp-'.$class.'.shtml', $page);
}
