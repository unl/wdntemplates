--TEST--
Validate all example pages for accessibility
--FILE--
<?php
//Load composer
require_once dirname(__FILE__) . '/../../build/vendor/autoload.php';

class AccessibilityTester {
    protected $examples_directory = '';
    protected $wrapper_html;
    
    public function __construct()
    {
        $this->examples_directory = dirname(__FILE__) . '/../../wdn/templates_4.0/examples/';
        $this->wrapper_html = file_get_contents($this->examples_directory . 'index.shtml');
    }

    public function getFilesToCheck() {
        $files_to_check = array();

        foreach (new DirectoryIterator($this->examples_directory) as $file_info) {    
            if ($file_info->getExtension() !== 'html') {
                continue;
            }
    
            $files_to_check[] = $file_info->getFilename();
        }
        
        return $files_to_check;
    }
    
    /**
     * @param string $file the filename of the example page to check
     * @return array|bool false on error, array of errors on success
     */
    protected function checkExample($file) {
        echo "checking: " . $file . PHP_EOL;
        $url     = 'http://localhost/tests/Accessibility/tmp/' . $file . '.shtml';
        $command = 'pa11y ' .
            '-r json ' .
            '-s WCAG2AA ' .
            '--config ' . dirname(__FILE__) . '/pa11y.json ' . 
            '--htmlcs "http://webaudit.unl.edu/plugins/metric_pa11y/html_codesniffer/build/HTMLCS.js" ' .
            escapeshellarg($url);
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
            return false;
        }
        
        //Import the example element into the new node
        $new_element = $new_dom->importNode($example_node, true);
        
        //Append the example element as the only child of the main content area
        $main_content->appendChild($new_element);
    
        //Save to an example file.
        file_put_contents(__DIR__ . '/tmp/' . $file . '.shtml', \HTML5::saveHTML($new_dom));
        
        //Run pa11y on the test page
        $json = exec($command);
    
        if (!$data = json_decode($json, true)) {
            return false;
        }
    
        foreach ($data as $result) {
            if ($result['type'] != 'error') {
                continue;
            }
    
            $errors[] = $result['code'] . ' -- ' . $result['context'];
        }
    
        return $errors;
    }
    
    public function check()
    {
        foreach ($this->getFilesToCheck() as $file) {
            $errors = $this->checkExample($file);
            if ($errors === false) {
                echo 'Unable to check ' . $file . PHP_EOL;
            }
    
            if (!empty($errors)) {
                echo $file . ' FAILED!' . PHP_EOL;
                foreach ($errors as $error) {
                    echo "\t " . $error . PHP_EOL;
                }
            }
        }
    }
}

$tester = new AccessibilityTester();
$tester->check();

//Save what we expect to see if all tests pass to a file.
$expect = '';
foreach($tester->getFilesToCheck() as $file) {
    $expect .= 'checking: ' . $file . PHP_EOL;
}
file_put_contents(__DIR__ . '/tmp/expect.txt', $expect);

?>
--EXPECTFILE--
tmp/expect.txt
