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
        'reset',
        'wrapper',
        'grid',
        'fonts/fonts',
        'header/header',
        'header/toolbarcontent',
        'header/tooltabs',
        'header/toolbar',
        'header/idm',
        'header/colorbox',
        'navigation/breadcrumbs',
        'navigation/navigation',
        'footer/feedback',
        'footer/footer',
        'footer/rating',
        'content/basestyles',
        'content/tabs',
        'content/columns',
        'content/headers',
        'content/images_deprecated',
        'content/images',
        'content/mime',
        'content/titlegraphic',
        'content/zenbox',
        'content/zentable',
        'variations/liquid',
        'variations/fixed',
        'variations/popup',
        'variations/document',
        'variations/secure',
    );

    protected $_mobileCssFiles = array(
        'reset',
        'wrapper',
        'fonts/fonts',
        'header/header',
        'content/basestyles',
        'content/headers',
        'content/zenbox',
        'content/images',
        'content/mime',
        'variations/mobile',
    );

    protected $_compiler = self::JS_COMPILER_CLOSURE;

    public function buildJs($mobile = false)
    {
        $outDir = realpath(dirname(__FILE__) . '/../scripts');
        $outFile = $mobile ? 'mobile' : 'all';
        $files = $mobile ? $this->_mobileJsFiles : $this->_jsFiles;
        $all = '';

        foreach ($files as $file) {
            $filename = realpath("{$outDir}/{$file}.js");
            $all .= file_get_contents($filename);

            if ($file == 'wdn') {
                if (!$mobile) {
                    $all .= 'WDN.jQuery = jQuery.noConflict(true);WDN.loadedJS["/wdn/templates_3.0/scripts/jquery.js"]=1;';
                }
                $all .= 'WDN.template_path = "/";' . PHP_EOL;
            }

            if ($file !== 'jquery') {
                $all .= 'WDN.loadedJS["/wdn/templates_3.0/scripts/' . $file . '.js"]=1;' . PHP_EOL;
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
                return "java -jar {$cwd}/compiler.jar --js={$in} --js_output_file={$out}";
                break;
            case self::JS_COMPILER_UGLIFYJS:
                return "{$cwd}/uglifyjs -nc --unsafe {$in} > {$out}";
                break;
            default:
                break;
        }

        return false;
    }

    public function buildCss($mobile = false)
    {
        $outDir = realpath(dirname(__FILE__) . '/../css');
        $outFile = $mobile ? 'mobile' : 'all';
        $files = $mobile ? $this->_mobileCssFiles : $this->_cssFiles;
        $all = '';

        foreach ($files as $file) {
            $dir = '';
            if (strpos($file,'/') !== false) {
                list($dir) = explode('/', $file);
                $dir .= '/';
            }

            $all .= $this->_cleanCssFile(file_get_contents("{$outDir}/{$file}.css"), $dir);
        }

        // remove comments
        $all = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $all);
        // remove tabs, spaces, newlines, etc.
        $all = str_replace(array("\r\n", "\r", "\n", "\t"), '', $all);
        $all = str_replace(array('    ', '   ', '  '), ' ', $all);
        $all = str_replace(', ', ',', $all);

        file_put_contents("{$outDir}/{$outFile}.css", $all);

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
            ->buildCss($mobile);

    }
}

$compressor = new UNL_WDNTemplates_Compressor();
$compiler = isset($argv[1]) ? $argv[1] : null;
foreach (array(true, false) as $mobile) {
    $compressor->make($mobile, $compiler);
}
