--TEST--
Validate all SHTML .dwt files to ensure they're valid
--SKIPIF--
die("Skipped: the validator service is no longer working");
--FILE--
<?php
require_once __DIR__ . '/../mod_include.php';

set_include_path('phar://' . __DIR__ . '/Services_W3C_HTMLValidator.phar/php');

require_once 'Services/W3C/HTMLValidator.php';

$files = new GlobIterator(dirname(dirname(__DIR__)) . '/Templates/*.dwt', FilesystemIterator::CURRENT_AS_PATHNAME);

$validator = new Services_W3C_HTMLValidator(array(
    'validator_uri' => 'https://validator.unl.edu/check',
));

$request = new \HTTP_Request2();
$request->setConfig('adapter', 'HTTP_Request2_Adapter_Curl');
$validator->setRequest($request);

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