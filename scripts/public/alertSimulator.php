<?php

$alertSpec = array(
    'identifier' => 'University of Nebraska-Lincoln ' . date('c'),
    'sender' => $_SERVER['SERVER_NAME'],
    'sent' => date('c'),
    'status' => 'Simulation',
    'msgType' => 'Alert',
    'scope' => 'Public',
    'note' => 'Current Watches, Warnings and Advisories for UNL (Simulation)',
    'references' => 'http://www.unl.edu/'
);

$alertInfo = array(
    'category' => 'Safety',
    'event' => 'University of Nebraska-Lincoln Alert',
    'urgency' => 'Immediate',
    'severity' => 'Extreme',
    'certainty' => 'Likely',
    'headline' => '(Simulation) Winter Weather Advisory',
    'description' => 'The university has been closed Feb 3 due to inclement weather - THIS IS JUST A TEST',
    'instruction' => 'Only necessary personnel should come to work',
    'web' => 'http://www.unl.edu/',
    'parameter' => array(
        'valueName' => 'id',
        'value' => md5(time())
    ),
    'area' => array(
        'areaDesc' => 'Lincoln (Nebraska)',
        'geocode' => '031111'
    )
);

$data = array('alert' => $alertSpec);
if (empty($_GET['c'])) {
    $data['alert']['info'] = $alertInfo;
}

header('Content-type: text/javascript');
?>
unlAlerts.data = <?php echo json_encode($data); echo "\n"; ?>
try {
    unlAlerts.server.init();
} catch (e) {}