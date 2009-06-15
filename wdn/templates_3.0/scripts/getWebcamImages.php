<?php
/**
 * This script grabs each of the images from the three webcams.
 */
ini_set('display_errors',false);

$target_dir = '/cwis/data/unlpub/cam/';

for ($i=1; $i<=3; $i++) {
    if ($img = file_get_contents('http://ucommcam'.$i.'.unl.edu/axis-cgi/jpg/image.cgi')) {
        file_put_contents($target_dir.'cam'.$i.'.jpg', $img);
    }
}
