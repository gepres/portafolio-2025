import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(canvasRef.current, {
      background: 'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15), transparent 50%), radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.15), transparent 50%)',
      duration: 8,
      ease: 'none',
    })
      .to(canvasRef.current, {
        background: 'radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.15), transparent 50%), radial-gradient(circle at 0% 100%, rgba(99, 102, 241, 0.15), transparent 50%)',
        duration: 8,
        ease: 'none',
      })
      .to(canvasRef.current, {
        background: 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.15), transparent 50%), radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.15), transparent 50%)',
        duration: 8,
        ease: 'none',
      });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15), transparent 50%), radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.15), transparent 50%)',
        }}
      />
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
