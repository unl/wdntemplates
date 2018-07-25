define(['uuid-gen'], (uuidv4) => {

	let notices = document.querySelectorAll('[data-widget="notice"]');
	let fixedBottomExists = document.querySelector('[id*="unl-widget-fixedBottom-"]') ? true : false; // flag for checking if a fixedBottom notice has been previously added to the page set flag to true

	notices = [].slice.call(notices);

// standard classes based on what kind of notice, keep it to DCF classes for now
	const noticeClasses = {
		notify: ['dcf-notice', 'unl-notice-notify'],
		success: ['dcf-notice', 'unl-notice-success'],
		alert: ['dcf-notice', 'unl-notice--alert'],
		fatal: ['dcf-notice', 'unl-notice--fatal'],
	};

	const noticeLocationClasses = {
		current: ['uno'],
		nav: ['foo'],
		fixedBottom: ['bar', 'dcf-fixed', 'dcf-notice-fixedBottom', 'dcf-pin-bottom', 'dcf-pin-right', 'dcf-pin-left'],
		fixedBottomLeft: ['zoink'] // TODO add option that goes 50% width on desktop when fixedBottom
	};

// default animations depending on associated locations
// fixedBottom associated with slideUp animation. Everything else uses slideInScroll
	const noticeAnimationClasses = {
		slideInScroll: ['baz'],
		slideUp: ['car'],
	};

	const closeButtonClasses = ['dcf-absolute', 'dcf-pin-top', 'dcf-pin-right', 'dcf-mt-3', 'dcf-mr-3', 'dcf-btn', 'dcf-btn-tertiary', 'js-notice-toggle'];


	/**
	 *
	 * Functions
	 */

	/**
	 * @purpose - move element to be the first child of main
	 * @param el - the element to be moved
	 *
	 */
	function prependMain(el) {
		const main = document.querySelector('main');
		const firstChild = main.firstElementChild;
		main.insertBefore(el, firstChild);
	}

	/**
	 * @purpose - permanently closes the notice element
	 * @param notice - notice to be closed
	 *
	 */
	function closeNotice(notice) {

		function hideNotice(e) {
			if (e.propertyName !== "max-height") return;
			notice.classList.add('dcf-d-none');
			notice.removeEventListener('transitionend', hideNotice);
			document.querySelector('main').focus(); // sending focus back to main
		}

		notice.addEventListener('transitionend', hideNotice);
		notice.classList.add('dcf-notice-fixedBottom--close');

		localStorage.setItem(notice.id, 'closed');
	}

	/**
	 * @purpose - collapse message when collapse button is selected
	 * @param el - notice to be closed
	 * @param closeButton - the close button associated with this notice
	 * @param title - title of notice
	 * @param message - message of notice
	 *
	 */
	function collapseExpandMessage(el, closeButton, title, message) {
		// Find out if notice is expanded
		let expanded = closeButton.getAttribute('aria-expanded') === "true" ? true : false;

		if (expanded) {
			// if expanded, collapse message
			closeButton.innerText = "Expand";
			title.classList.add('dcf-notice_title--collapse');
			message.classList.add('dcf-notice_message--collapse');
			console.log(el.id, 'true');
			localStorage.setItem(el.id, 'collapsed');
		} else {
			// if collapse, expand message
			closeButton.innerText = "Collapse";
			message.classList.remove('dcf-notice_message--collapse');
			title.classList.remove('dcf-notice_title--collapse');
			console.log(el.id, 'false');
			localStorage.setItem(el.id, 'expanded');
		}

		// Invert to get new state
		expanded = new Boolean(!expanded);

		//Apply new state to notice
		closeButton.setAttribute('aria-expanded', expanded.toString());
	}


	/**
	 * @purpose add a close button to the widget and the associated click events
	 * @param el
	 * @param isCollapsible
	 *
	 */
	function addCloseButton(el, isCollapsible) {
		const closeButton = document.createElement('button');
		closeButtonClasses.forEach(closeButtonclass => closeButton.classList.add(closeButtonclass));

		if (isCollapsible) {
			// if notice can be collapsed
			const noticeTitle = el.querySelector('.js-notice-title');
			const noticeMessage = el.querySelector('.js-notice-message');
			const noticeMessageId = noticeMessage.id || uuidv4();

			closeButton.innerText = 'collapse';
			closeButton.setAttribute('aria-expanded', 'true');

			if (!noticeTitle) {
				console.error('Your notice is missing a title.');
				return;
			}

			if (!noticeMessage) {
				console.error('Your notice is missing a message.');
				return;
			}

			noticeTitle.classList.add('dcf-notice__title');

			!noticeMessage.id && (noticeMessage.id = noticeMessageId); //if no id is provided use the generated id
			closeButton.setAttribute('aria-controls', noticeMessageId);
			noticeMessage.classList.add('dcf-notice__message');


			closeButton.addEventListener('click', () => {
				collapseExpandMessage(el, closeButton, noticeTitle, noticeMessage);
			});

		} else {
			// else close the notice out completely
			closeButton.innerText = 'close';
			closeButton.addEventListener('click', () => {
				closeNotice(el);
			});
		}

		el.insertBefore(closeButton, el.firstElementChild);
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
				if (entry.intersectionRatio > 0 && entry.intersectionRatio >= observer.thresholds[0]) {
					console.log('START DRAWING!!!!!');
					noticeAnimationClasses.slideInScroll.forEach(noticeAnimationClass => entry.target.classList.add(noticeAnimationClass));

					// set isDrawn flag to true after actions have been taken
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

			if (mobileObserver) {
				mobileObserver.disconnect();
			}
		} else {
			//mobile
			isMobile = true;
			createMobileObserver();

			if (desktopObserver) {
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
		const noticeAnimation = notice.dataset.animation === "true" ? true : false;
		const noticeCollapsible = notice.dataset.collapsible === "true" ? true : false;

		// 1.check notice option type and add the needed classes
		if (noticeClasses[noticeType]) {
			noticeClasses[noticeType].forEach(noticeClass => notice.classList.add(noticeClass))
		} else {
			// default to info notify styling
			noticeClasses.notify.forEach(noticeClass => notice.classList.add(noticeClass))
		}

		// 2.check widget location whether its current, nav, or fixed-bottom and assign class names
		if (noticeLocation === 'fixedBottom') {
			if (!fixedBottomExists) {
				// get provided id and append it with a prefix
				if (notice.id) {
					notice.id = `unl-widget-fixedBottom--${notice.id}`;
				} else {
					console.error(
							'An id attribute needs to be provided for the fixed to bottom notice to function properly with' +
							' localStorage');
				}

				// check to see if data-collapsible is false and exists in storage as closed, hide notice rightaway
				if (!noticeCollapsible && localStorage.getItem(notice.id) === 'closed') {
					notice.classList.add('dcf-d-none');
					return;
				}

				// add assigned classes
				if (noticeLocationClasses[noticeLocation]) {
					noticeLocationClasses[noticeLocation].forEach(noticeLocationClass => notice.classList.add(noticeLocationClass));
				}

				addCloseButton(notice, noticeCollapsible);
				prependMain(notice); // move fixed-bottom notice to the top of source
				fixedBottomExists = true;
			} else {
				console.error('Only one fixed to bottom notice may exist on a page');
			}

		} else {
			// location other than fixedBottom

			if (noticeLocationClasses[noticeLocation]) {
				noticeLocationClasses[noticeLocation].forEach(noticeLocationClass => notice.classList.add(noticeLocationClass));
			} else {
				// set current option as the default notice styling
				noticeLocationClasses.current.forEach(noticeLocationClass => notice.classList.add(noticeLocationClass));
			}

			// 2.1 if its nav, move the element to after the nav and before the page title
			if (noticeLocation === 'nav') {
				prependMain(notice);
			}
		}

		// 3. check animation type whether its slide-in-scroll?
		// if exist will have to implement intersection observer
		// Question for Michael if multiple widgets need intersection observer, how can we make it more modular?
		if (noticeAnimation) {
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

		// 4. check localStorage for fixed bottom and collapsible
		if (noticeCollapsible && localStorage.getItem(notice.id) === 'collapsed') {
			const noticeTitle = notice.querySelector('.js-notice-title');
			const noticeMessage = notice.querySelector('.js-notice-message');
			const toggleButton = notice.querySelector('.js-notice-toggle');
			collapseExpandMessage(notice, toggleButton, noticeTitle, noticeMessage);
		}

	});

});