function toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        const arr2 = Array(arr.length);
        for (let index = 0; index < arr.length; index++) {
            arr2[index] = arr[index];
        }

        return arr2;
    } else {
        return Array.from(arr);
    }
}

// Older browsers don't support event options, feature detect it.

// Adopted and modified solution from Bohdan Didukh (2017)
// https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi

let hasPassiveEvents = false;
if (typeof window !== 'undefined') {
    const passiveTestOptions = {
        get passive() {
            hasPassiveEvents = true;
            return undefined;
        },
    };
    window.addEventListener('testPassive', null, passiveTestOptions);
    window.removeEventListener('testPassive', null, passiveTestOptions);
}

const isIosDevice = typeof window !== 'undefined' && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);


let locks = [];
let documentListenerAdded = false;
let initialClientY = -1;
let previousBodyOverflowSetting = void 0;
let previousBodyPosition = void 0;
let previousBodyPaddingRight = void 0;

// returns true if `elem` should be allowed to receive touchmove events.
function allowTouchMove(elem) {
    return locks.some(function(lock) {
        if (lock.options.allowTouchMove && lock.options.allowTouchMove(elem)) {
            return true;
        }

        return false;
    });
}

function preventDefault(rawEvent) {
    const event = rawEvent || window.event;

    // For the case whereby consumers adds a touchmove event listener to document.
    // Recall that we do document.addEventListener('touchmove', preventDefault, { passive: false })
    // in disableBodyScroll - so if we provide this opportunity to allowTouchMove, then
    // the touchmove event on document will break.
    if (allowTouchMove(event.target)) {
        return true;
    }

    // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).
    if (event.touches.length > 1) {
        return true;
    }

    if (event.preventDefault) {
        event.preventDefault();
    }

    return false;
}

function setOverflowHidden(options) {
    // If previousBodyPaddingRight is already set, don't set it again.
    if (previousBodyPaddingRight === undefined) {
        const reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
        const scrollBarGap = window.innerWidth - document.documentElement.clientWidth;

        if (reserveScrollBarGap && scrollBarGap > 0) {
            const computedBodyPaddingRight = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'), 10);
            previousBodyPaddingRight = document.body.style.paddingRight;
            document.body.style.paddingRight = `${computedBodyPaddingRight}${scrollBarGap}px`;
        }
    }

    // If previousBodyOverflowSetting is already set, don't set it again.
    if (previousBodyOverflowSetting === undefined) {
        previousBodyOverflowSetting = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }
}

function restoreOverflowSetting() {
    if (previousBodyPaddingRight !== undefined) {
        document.body.style.paddingRight = previousBodyPaddingRight;

        // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
        // can be set again.
        previousBodyPaddingRight = undefined;
    }

    if (previousBodyOverflowSetting !== undefined) {
        document.body.style.overflow = previousBodyOverflowSetting;

        // Restore previousBodyOverflowSetting to undefined
        // so setOverflowHidden knows it can be set again.
        previousBodyOverflowSetting = undefined;
    }
}

function setPositionFixed() {
    return window.requestAnimationFrame(function() {
        // If previousBodyPosition is already set, don't set it again.
        if (previousBodyPosition === undefined) {
            previousBodyPosition = {
                position: document.body.style.position,
                top: document.body.style.top,
                left: document.body.style.left,
            };

            // Update the dom inside an animation frame
            const windowVar = window;
            const scrollY = windowVar.scrollY;
            const scrollX = windowVar.scrollX;
            const innerHeight = windowVar.innerHeight;

            document.body.style.position = 'fixed';
            document.body.style.top = -scrollY;
            document.body.style.left = -scrollX;

            setTimeout(function() {
                return window.requestAnimationFrame(function() {
                    // Attempt to check if the bottom bar appeared due to the position change
                    const bottomBarHeight = innerHeight - window.innerHeight;
                    if (bottomBarHeight && scrollY >= innerHeight) {
                        // Move the content further up so that the bottom bar doesn't hide it
                        document.body.style.top = -(scrollY + bottomBarHeight);
                    }
                });
            }, 300);
        }
    });
}

function restorePositionSetting() {
    if (previousBodyPosition !== undefined) {
        // Convert the position from "px" to Int
        const yVal = -parseInt(document.body.style.top, 10);
        const xVal = -parseInt(document.body.style.left, 10);

        // Restore styles
        document.body.style.position = previousBodyPosition.position;
        document.body.style.top = previousBodyPosition.top;
        document.body.style.left = previousBodyPosition.left;

        // Restore scroll
        window.scrollTo(xVal, yVal);

        previousBodyPosition = undefined;
    }
}

// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
function isTargetElementTotallyScrolled(targetElement) {
    return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
}

function handleScroll(event, targetElement) {
    const clientY = event.targetTouches[0].clientY - initialClientY;

    if (allowTouchMove(event.target)) {
        return false;
    }

    if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
        // element is at the top of its scroll.
        return preventDefault(event);
    }

    if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
        // element is at the bottom of its scroll.
        return preventDefault(event);
    }

    event.stopPropagation();
    return true;
}

export function disableBodyScroll(targetElement, options) {
    // targetElement must be provided
    if (!targetElement) {
        console.error('disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.');
        return;
    }

    // disableBodyScroll must not have been called on this targetElement before
    if (locks.some(function(lock) {
        return lock.targetElement === targetElement;
    })) {
        return;
    }

    const lock = {
        targetElement: targetElement,
        options: options || {},
    };

    locks = [].concat(toConsumableArray(locks), [lock]);

    if (isIosDevice) {
        setPositionFixed();
    } else {
        setOverflowHidden(options);
    }

    if (isIosDevice) {
        targetElement.ontouchstart = function(event) {
            if (event.targetTouches.length === 1) {
                // detect single touch.
                initialClientY = event.targetTouches[0].clientY;
            }
        };
        targetElement.ontouchmove = function(event) {
            if (event.targetTouches.length === 1) {
                // detect single touch.
                handleScroll(event, targetElement);
            }
        };

        if (!documentListenerAdded) {
            document.addEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
            documentListenerAdded = true;
        }
    }
}

export function clearAllBodyScrollLocks() {
    if (isIosDevice) {
        // Clear all locks ontouchstart/ontouchmove handlers, and the references.
        locks.forEach(function(lock) {
            lock.targetElement.ontouchstart = null;
            lock.targetElement.ontouchmove = null;
        });

        if (documentListenerAdded) {
            document.removeEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
            documentListenerAdded = false;
        }

        // Reset initial clientY.
        initialClientY = -1;
    }

    if (isIosDevice) {
        restorePositionSetting();
    } else {
        restoreOverflowSetting();
    }

    locks = [];
}

export function enableBodyScroll(targetElement) {
    if (!targetElement) {
        console.error('enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.');
        return;
    }

    locks = locks.filter(function(lock) {
        return lock.targetElement !== targetElement;
    });

    if (isIosDevice) {
        targetElement.ontouchstart = null;
        targetElement.ontouchmove = null;

        if (documentListenerAdded && locks.length === 0) {
            document.removeEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
            documentListenerAdded = false;
        }
    }

    if (isIosDevice) {
        restorePositionSetting();
    } else {
        restoreOverflowSetting();
    }
}
