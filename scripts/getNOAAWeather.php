<?php
// This script should be run 15 minutes after the hour every hour.
// to generate the static html fragment.

$observationData = simplexml_load_file('http://www.nws.noaa.gov/data/current_obs/KLNK.xml');
$observationOutput = 'weatherCurrent.html';
$forecastData = file_get_contents('http://forecast.weather.gov/MapClick.php?lat=40.80686&lon=-96.68167900000003&unit=0&lg=english&FcstType=text&TextType=1');
$forecastOutput = 'weatherForecast.html';

chdir(realpath(dirname(__FILE__) . '/../wdn/templates_3.1/includes'));

if ($forecastData) {
    $start = $end = strpos($forecastData, '<b>', strpos($forecastData, '</table><table'));
    for ($i = 0; $i < 3; $i++) {
        $end = strpos($forecastData, '<b>', $end + 3);
    }


    $forecastData = substr($forecastData, $start, $end - $start);
    $forecastData = str_replace(array('<br>', '<b>', '</b>'), array('<br />', '<strong>', '</strong>'), $forecastData);
    $forecastData .= '<a href="http://forecast.weather.gov/MapClick.php?lat=40.80686&lon=-96.68167900000003&unit=0&lg=english&FcstType=text&TextType=1">Complete forecast</a><br /><a href="http://snr.unl.edu/LincolnWeather/">Lincoln Weather and Climate</a>
';
} else {
    $forecastData = '<p>Currently unavailable</p>';
}
file_put_contents($forecastOutput, $forecastData);

if ($observationData && $observationData->temp_f != 'NA') {
    ob_start(); ?>

<div id="unltemp"><span id="unlweathertempf" class="weathertempf"><?php echo $observationData->temp_f ?>&#176;</span> F (<span id="unlweathertempc" class="weathertempc"><?php echo $observationData->temp_c ?>&#176;</span> C)</div>
<div id="unlcurrent" class="weatherconditions"><strong>Currently: </strong><?php echo $observationData->weather ?></div>
<?php if (isset($observationData->heat_index_f) || isset($observationData->windchill_f)): ?>
<div id="unladjtemp" class="weatherconditions">
<?php if (isset($observationData->heat_index_f)): ?>
    Heat Index: <span id="unladjtempf"><?php echo $observationData->heat_index_f ?>&#176;</span> F (<span id="unladjtempc"><?php echo $observationData->heat_index_c ?>&#176;</span> C)
<?php else: ?>
    Windchill: <span id="unladjtempf"><?php echo $observationData->windchill_f ?>&#176;</span> F (<span id="unladjtempc"><?php echo $observationData->windchill_c ?>&#176;</span> C)
<?php endif; ?>
</div>
<?php endif;?>
<div id="unlhumidity" class="weatherconditions">Relative Humidity: <?php echo $observationData->relative_humidity?>%</div>
<div id="unlwind" class="weatherconditions">Winds <?php echo $observationData->wind_string ?></div>
<div id="unlweatherasof" class="weatherasof" title="<?php echo $observationData->observation_time ?>">Last Update: <?php echo date('g:i a', strtotime($observationData->observation_time_rfc822))?></div>
<div id="unlfullforecast"><a class="external" href="http://forecast.weather.gov/MapClick.php?lat=40.8068620&lon=-96.6816790">Complete local weather</a></div>

<?php
    $observationData = ob_get_clean();
} else {
    $observationData = '<p>Currently unavailable</p>';
}
file_put_contents($observationOutput, $observationData);
