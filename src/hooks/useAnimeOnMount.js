import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

/**
 * Runs a staggered anime.js entrance animation on child elements when the container mounts.
 *
 * @param {string} childSelector - CSS selector for child elements to animate (e.g. '.card')
 * @param {object} options - Animation options
 * @param {number} options.staggerDelay - Delay between each child (ms), default 100
 * @param {number} options.duration - Animation duration (ms), default 600
 * @param {number} options.translateY - Starting Y offset (px), default 30
 * @param {string} options.easing - Easing function, default 'easeOutExpo'
 * @returns {React.RefObject} - Ref to attach to the container element
 */
const useAnimeOnMount = (childSelector, options = {}) => {
    const containerRef = useRef(null);

    const {
        staggerDelay = 100,
        duration = 600,
        translateY = 30,
        easing = 'easeOutExpo',
        delay = 0,
    } = options;

    useEffect(() => {
        if (!containerRef.current) return;
        const targets = containerRef.current.querySelectorAll(childSelector);
        if (targets.length === 0) return;

        // Set initial state
        targets.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = `translateY(${translateY}px)`;
        });

        animate(targets, {
            opacity: [0, 1],
            translateY: [translateY, 0],
            duration,
            delay: stagger(staggerDelay, { start: delay }),
            easing,
        });
    }, [childSelector, staggerDelay, duration, translateY, easing, delay]);

    return containerRef;
};

export default useAnimeOnMount;
