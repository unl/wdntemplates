#!/usr/bin/env php
<?php

//file_put_contents('php://stderr', phpversion() . PHP_EOL);
$content = file_get_contents('php://stdin');
$content = preg_replace('/@media [^{]*\{\s+\}/', '', $content);
$content = preg_replace_callback('/@media ([^{]*)\{((?:(?!\}\s*\}).)*\})\s*\}/is', function($matches) {
	if (strpos($matches[1], '(max-width:') !== false) {
		return '';
	}
	return $matches[2];
}, $content);

echo $content;
