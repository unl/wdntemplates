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
$currentForecast = str_replace('showsigwx.php', 'http://forecast.weather.gov/showsigwx.php', $currentForecast);

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
// we check if heat_index is available
if($observationDataFile->heat_index_f != NULL){
  $adjtemp_exists = true;
  $adjtemp_index = "Heat Index:";
  $adjtemp_f = $observationDataFile->heat_index_f;
  $adjtemp_c = $observationDataFile->heat_index_c;
}
// If not then we check to see if windchill is available
else if($observationDataFile->windchill_f != NULL){
  $adjtemp_exists = true;
  $adjtemp_index = "Windchill:";
  $adjtemp_f = $observationDataFile->windchill_f;
  $adjtemp_c = $observationDataFile->windchill_c;
 }
//  We get here if neither heat index nor windchill is available
// so we need to make sure nothing is written to the output string for this item
else {
	$adjtemp_exists = false;
}

$outputString = "<div id=\"unltemp\"><span id=\"unlweathertempf\" class=\"weathertempf\">$observationDataFile->temp_f&#176;</span>F/<span id=\"unlweathertempc\" class=\"weathertempc\">$observationDataFile->temp_c&#176;</span>C</div>
<div id=\"unlcurrent\" class=\"weatherconditions\"><strong>Currently:</strong> $observationDataFile->weather</div>";

if($adjtemp_exists){
$outputString .= "<div id=\"unladjtemp\" class=\"weatherconditions\">$adjtemp_index <span id=\"unladjtempf\">$adjtemp_f&#176;</span>F/<span id=\"unladjtempc\">$adjtemp_c&#176;</span>C</div>";
}else{}

$outputString .= "<div id=\"unlhumidity\" class=\"weatherconditions\">Relative Humidity: $observationDataFile->relative_humidity%</div>
<div id=\"unlwind\" class=\"weatherconditions\">Winds $windstring</div>
<div id=\"unlweatherasof\" class=\"weatherasof\">Last Update: $lastupdate</div>
<div id=\"unlfullforecast\"><a class=\"external\" href=\"http://forecast.weather.gov/MapClick.php?CityName=Lincoln&amp;state=NE&amp;site=OAX\">Complete local weather</a></div>";

file_put_contents($outputFile, $outputString);


$currentForecast .= "<br /><a class=\"external\" href=\"http://forecast.weather.gov/MapClick.php?FcstType=text&textField1=40.8164&textField2=-96.6882&site=oax&TextType=1\">Complete forecast</a>";

file_put_contents($outputForecastFile, $currentForecast);
?>
