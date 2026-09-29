'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function Analytics() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!document.prerendering) {
      setReady(true);
      return;
    }

    const onActivate = () => setReady(true);
    document.addEventListener('prerenderingchange', onActivate, {
      once: true,
    });
    return () => document.removeEventListener('prerenderingchange', onActivate);
  }, []);

  return (
    <>
      {/* 100% privacy-first analytics simpleanalytics.com */}
      {ready && (
        <Script
          strategy='lazyOnload'
          data-collect-dnt='true'
          src='https://scripts.simpleanalyticscdn.com/latest.js'
        />
      )}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src='https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true'
          alt=''
          referrerPolicy='no-referrer-when-downgrade'
        />
      </noscript>
    </>
  );
}
