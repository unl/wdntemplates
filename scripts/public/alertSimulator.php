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
    'headline' => '(Simulation) Gas Leak',
    'effective' => date('Y-m-d\TH:i:sO'),
    'description' => 'THIS IS JUST A TEST - ',
    'instruction' => 'Evacuations of the Buildings are not necessary at this time',
    'web' => 'http://www.unl.edu/',
    'parameter' => array(
        'valueName' => 'id',
        'value' => md5('2015-07-10T10:26:00-05:00')
    ),
    'area' => array(
        'areaDesc' => 'Lincoln (Nebraska)',
        'geocode' => '031111'
    )
);

if (time() <= strtotime('2015-07-10T11:26:00-05:00')) {
    $data = array('alert' => $alertSpec);
    if (empty($_GET['c'])) {
        $data['alert']['info'] = $alertInfo;
    }
} else {
    $data = array();
}

header('Content-type: text/javascript');
?>
unlAlerts.data = <?php echo json_encode($data); echo "\n"; ?>
try {
    unlAlerts.server.init();
} catch (e) {}