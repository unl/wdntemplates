require (['dcf-lazyLoad'], (lazyLoadModule) => {

  const images = document.querySelectorAll('[loading=lazy], .dcf-lazy-load');
  const observerConfig = {
  	// extend intersection root margin by 50px to start intersection earlier by 50px
  	rootMargin: '0px 0px 50px 0px',
  	threshold: [0, 0.5]
  };
  const enterClassNames = [];
  const unlLazyLoad = new lazyLoadModule.DCFLazyLoad(images, observerConfig, enterClassNames);
  unlLazyLoad.initialize();

});
