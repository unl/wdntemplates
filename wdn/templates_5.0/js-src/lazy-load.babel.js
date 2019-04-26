require (['dcf-lazyLoad'], (LazyLoad) => {

  const images = document.querySelectorAll('.dcf-lazy-img');
  const observerConfig = {
  	// extend intersection root margin by 50px to start intersection earlier by 50px
  	rootMargin: '0px 0px 50px 0px',
  	threshold: [0, 0.5]
  };
  const enterClassNames = ['dcf-fade-in'];
  const unlLazyLoad = new LazyLoad(images, observerConfig, enterClassNames);
  unlLazyLoad.initialize();

});
