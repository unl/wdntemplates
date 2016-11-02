<?php

abstract class AccessibilityTester {
    protected $examples_directory = '';
    protected $wrapper_html;
    public static $base_url = 'http://localhost:8080/';

    public function __construct()
    {
        $this->examples_directory = __DIR__ . '/../../wdn/templates_4.1/examples/';
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

        //Make sure that files are ordered by file name
        sort($files_to_check);

        return $files_to_check;
    }

    /**
     * @param string $file the filename of the example page to check
     * @return array|bool false on error, array of errors on success
     */
    abstract protected function checkExample($file);

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
