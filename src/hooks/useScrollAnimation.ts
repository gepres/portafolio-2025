import { useInView } from 'react-intersection-observer';

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, triggerOnce = true, rootMargin = '0px' } = options;

  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
    rootMargin,
  });

  return { ref, inView };
};
