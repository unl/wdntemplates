--TEST--
Validate all SHTML .dwt files to ensure they're valid
--FILE--
<?php
require_once __DIR__ . '/../mod_include.php';

set_include_path('phar://' . __DIR__ . '/Services_W3C_HTMLValidator.phar/php');

require_once 'Services/W3C/HTMLValidator.php';

$files = new GlobIterator(dirname(dirname(__DIR__)) . '/Templates/*.dwt', FilesystemIterator::CURRENT_AS_PATHNAME);

$validator = new Services_W3C_HTMLValidator();

foreach ($files as $filename) {
    $shtml = mod_include_file($filename, dirname(dirname(__DIR__)));

    $response = $validator->validateFragment($shtml);
    if (!$response->isValid()) {
        echo "Invalid HTML in $filename]\n";
        foreach ($response->errors as $error) {
            echo '    Line:' . $error->line . ' Col:' . $error->col . ' Message: ' . $error->message . PHP_EOL;
        }
    }
}


?>
===DONE===
--EXPECT--
===DONE===