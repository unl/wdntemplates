(function() {

	var mercuryA = new FontFaceObserver('Mercury SSm A');
	var mercuryB = new FontFaceObserver('Mercury SSm B');
	var mercuryAi = new FontFaceObserver('Mercury SSm A', { style: 'italic' });
	var mercuryBi = new FontFaceObserver('Mercury SSm B', { style: 'italic' });
	var tungstenA = new FontFaceObserver('Tungsten A');
	var tungstenB = new FontFaceObserver('Tungsten B');
	var tungstenAb = new FontFaceObserver('Tungsten A', { weight: 600 });
	var tungstenBb = new FontFaceObserver('Tungsten B', { weight: 600 });
	var gothamA = new FontFaceObserver('Gotham SSm A');
	var gothamB = new FontFaceObserver('Gotham SSm B');

	Promise.all([mercuryA.load(), mercuryB.load(), mercuryAi.load(), mercuryBi.load(), tungstenA.load(), tungstenB.load(), tungstenAb.load(), tungstenBb.load(), gothamA.load(), gothamB.load()]).then(function () {
		document.documentElement.className += " wdn-fonts-loaded";
	});

})();
