WDN.jQuery(document).ready(function(){
var HowManyDivs = WDN.jQuery('.wdn-randomizer').children().size();
var randomNum = Math.floor(Math.random()*HowManyDivs);
WDN.jQuery('div#wdn-randomizer div:eq(' + randomNum + ')').css("display", "block");
});
