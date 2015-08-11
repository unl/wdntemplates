--TEST--
Validate all SHTML .dwt files to ensure they're valid
--FILE--
<?php
require_once dirname(__FILE__) . '/../../build/vendor/autoload.php';
require_once __DIR__ . '/../mod_include.php';

set_include_path('phar://' . __DIR__ . '/Services_W3C_HTMLValidator.phar/php');

$files = new GlobIterator(dirname(dirname(__DIR__)) . '/Templates/*.dwt', FilesystemIterator::CURRENT_AS_PATHNAME);

$validator = new \HtmlValidator\Validator('https://validator.unl.edu/');

foreach ($files as $filename) {
    $shtml = mod_include_file($filename, dirname(dirname(__DIR__)));

    $response = $validator->validateDocument($shtml);
    if ($response->hasErrors()) {
        echo "Invalid HTML in $filename]\n";
        foreach ($response->getErrors() as $error) {
            echo '    Line:' . $error->getFirstLine() . ' Col:' . $error->getFirstColumn() . ' Message: ' . $error->getText() . PHP_EOL;
        }
    }
}

?>
===DONE===
--EXPECT--
===DONE===