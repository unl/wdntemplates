<?php
// getNOAAWeather.php
// Ned W. Hummel (updated just a bit by Eric Rasmussen 2009)
// Get our xml and html files to process.
// This script should be run 15 minutes after the hour every hour.
// to generate the static html fragment.

// Remote file locations from NOAA
$observationDataFile = simplexml_load_file('http://www.nws.noaa.gov/data/current_obs/KLNK.xml');
$forecastDataFile = file('http://forecast.weather.gov/MapClick.php?FcstType=text&textField1=40.8164&textField2=-96.6882&site=oax&TextType=1');
// Output file name for static html fragment.
$outputFile = "weatherCurrent.html";
$outputForecastFile = "weatherForecast.html";
// Change directory to the correct location.
chdir(dirname(__FILE__));
// Local copies used for testing.
//$observationDataFile = simplexml_load_file('klnk.xml');
//$forcastDataFile = file('currentForecast.html');

// First check that our files exist.
// and that NOAA isn't having problems.
clearstatcache();
if (!($observationDataFile && $forecastDataFile) || ($observationDataFile->temp_f == 'NA')){
	$outputString = "<p>Currently unavailable</p>";
	file_put_contents($outputFile, $outputString);
	exit;
}
// We assume that the file that we are grabbing stuff from
// is always formated the same.
$forecastToday = $forecastDataFile[21];
$forecastTonight = $forecastDataFile[23];
$forecastTomorrow = $forecastDataFile[25];
$currentForecast = $forecastToday.$forecastTonight.$forecastTomorrow;
// Now we fix things.
$currentForecast = preg_replace('/<br>/', '<br />', $currentForecast);
$currentForecast = preg_replace('/<b>/', '<strong>', $currentForecast);
$currentForecast = preg_replace('/<\/b>/', '</strong>', $currentForecast);

// Split and grab the bits that we need to get just the time
// Assumes format of: Last Updated on MMM DD, HH:MM am/pm TZ
$lastupdateArray = explode(" ", $observationDataFile->observation_time);
$lastupdate = $lastupdateArray[count($lastupdateArray)-3].$lastupdateArray[count($lastupdateArray)-2];

// NOAA doesn't print the wind quite right.
// If the winds are variable, they will have 'From The Variable at 5 MPH'
// Which doesn't read right. So we check for the word variable and if found
// drop off the 'from the'
$windstring = strtolower($observationDataFile->wind_string);
$windVariable = strpos($windstring, 'variable');

if ($windVariable == true){
  $windArray = explode(" ", $windstring);
  array_shift($windArray);
  array_shift($windArray);
  $windstring = implode(' ', $windArray);
}

// To add head index or windchill factor information
// we check if one of the temps is NA
/* Currently, they don't appear to be supplying either of these values
if($observationDataFile->heat_index_f != 'NA'){
  $adjtemp_index = "Heat index";
  $adjtemp_f = $observationDataFile->heat_index_f;
  $adjtemp_c = $observationDataFile->heat_index_c;
}
else {
  $adjtemp_index = "Windchill";
  $adjtemp_f = $observationDataFile->windchill_f;
  $adjtemp_c = $observationDataFile->windchill_c;
 }
*/

$outputString = "<div><div id=\"unltemp\"><span id=\"unlweathertempf\" class=\"weathertempf\">$observationDataFile->temp_f&#176;</span>F/<span id=\"unlweathertempc\" class=\"weathertempc\">$observationDataFile->temp_c&#176;</span>C</div>
<div id=\"unlcurrent\" class=\"weatherconditions\"><strong>Currently:</strong> $observationDataFile->weather</div>
<div id=\"unlhumidity\" class=\"weatherconditions\">$observationDataFile->relative_humidity% Relative Humidity</div>
<div id=\"unladjtemp\" class=\"weatherconditions\">$adjtemp_index <span id=\"unladjtempf\">$adjtemp_f&#176;</span>F/<span id=\"unladjtempc\">$adjtemp_c&#176;</span>C</div>
<div id=\"unlwind\" class=\"weatherconditions\">Winds $windstring</div>
<div id=\"unlweatherasof\" class=\"weatherasof\">As of $lastupdate</div>
<div id=\"unlforecast\" class=\"weatherforecast\">$currentForecast</div>
<div id=\"unlfullforecast\"><a class=\"external\" href=\"http://forecast.weather.gov/MapClick.php?CityName=Lincoln&amp;state=NE&amp;site=OAX\">Complete forecast</a></div></div>";


file_put_contents($outputFile, $outputString);

file_put_contents($outputForecastFile, $currentForecast);
?>