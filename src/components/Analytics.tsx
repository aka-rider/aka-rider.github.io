import Script from 'next/script';

export default function Analytics() {
  return (
    <>
      {/* 100% privacy-first analytics simpleanalytics.com */}
      <Script strategy="lazyOnload" data-collect-dnt="true" src="https://scripts.simpleanalyticscdn.com/latest.js" />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true" alt="" referrerPolicy="no-referrer-when-downgrade" />
      </noscript>
    </>
  );
}