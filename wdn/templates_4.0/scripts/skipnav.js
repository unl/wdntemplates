define([], function() {
	//Fix skipnav to maincontent (maincontent was not focuable, and thus the tab order would revert to the top of the page)
	document.getElementById('maincontent').setAttribute('tabindex', '-1');
});
