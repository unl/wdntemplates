require(['plugins/gsap/gsap', 'plugins/gsap/ScrollTrigger'], (gsapModule, ScrollTriggerModule) => {

  const gsap = gsapModule.gsap;
  gsap.registerPlugin(ScrollTriggerModule.ScrollTrigger);

  ScrollTriggerModule.ScrollTrigger.config( { limitCallbacks: true } );

  ScrollTriggerModule.ScrollTrigger.batch('.unl-fade-in', {
    interval: 0.1, // time window (in seconds) for batching to occur. The first callback that occurs (of its type) will start the timer, and when it elapses, any other similar callbacks for other targets will be batched into an array and fed to the callback. Default is 0.1
    batchMax: 6,   // maximum batch size (targets)
    onEnter: batch => gsap.to(batch, {autoAlpha: 1, stagger: 0.15, overwrite: true}),
    onLeave: batch => gsap.set(batch, {autoAlpha: 0, overwrite: true}),
    onEnterBack: batch => gsap.to(batch, {autoAlpha: 1, stagger: 0.15, overwrite: true}),
    onLeaveBack: batch => gsap.set(batch, {autoAlpha: 0, overwrite: true})
  });

});
