define([], () => {
	if(!('objectFit' in document.body.style)) {
		console.log('hi');
		require(['mustard/ofi'], () => {
			objectFitImages();
		})
	}
});