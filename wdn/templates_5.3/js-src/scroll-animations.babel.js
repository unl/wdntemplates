require(['plugins/gsap/gsap', 'plugins/gsap/ScrollTrigger'], (gsapModule, ScrollTriggerModule) => {

  const gsap = gsapModule.gsap;
  const ScrollTrigger = ScrollTriggerModule.ScrollTrigger;

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.config( { limitCallbacks: true } );

  // Set defaults on page load
  gsap.set('.unl-scroll-fx-fade-in', {autoAlpha: 0});
  gsap.set('.unl-scroll-fx-move-left', {x: 100});
  gsap.set('.unl-scroll-fx-move-right', {x: -100});
  gsap.set('.unl-scroll-fx-move-up', {y: 100});

  // Fade in
  ScrollTrigger.batch('.unl-scroll-fx-fade-in', {
    interval: 0.1, // time window (in seconds) for batching to occur. The first callback that occurs (of its type) will start the timer, and when it elapses, any other similar callbacks for other targets will be batched into an array and fed to the callback. Default is 0.1
    batchMax: 6,   // maximum batch size (targets)
    onEnter: batch => gsap.to(batch, {autoAlpha: 1, stagger: 0.15, overwrite: true}),
    onLeave: batch => gsap.set(batch, {autoAlpha: 0, overwrite: true}),
    onEnterBack: batch => gsap.to(batch, {autoAlpha: 1, stagger: 0.15, overwrite: true}),
    onLeaveBack: batch => gsap.set(batch, {autoAlpha: 0, overwrite: true})
  });

  // Move left
  ScrollTrigger.batch('.unl-scroll-fx-move-left', {
    interval: 0.1, // time window (in seconds) for batching to occur. The first callback that occurs (of its type) will start the timer, and when it elapses, any other similar callbacks for other targets will be batched into an array and fed to the callback. Default is 0.1
    batchMax: 6,   // maximum batch size (targets)
    onEnter: batch => gsap.to(batch, {x: 0, stagger: 0.1, overwrite: true}),
    onLeave: batch => gsap.set(batch, {x: 100, overwrite: true}),
    onEnterBack: batch => gsap.to(batch, {x: 0, stagger: 0.1, overwrite: true}),
    onLeaveBack: batch => gsap.set(batch, {x: 100, overwrite: true})
  });

  // Move right
  ScrollTrigger.batch('.unl-scroll-fx-move-right', {
    interval: 0.1, // time window (in seconds) for batching to occur. The first callback that occurs (of its type) will start the timer, and when it elapses, any other similar callbacks for other targets will be batched into an array and fed to the callback. Default is 0.1
    batchMax: 6,   // maximum batch size (targets)
    onEnter: batch => gsap.to(batch, {x: 0, stagger: 0.1, overwrite: true}),
    onLeave: batch => gsap.set(batch, {x: -100, overwrite: true}),
    onEnterBack: batch => gsap.to(batch, {x: 0, stagger: 0.1, overwrite: true}),
    onLeaveBack: batch => gsap.set(batch, {x: -100, overwrite: true})
  });

  // Move up
  ScrollTrigger.batch('.unl-scroll-fx-move-up', {
    interval: 0.1, // time window (in seconds) for batching to occur. The first callback that occurs (of its type) will start the timer, and when it elapses, any other similar callbacks for other targets will be batched into an array and fed to the callback. Default is 0.1
    batchMax: 6,   // maximum batch size (targets)
    onEnter: batch => gsap.to(batch, {y: 0, stagger: 0.1, overwrite: true}),
    onLeave: batch => gsap.set(batch, {y: 100, overwrite: true}),
    onEnterBack: batch => gsap.to(batch, {y: 0, stagger: 0.1, overwrite: true}),
    onLeaveBack: batch => gsap.set(batch, {y: 100, overwrite: true})
  });

});
