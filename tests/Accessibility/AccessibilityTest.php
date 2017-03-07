<?php
use PHPUnit\Framework\TestCase;

//Load composer
require_once __DIR__ . '/../../build/vendor/autoload.php';
require_once __DIR__ . '/../mod_include.php';

putenv('PATH=' . realpath(__DIR__ . '/../../node_modules/.bin') . ':' . getenv('PATH'));

class AccessibilityTest extends TestCase
{
  public static $base_url = 'http://localhost:8080/';
  
  protected $viewports = [
    [
      'width'  => 400,
      'height' => 800,
    ],
    [
      'width'  => 800,
      'height' => 800,
    ],
  ];
  
  public static function setUpBeforeClass() {
    $file = __DIR__ . '/axe.min.js';
    if (!file_exists($file)) {
      $axe = file_get_contents('https://webaudit.unl.edu/plugins/metric_axe/node_modules/axe-core/axe.min.js');
      file_put_contents($file, $axe);
    }
  }

  public function a11yDataProvider()
  {
    $data = [];

    $examples_directory = __DIR__ . '/../../wdn/templates_4.1/examples/';

    $directory_iterator = new DirectoryIterator($examples_directory);

    foreach ($this->viewports as $viewport) {
      foreach ($directory_iterator as $file_info) {
        if ($file_info->getExtension() !== 'html') {
          continue;
        }

        $data[] = [
          $file_info->getFilename(),
          $viewport['width'],
          $viewport['height'],
          $examples_directory,
        ];
      }
      break;
    }

    return $data;
  }

  /**
   * @param string $file the filename of the example page to check
   * @param        $width
   * @param        $height
   * @param        $examples_directory
   *
   * @return array|bool false on error, array of errors on success
   * @dataProvider a11yDataProvider
   *
   */
  public function testA11y($file, $width, $height, $examples_directory)
  {
    $test_name = $file . ' at ' . $width . ' x ' . $height;
    $url       = self::$base_url . 'tests/Accessibility/tmp/' . $file;
    $command   = 'phantomjs '
      . __DIR__ . '/phantomjs-axe.js '
      . escapeshellarg($url) . ' '
      . escapeshellarg($width) . ' '
      . escapeshellarg($height);

    //Prepare the DOM
    $example_html = file_get_contents($examples_directory . $file);

    $new_dom     = \HTML5::loadHTML(file_get_contents($examples_directory . 'index.shtml'));
    $example_dom = \HTML5::loadHTML($example_html);

    $main_content = $new_dom->getElementById('maincontent');
    while ($main_content->hasChildNodes()) {
      //Clear out the main content area
      $main_content->removeChild($main_content->firstChild);
    }

    if (!$example_node = $example_dom->getElementById('example-code')) {
      //The example code needs to be wrapped in a #example-code div
      return ['Missing #example-code wrapper.'];
    }

    //Import the example element into the new node
    $new_element = $new_dom->importNode($example_node, true);

    //Append the example element as the only child of the main content area
    $main_content->appendChild($new_element);

    //Save to an example file.
    $exampleSHTML = mod_include_string(\HTML5::saveHTML($new_dom), dirname(dirname(__DIR__)));
    $tmpHTMLFile  = __DIR__ . '/tmp/' . $file;
    file_put_contents($tmpHTMLFile, $exampleSHTML);

    //Run pa11y on the test page
    $output_file = __DIR__ . '/output.json';
    $errorFile   = __DIR__ . '/error_output.txt';
    $result      = exec($command . ' > ' . $output_file . ' 2>' . $errorFile);
    $errorOutput = file_get_contents($errorFile);
    $json        = trim(file_get_contents($output_file));
    unlink($output_file);
    unlink($tmpHTMLFile);
    unlink($errorFile);

    $violations = json_decode($json, true);

    if ($violations === false) {
      $this->markTestIncomplete('bad axe output for ' . $file);

      return;
    }
    
    //This is how we tell phpUnit that we don't expect any errors (if there are errors, echo details about em later)
    $this->expectOutputString('');

    if (!empty($violations) && is_array($violations)) {
      echo $test_name . ' should have no a11y problems' . PHP_EOL;
      foreach ($violations as $violation) {
        foreach ($violation['nodes'] as $node) {
          echo $url
            . "\r\n\t axe-test-id: " . $violation['id']
            . "\r\n\t help: " . $violation['help']
            . "\r\n\t description: " . $violation['description']
            . "\r\n\t target: " . print_r($node['target'], true)
            . "\r\n\t context: " . $node['html']
            . "\r\n------------\r\n";
        }
      }
    }
  }
}

if (file_exists(__DIR__ . '/../config.inc.php')) {
  require_once __DIR__ . '/../config.inc.php';
}
