'use client';

import React, { useEffect, useRef, useState } from 'react';

type ActTransitionProps = {
  variant: 'dive' | 'surface';
};

type Band = {
  position: string;
  gradient: string;
  scale: string;
  offset: string;
  delay: string;
};

const BANDS: Record<ActTransitionProps['variant'], Band[]> = {
  dive: [
    {
      position: 'top-[28%] h-[2px]',
      gradient:
        'bg-gradient-to-r from-transparent via-slate-400/25 to-transparent dark:via-slate-500/25',
      scale: '[transform:translateZ(-120px)_scaleX(0.55)]',
      offset: '[transform:translateZ(-120px)_scaleX(0.55)_translateY(-2rem)]',
      delay: 'delay-0',
    },
    {
      position: 'top-[48%] h-[3px]',
      gradient:
        'bg-gradient-to-r from-transparent via-cyan-700/20 to-transparent dark:via-cyan-400/20',
      scale: '[transform:translateZ(-60px)_scaleX(0.75)]',
      offset: '[transform:translateZ(-60px)_scaleX(0.75)_translateY(-2.5rem)]',
      delay: 'delay-100',
    },
    {
      position: 'top-[70%] h-[4px]',
      gradient:
        'bg-gradient-to-r from-transparent via-slate-500/30 to-transparent dark:via-slate-400/30',
      scale: '[transform:translateZ(0px)_scaleX(0.95)]',
      offset: '[transform:translateZ(0px)_scaleX(0.95)_translateY(-3rem)]',
      delay: 'delay-200',
    },
  ],
  surface: [
    {
      position: 'top-[28%] h-[2px]',
      gradient:
        'bg-gradient-to-r from-transparent via-slate-400/25 to-transparent dark:via-slate-500/25',
      scale: '[transform:translateZ(-120px)_scaleX(0.55)]',
      offset: '[transform:translateZ(-120px)_scaleX(0.55)_translateY(3rem)]',
      delay: 'delay-200',
    },
    {
      position: 'top-[48%] h-[3px]',
      gradient:
        'bg-gradient-to-r from-transparent via-cyan-700/20 to-transparent dark:via-cyan-400/20',
      scale: '[transform:translateZ(-60px)_scaleX(0.75)]',
      offset: '[transform:translateZ(-60px)_scaleX(0.75)_translateY(2.5rem)]',
      delay: 'delay-100',
    },
    {
      position: 'top-[70%] h-[4px]',
      gradient:
        'bg-gradient-to-r from-transparent via-slate-500/30 to-transparent dark:via-slate-400/30',
      scale: '[transform:translateZ(0px)_scaleX(0.95)]',
      offset: '[transform:translateZ(0px)_scaleX(0.95)_translateY(2rem)]',
      delay: 'delay-0',
    },
  ],
};

export default function ActTransition({ variant }: ActTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') {
      setEntered(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden='true'
      className='relative h-24 md:h-32 overflow-hidden my-8 [perspective:800px]'
    >
      {BANDS[variant].map((band, index) => (
        <div
          key={index}
          className={`absolute inset-x-0 ${band.position} ${band.gradient} ${band.delay} transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none ${
            entered ? `opacity-100 ${band.scale}` : `opacity-0 ${band.offset}`
          }`}
        />
      ))}
    </div>
  );
}
