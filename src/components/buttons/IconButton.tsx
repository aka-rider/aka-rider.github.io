import * as React from 'react';
import { IconType } from 'react-icons';
import { ImSpinner2 } from 'react-icons/im';

import clsxm from '@/lib/clsxm';

type IconButtonVariant = 'primary' | 'outline' | 'ghost';

type IconButtonProps = {
  isLoading?: boolean;
  isDarkBg?: boolean;
  variant?: IconButtonVariant;
  icon?: IconType;
  iconClassName?: string;
} & React.ComponentPropsWithRef<'button'>;

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = 'primary',
      isDarkBg = false,
      icon: Icon,
      iconClassName,
      ...rest
    },
    ref,
  ) => {
    const disabled = isLoading || buttonDisabled;

    return (
      <button
        ref={ref}
        type='button'
        disabled={disabled}
        className={clsxm(
          'inline-flex items-center justify-center rounded font-medium',
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
          'shadow-sm',
          'transition-colors duration-75',
          'min-h-[28px] min-w-[28px] p-1 md:min-h-[34px] md:min-w-[34px] md:p-2',
          //#region  //*=========== Variants ===========
          [
            variant === 'primary' && [
              'bg-primary-500 text-white',
              'border-primary-600 border',
              'hover:bg-primary-600 hover:text-white',
              'active:bg-primary-700',
              'disabled:bg-primary-700',
              'dark:bg-primary-600 dark:border-primary-700',
              'dark:hover:bg-primary-700 dark:active:bg-primary-800',
              'dark:disabled:bg-primary-800',
            ],
            variant === 'outline' && [
              'text-primary-500 bg-white dark:bg-gray-900',
              'border-primary-500 border',
              'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
              'dark:text-primary-400 dark:border-primary-400',
              'dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:disabled:bg-gray-700',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'ghost' && [
              'text-primary-500 bg-transparent',
              'shadow-none',
              'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
              'dark:text-primary-400',
              'dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:disabled:bg-gray-700',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
          ],
          //#endregion  //*======== Variants ===========
          'disabled:cursor-not-allowed',
          isLoading &&
            'relative text-transparent transition-none hover:text-transparent disabled:cursor-wait',
          className,
        )}
        {...rest}
      >
        {isLoading && (
          <div
            className={clsxm(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              {
                'text-white dark:text-gray-200': variant === 'primary',
                'text-primary-500 dark:text-primary-400': [
                  'outline',
                  'ghost',
                ].includes(variant),
              },
            )}
          >
            <ImSpinner2 className='animate-spin' />
          </div>
        )}
        {Icon && <Icon className={clsxm(iconClassName)} />}
      </button>
    );
  },
);

export default IconButton;
