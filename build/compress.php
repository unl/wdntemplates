<?php

class UNL_WDNTemplates_Compressor
{
    const JS_COMPILER_CLOSURE  = 'closure';
    const JS_COMPILER_UGLIFYJS = 'uglify-js';

    protected $_wdnHeader = <<<'EOD'
/**
 * This file is part of the UNL WDN templates.
 * @see http://wdn.unl.edu/
 * $Id$
 */

EOD;

    protected $_srcDir = '../';

    protected $_templateDir = 'wdn/templates_3.0/';

    protected $_templatePath = '/';

    protected $_jsFiles = array(
        'jquery',
        'wdn',
        'wdn_ajax',
        'navigation',
        'search',
        'toolbar',
        'tooltip',
        'analytics',
        'plugins/hoverIntent/jQuery.hoverIntent',
        'plugins/rating/jquery.rating',
        'plugins/colorbox/jquery.colorbox',
        'plugins/qtip/jquery.qtip',
        'idm',
        'tabs',
        'feedback',
        'socialmediashare',
        'unlalert',
        'global_functions',
        'mobile_detect',
    );

    protected $_mobileJsFiles = array(
        'wdn',
        'mobile_analytics',
        'mobile_support',
    );

    protected $_cssFiles = array(
        'foundation/reset',
        'foundation/global',
        'fonts/fonts',
        'wrapper/wrapper',
        'header/header',
        'header/search',
        'header/tools',
        'navigation/breadcrumbs',
        'navigation/navigation',
        'content/maincontent',
        'content/grid',
        'content/headers',
        'footer/footer',
        'footer/feedback',
        'footer/share',
    );

    protected $_compiler = self::JS_COMPILER_CLOSURE;

    public function buildJs($mobile = false)
    {
        $outDir = realpath(dirname(__FILE__) . "/{$this->_srcDir}{$this->_templateDir}scripts");
        $outFile = $mobile ? 'mobile' : 'all';
        $files = $mobile ? $this->_mobileJsFiles : $this->_jsFiles;
        $all = '';

        foreach ($files as $file) {
            $filename = realpath("{$outDir}/{$file}.js");
            $all .= file_get_contents($filename);

            if ($file == 'wdn') {
                if (!$mobile) {
                    $all .= PHP_EOL . 'WDN.jQuery = jQuery.noConflict(true);WDN.loadedJS["' . $this->_templatePath . $this->_templateDir . 'scripts/jquery.js"]=1;';
                }
                $all .= 'WDN.template_path = "' . $this->_templatePath . '";' . PHP_EOL;
            }

            if ($file !== 'jquery') {
                $all .= 'WDN.loadedJS["' . $this->_templatePath . $this->_templateDir . 'scripts/' . $file . '.js"]=1;' . PHP_EOL;
            }
        }

        if (!$mobile) {
            $all .= PHP_EOL . 'WDN.initializeTemplate();' . PHP_EOL;
        }

        // the next line will remove all WDN.log(...); statements
        $all = preg_replace('/WDN\.log\s*\(.+\);/', '//debug statement removed', $all);

        file_put_contents("{$outDir}/{$outFile}_uncompressed.js", $all);

        $compileCmd = $this->_getCompilerCmd("{$outDir}/{$outFile}_uncompressed.js", "{$outDir}/{$outFile}.js");
        if ($compileCmd) {
            exec($compileCmd);
        }

        $all = $this->_wdnHeader . file_get_contents("{$outDir}/{$outFile}.js");
        file_put_contents("{$outDir}/{$outFile}.js", $all);

        return $this;
    }

    protected function _getCompilerCmd($in, $out)
    {
        $cwd = dirname(__FILE__);

        switch($this->_compiler) {
            case self::JS_COMPILER_CLOSURE:
                return "java -jar {$cwd}/bin/compiler.jar --js={$in} --js_output_file={$out}";
                break;
            case self::JS_COMPILER_UGLIFYJS:
                return "/usr/bin/env PATH=\"\$PATH:{$cwd}/bin\" uglifyjs -nc --unsafe {$in} > {$out}";
                break;
            default:
                break;
        }

        return false;
    }

    public function buildCss()
    {
        $outDir = realpath(dirname(__FILE__) . "/{$this->_srcDir}{$this->_templateDir}css");
        $outFile = 'all';
        $files = $this->_cssFiles;

        // All the base styles
        $base             = '';

        // Each section of minimum width css declarations
        $media_sections = array(
            320  => '',
            480  => '',
            600  => '',
            768  => '',
            960  => '',
            1040 => '',
        );

        foreach ($files as $file) {
            $dir = '';
            if (strpos($file,'/') !== false) {
                list($dir) = explode('/', $file);
                $dir .= '/';
            }

            $contents = $this->_cleanCssFile(file_get_contents("{$outDir}/{$file}.css"), $dir);

            // remove comments
            $contents = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $contents);
            // remove tabs, spaces, newlines, etc.
            $contents = str_replace(array("\r\n", "\r", "\n", "\t"), '', $contents);
            $contents = str_replace(array('    ', '   ', '  '), ' ', $contents);
            $contents = str_replace(', ', ',', $contents);

            // Now we have a clean, compressed individual css file

            // Split into sections for each minimum resolution and base
            $css_sections = explode('@media ', $contents);

            foreach ($css_sections as $section) {
                if (preg_match('/^\(min-width:\s+?([\d]+)px\)\s\{(.*)\}$/', $section, $matches)) {
                    // Found a section
                    $media_sections[$matches[1]] .= $matches[2];
                } else {
                    // this is a "base" CSS section
                    $base .= $section;
                }
            }

        }

        file_put_contents("{$outDir}/variations/base.css", $base);

        foreach ($media_sections as $min_width=>$media_section_css) {
            file_put_contents("{$outDir}/variations/{$min_width}.css", $media_section_css);
        }

        file_put_contents("{$outDir}/variations/ie.css", implode(' ', $media_sections));

        return $this;
    }

    protected function _cleanCssFile($css, $dir)
    {
        //converts css paths
        $css = str_replace(
            array('../images/', 'images/', 'IMAGES', 'URWGrotesk/'),
            array('IMAGES/', $dir . 'images/', 'images', 'fonts/URWGrotesk/'),
            $css
        );

        return preg_replace('/\@import[\s]+url\(.*\);/', '', $css);
    }

    public function make($mobile, $compiler = null)
    {
        if ($compiler) {
            $this->_compiler = $compiler;
        }

        return $this->buildJs($mobile)
            ->buildCss();

    }
}

$compressor = new UNL_WDNTemplates_Compressor();
$compiler = isset($argv[1]) ? $argv[1] : null;
foreach (array(true, false) as $mobile) {
    $compressor->make($mobile, $compiler);
}
