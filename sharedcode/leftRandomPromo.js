/*
	Feel free to change these and add your own images.
	Each image has up to 4 attributes associated with it:
	[0] = URL of the image source (.jpg .gif) *
	[1] = ALT text description of the image *
	[2] = URL to take the client to when the image is clicked (optional)
	[3] = javascript onclick events (optional)
	
	The images will rotate after the number of seconds given to the rotateImg
	function (0 for no rotate).
 */
var leftImgArray	= new Array;
leftImgArray[0]		= new Array;
leftImgArray[0][0]	= "http://www.unl.edu/ucomm/images/promos/promo_statemuseum.jpg";
leftImgArray[0][1]	= "Nebraska State Museum";
leftImgArray[0][2]	= "http://www-museum.unl.edu/";
leftImgArray[0][3]	= "";
leftImgArray[1]		= new Array;
leftImgArray[1][0]	= "http://www.unl.edu/ucomm/images/promos/promo_mrrmac.jpg";
leftImgArray[1][1]	= "Mary Riepma Ross Media Arts Center";
leftImgArray[1][2]	= "http://www.theross.org/";
leftImgArray[1][3]	= "";
leftImgArray[2]		= new Array;
leftImgArray[2][0]	= "http://www.unl.edu/ucomm/images/promos/promo_enthompson.jpg";
leftImgArray[2][1]	= "E.N. Thompson Forum on World Issues";
leftImgArray[2][2]	= "http://www.unl.edu/unlpub/special/thompsonforum/";
leftImgArray[2][3]	= "";
leftImgArray[3]		= new Array;
leftImgArray[3][0]	= "http://www.unl.edu/ucomm/images/promos/promo_events.jpg";
leftImgArray[3][1]	= "UNL Calendar of Events";
leftImgArray[3][2]	= "http://events.unl.edu/";
leftImgArray[3][3]	= "";
leftImgArray[4]		= new Array;
leftImgArray[4][0]	= "http://www.unl.edu/ucomm/images/promos/promo_podcast.jpg";
leftImgArray[4][1]	= "UNL Podcasts";
leftImgArray[4][2]	= "http://www1.unl.edu/feeds/";
leftImgArray[4][3]	= "";
leftImgArray[5]		= new Array;
leftImgArray[5][0]	= "http://www.unl.edu/ucomm/images/promos/promo_sheldon.jpg";
leftImgArray[5][1]	= "Sheldon Memorial Art Gallery";
leftImgArray[5][2]	= "http://www.sheldonartgallery.org/";
leftImgArray[5][3]	= "";

rotateImg("leftImgArray","leftRandomPromoImage",14);
