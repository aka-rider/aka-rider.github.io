'use client';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface TypingTextProps {
  text: string;
  cursor?: string;
  typingSpeed?: number;
  className?: string;
}

export default function TypingText({
  text,
  cursor = '_',
  typingSpeed = 0.8,
  className = '',
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const isTypingComplete = displayedText.length >= text.length;

  useEffect(() => {
    setDisplayedText('');
  }, [text]);

  useEffect(() => {
    if (displayedText.length >= text.length) return;

    const charInterval = (typingSpeed * 1000) / text.length;

    const timer = setTimeout(() => {
      setDisplayedText(text.substring(0, displayedText.length + 1));
    }, charInterval);

    return () => clearTimeout(timer);
  }, [displayedText, text, typingSpeed]);

  return (
    <div
      className={clsx('flex flex-row gap-2 mb-10  animate-flicker', className)}
    >
      <span>{displayedText}</span>
      <span
        className={clsx('inline-block font-bold', {
          'animate-blink': isTypingComplete,
        })}
      >
        {cursor}
      </span>
    </div>
  );
}
