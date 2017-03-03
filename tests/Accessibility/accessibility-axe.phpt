--TEST--
Validate all example pages for accessibility via aXe
--FILE--
<?php
//Load composer
require_once __DIR__ . '/../../build/vendor/autoload.php';
require_once __DIR__ . '/../mod_include.php';
require_once __DIR__ . '/AccessibilityTester.php';

if (file_exists(__DIR__ . '/../config.inc.php')) {
    require_once __DIR__ . '/../config.inc.php';
}

class AccessibilityAxeTester extends AccessibilityTester {
    
    /**
     * @param string $file the filename of the example page to check
     * @return array|bool false on error, array of errors on success
     */
  protected function checkExample($file, $width, $height) {
        echo "checking: $file at $width x $height" . PHP_EOL;
        $url = self::$base_url . 'tests/Accessibility/tmp/' . $file;
        $command = 'phantomjs '
            . __DIR__ . '/phantomjs-axe.js '
            . escapeshellarg($url) . ' '
            . escapeshellarg($width) . ' '
            . escapeshellarg($height);
        $errors  = array();

        //Prepare the DOM
        $example_html = file_get_contents($this->examples_directory . $file);
        $new_dom      = \HTML5::loadHTML($this->wrapper_html);
        $example_dom  = \HTML5::loadHTML($example_html);

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
        $tmpHTMLFile = __DIR__ . '/tmp/' . $file;
        file_put_contents($tmpHTMLFile, $exampleSHTML);

        //Run pa11y on the test page
        $output_file =  __DIR__ . '/output.json';
        $errorFile = __DIR__ . '/error_output.txt';
        $result = exec($command . ' > ' . $output_file . ' 2>' . $errorFile);
        $errorOutput = file_get_contents($errorFile);
        $json = file_get_contents($output_file);
        unlink($output_file);
        unlink($tmpHTMLFile);
        unlink($errorFile);

        if (!$data = json_decode($json, true)) {
            return [
                'Bad pa11y output:',
                $json,
                $errorOutput,
            ];
        }
        
        if (isset($data['violations'])) {
            foreach ($data['violations'] as $violation) {
                foreach ($violation['nodes'] as $node) {
                    $errors[] = $url
                        . "\r\n\t axe-test-id: " . $violation['id']
                        . "\r\n\t help: " . $violation['help']
                        . "\r\n\t description: " . $violation['description']
                        . "\r\n\t target: " . print_r($node['target'], true)
                        . "\r\n\t context: " . $node['html']
                        . "\r\n------------\r\n";
                }
            }
        }
        
        return $errors;
    }
}

putenv('PATH=' . realpath(__DIR__ . '/../../node_modules/.bin') . ':' . getenv('PATH'));
$tester = new AccessibilityAxeTester();
$tester->check();

// //Save what we expect to see if all tests pass to a file.
// $expect = '';
// foreach($tester->getFilesToCheck() as $file) {
//     $expect .= 'checking: ' . $file . PHP_EOL;
// }
// file_put_contents(__DIR__ . '/tmp/expect.txt', $expect);

?>
--EXPECT--
checking: audioplayer.html
checking: band_imagery.html
checking: buttons.html
checking: carousel.html
checking: colorbox.html
checking: events.html
checking: extended_fonts.html
checking: forms.html
checking: formvalidator.html
checking: hero.html
checking: idm.html
checking: image.html
checking: infographics.html
checking: jqueryui.html
checking: layouts.html
checking: notice.html
checking: pagination.html
checking: promo_image.html
checking: quote.html
checking: randomizer.html
checking: rss_widget.html
checking: table.html
checking: tabs.html
checking: tooltips.html
checking: typography.html
checking: videoplayer.html
checking: zenboxes.html
checking: zentables.html
