<?php

use PHPUnit\Framework\TestCase;

require_once dirname(__FILE__) . '/../../build/vendor/autoload.php';
require_once __DIR__ . '/../mod_include.php';
set_include_path('phar://' . __DIR__ . '/Services_W3C_HTMLValidator.phar/php');

class ValidationTest extends TestCase
{

  /**
   * @dataProvider fileProvider
   *
   * @param $filename
   */
  public function testHTMLValidation($filename)
  {
    $validator = new \HtmlValidator\Validator('https://validator.unl.edu/');

    $shtml = mod_include_file($filename, dirname(dirname(__DIR__)));

    $this->expectOutputString('');
    $response = $validator->validateDocument($shtml);
    if ($response->hasErrors()) {
      echo "Invalid HTML in $filename]\n";
      foreach ($response->getErrors() as $error) {
        echo '    Line:' . $error->getFirstLine() . ' Col:' . $error->getFirstColumn() . ' Message: ' . $error->getText() . PHP_EOL;
      }
    }
  }

  public function fileProvider()
  {
    $iterator = new GlobIterator(dirname(dirname(__DIR__)) . '/Templates/*.dwt', FilesystemIterator::CURRENT_AS_PATHNAME);
    $files    = [];
    foreach ($iterator as $filename) {
      $files[] = [$filename];
    }

    return $files;
  }
}
