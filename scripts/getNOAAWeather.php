<?php
// This script should be run 15 minutes after the hour every hour.
// to generate the static html fragment.

$observationData = simplexml_load_file('http://www.nws.noaa.gov/data/current_obs/KLNK.xml');
$observationOutput = 'weather.html';

chdir(realpath(dirname(__FILE__) . '/../wdn/templates_4.0/includes'));

ob_start();
?>
<div id="wdn_current_weather">
    <?php if ($observationData && $observationData->temp_f != 'NA') : ?>
    <div id="wdn_temp_wrapper">
        <span id="wdn_temp_f" class="wdn-temp"><?php echo $observationData->temp_f ?>&#176;<span class="wdn-weather-label wdn-weather-context">F</span>
        </span>
        <span id="wdn_temp_c" class="wdn-weather-secondary wdn-temp"><?php echo $observationData->temp_c ?>&#176;<span class="wdn-weather-label wdn-weather-context">C</span>
        </span>
    </div>
    <div id="wdn_current_condition_wrapper">
        <span class="wdn-weather-label wdn-sub-resource-title">
            Conditions: 
        </span>
        <span id="wdn_current_condition" class="wdn-weather-conditions"><?php echo $observationData->weather ?></span>
    </div>
    <?php else : ?>
    <p>Currently unavailable</p>
    <?php endif; ?>
    <a class="external wdn-action-link" href="http://forecast.weather.gov/MapClick.php?lat=40.8068620&amp;lon=-96.6816790">View the local forecast
    </a>
</div>
<!--
<div id="weatherforecast">

</div>
-->
<div id="wdn_radar_wrapper">
    <a class="external wdn-action-link" title="Review the local radar at the National Weather Service" href="http://radar.weather.gov/radar_lite.php?rid=oax&amp;product=N0R&amp;overlay=11101111&amp;loop=yes">
    View the local radar</a>
</div>
<?php file_put_contents($observationOutput, ob_get_clean());
