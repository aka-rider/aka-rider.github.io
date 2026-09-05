import * as React from 'react';

import { TypingText } from 'iurii.net';

export const Default = () => <TypingText text='404 - Page not found' typingSpeed={0.05} />;

export const CustomCursor = () => (
  <TypingText text="Hello, I'm Iurii." typingSpeed={0.05} cursor='|' />
);
