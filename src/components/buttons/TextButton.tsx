import * as React from 'react';

import clsxm from '@/lib/clsxm';

type TextButtonVariant = 'primary' | 'basic';

type TextButtonProps = {
  variant?: TextButtonVariant;
} & React.ComponentPropsWithRef<'button'>;

const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      disabled: buttonDisabled,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type='button'
        disabled={buttonDisabled}
        className={clsxm(
          'button inline-flex items-center justify-center font-semibold',
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
          'transition-colors duration-150',
          //#region  //*=========== Variant ===========
          variant === 'primary' && [
            'text-primary-500 hover:text-sky-600 active:text-primary-700',
            'disabled:text-primary-200',
          ],
          variant === 'basic' && [
            'text-black hover:text-slate-600 active:text-slate-800',
            'disabled:text-slate-300',
          ],
          //#endregion  //*======== Variant ===========
          'disabled:cursor-not-allowed disabled:brightness-105 disabled:hover:underline',
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

export default TextButton;
