import { useEffect, useRef } from 'react';

/**
 * Global Scroll Reveal Hook
 * Applies 'revealed' class to elements with 'reveal' class
 * when they enter the viewport, with staggered delays.
 * Also observes DOM mutations so dynamically rendered
 * content (e.g. after async data loads) gets animated too.
 */
const useScrollReveal = (options = {}) => {
  const sectionRef = useRef(null);
  const { threshold = 0.08, rootMargin = '0px 0px -40px 0px' } = options;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    const observeAll = () => {
      el.querySelectorAll('.reveal:not(.revealed)').forEach((element) => {
        observer.observe(element);
      });
    };

    observeAll();

    const mutator = new MutationObserver(observeAll);
    mutator.observe(el, { childList: true, subtree: true });

    return () => {
      mutator.disconnect();
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return sectionRef;
};

export default useScrollReveal;