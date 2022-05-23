require(['plugins/gsap/gsap', 'plugins/gsap/ScrollTrigger'], (gsapModule, ScrollTriggerModule) => {

  const gsap = gsapModule.gsap;
  const ScrollTrigger = ScrollTriggerModule.ScrollTrigger;

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTriggerModule);

  // Set relevant configs
  ScrollTrigger.config({limitCallbacks: true});
  gsap.config({nullTargetWarn: false});

  // Define from states for standard transitions
  const fade_in_start = {autoAlpha: 0, stagger:.25};
  const move_left_start = {x: 100, stagger:.25};
  const move_right_start = {x: -100, stagger:.25};
  const move_up_start = {y: 100, stagger:.25};

  // Function to set and standardize ScrollTrigger settings
  const addScrollTrigger = function(obj, target){
    let config = { ...obj };
    config.scrollTrigger = {
      trigger: target,
      scrub: true,
      end: 'top center',
    };
    return config
  };

  // Inititate triggers for individual items
  gsap.utils.toArray('.unl-scroll-fx-fade-in').forEach(box => gsap.from(box, addScrollTrigger(fade_in_start, box)));
  gsap.utils.toArray('.unl-scroll-fx-move-left').forEach(box => gsap.from(box, addScrollTrigger(move_left_start, box)));
  gsap.utils.toArray('.unl-scroll-fx-move-right').forEach(box => gsap.from(box, addScrollTrigger(move_right_start, box)));
  gsap.utils.toArray('.unl-scroll-fx-move-up').forEach(box => gsap.from(box, addScrollTrigger(move_up_start, box)));

  // Initiate triggers for lists
  gsap.utils.toArray('.unl-scroll-fx-children-fade-in').forEach((item) => {
    let config = { ...fade_in_start };
    config.stagger = (item.dataset.fxStagger) ? parseFloat(item.dataset.fxStagger) : .15;
    config.duration = (item.dataset.fxDuration) ? parseFloat(item.dataset.fxDuration) : .25;

    ScrollTrigger.batch(item.children, {
      onEnter: elements => { gsap.from(elements, config) },
      once: (item.dataset.fxOnce) ? true : false
    });
  });

});
