let notices = document.querySelectorAll('[data-widget="notice"]');
notices = [].slice.call(notices);

// standard classes based on what kind of notice, keep it to DCF classes for now
const noticeClasses  = {
	notify: ['unl-notice', 'unl-notice-notify'],
	success: ['unl-notice', 'unl-notice-success'],
	alert: ['unl-notice', 'unl-notice--alert'],
	fatal: ['unl-notice', 'unl-notice--fatal'],
}

const noticeLocationClasses = {
	current: ['uno'],
	nav: ['foo'],
	fixedBottom:['bar']
}

// default animations depending on associated locations
// fixedBottom associated with slideUp animation. Everything else uses slideInScroll
const noticeAnimationClasses = {
	slideInScroll: ['baz'],
	slideUp: ['car'],
}

//move notice to be first child of main
function moveElement(el) {
	const main = document.querySelector('main');
	const firstChild = main.firstElementChild;
	console.log(firstChild);
	main.insertBefore(el, firstChild);
}


/**
* Intersection Observer related code
*/

// intersection observer - one time drawing variables and functions
let isDrawn = false;
let isMobile = false;
let mobileObserver, desktopObserver;
const mq = window.matchMedia("(min-width: 480px)");
const mobileConfig = {
	/* on mobile given potential line breaks, we won't be able to view the entire notice in its
	 entirety at one go so might want to show the notice when close to half of it is shown */
	root: null,
	rootMargin: '0px',
	threshold: 0.65
};
const desktopConfig = {
	root: null,
	rootMargin: '0px',
	threshold: 0.8
};

function observerCallback(entries, observer) {
	entries.forEach(entry => {
		console.log(entry.intersectionRatio, entry.isIntersecting, observer, entry.boundingClientRect);

		if (entry.isIntersecting) {
			if(entry.intersectionRatio > 0 && entry.intersectionRatio >= observer.thresholds[0]) {
				console.log('START DRAWING!!!!!');
				noticeAnimationClasses.slideInScroll.forEach(noticeAnimationClass => entry.target.classList.add(noticeAnimationClass));

				// need to set isDrawn to true after drawn and disconnect observer
				//observer.disconnect();
				isDrawn = true;
				observer.disconnect();
			}
		}
	});
}

function onWidthChange(mq) {
	if (isDrawn) return;
	if (mq.matches) {
		//desktop
		isMobile = false;
		createDesktopObserver();

		if (mobileObserver){
			mobileObserver.disconnect();
		}
	} else {
		//mobile
		isMobile = true;
		createMobileObserver();

		if (desktopObserver){
			desktopObserver.disconnect();
		}
	}
}

function createMobileObserver() {
	notices.forEach(notice => {
		mobileObserver = new IntersectionObserver(observerCallback, mobileConfig);
		mobileObserver.observe(notice);
	});
}

function createDesktopObserver() {
	notices.forEach(notice => {
		desktopObserver = new IntersectionObserver(observerCallback, desktopConfig);
		desktopObserver.observe(notice);
	});
}


/**
 * Notice widget related code
 */

notices.forEach(notice => {
	if (notice.initialized) return; // exit if the notice has been initialized

	const noticeType = notice.dataset.noticeType;
	const noticeLocation = notice.dataset.location;
	const noticeAnimation = notice.dataset.animation;

	// 1.check notice option type and add the needed classes
	if (noticeClasses[noticeType]) {
		noticeClasses[noticeType].forEach(noticeClass => notice.classList.add(noticeClass))
	}

	// 2.check widget location whether its current, nav, or fixed-bottom and assign class names
	if (noticeLocationClasses[noticeLocation]) {
		noticeLocationClasses[noticeLocation].forEach(noticeLocationClass => notice.classList.add(noticeLocationClass));
	}
	// 2.1 if its nav, move the element to after the nav and before the page title
	if (noticeLocation === 'nav') {
		moveElement(notice);
	}

	// 3.check animation type whether its slide-in-scroll?
	// if exist will have to implement intersection observer
	// Question for Michael if multiple widgets need intersection observer, how can we make it more modular?
	if (noticeAnimation === 'true') {
		if (noticeLocation === 'fixedBottom') {
			// add noticeAnimationClasses.slideUp
			noticeAnimationClasses.slideUp.forEach(noticeAnimationClass => notice.classList.add(noticeAnimationClass))
		} else {
			// implement intersection observer
			// add noticeAnimationClasses.slideInScroll
			if ('IntersectionObserver' in window) {
				notice.classList.add('hide-animate');
				mq.addListener(() => onWidthChange(mq));

				//check browser width once on page load
				onWidthChange(mq);
			}
		}
	}

	notice.initialized = true;
	console.dir(notice, notice.initialized);
});
