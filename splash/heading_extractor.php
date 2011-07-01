<?php
$html = file_get_contents('http://www.unl.edu/ucomm/unltoday/unltoday.html');

// Sample text
// $html = '
// <h5>super heading 1</h5>
// <h5>blah blah</h5>
// <h5 class="internal">internal story</h5>
// <h5 class="lead">Teh Lead</h5>
// ';

function extractHeadings($html)
{
    // Wrap the HTML to ensure we have a root node
    $html = '<div>'.$html.'</div>';

    // Silence HTML errors
    $xml = @DOMDocument::loadHTML($html);
    
    $headings[1] = $xml->getElementsByTagName('h1');
    $headings[2] = $xml->getElementsByTagName('h2');
    $headings[3] = $xml->getElementsByTagName('h3');
    $headings[4] = $xml->getElementsByTagName('h4');
    $headings[5] = $xml->getElementsByTagName('h5');
    $headings[6] = $xml->getElementsByTagName('h6');
    return $headings;
}

$headings = extractHeadings($html);

$filename = __DIR__ . '/../promo_unltoday.html';

// Default title
$lead = 'What\'s Happening On Campus Today';

$unltoday_headings = array();

// How many sub-headings to show
$subhead_limit = 4;

if ($headings[5]->length > 0) {
    foreach ($headings[5] as $heading) {
        if ($class = $heading->getAttribute('class')) {
            // Check the class
            if ($class == 'internal') {
                // Skip this internal-focused story
                continue;
            }
            if ($class == 'lead') {
                $lead = $heading->nodeValue;
                continue;
            }
        }
        $unltoday_headings[] = $heading->nodeValue;
    }
}

$data = '<h3><a href="http://www.unl.edu/ucomm/unltoday/" title="Read more on UNL Today">'.$lead.'</a></h3>'.PHP_EOL;
if (count($unltoday_headings)) {
    $unltoday_headings = array_slice($unltoday_headings, 0, $subhead_limit);
    $data .= '
    <ul>
        <li><a href="http://www.unl.edu/ucomm/unltoday/" title="Read more on UNL Today">'
    	. implode($unltoday_headings, '</a></li>
        <li><a href="http://www.unl.edu/ucomm/unltoday/" title="Read more on UNL Today">')
        . '</a></li>
    </ul>';
}
echo $data;

file_put_contents($filename, $data);