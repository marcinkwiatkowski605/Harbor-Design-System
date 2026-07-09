import React from 'react';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export interface ButtonProps
  extends Omit<AriaButtonProps, 'children' | 'isDisabled' | 'className'> {
  /** Visual style. Maps to the Figma `Type` variant axis. */
  variant?: ButtonVariant;
  /** Button label. */
  children: React.ReactNode;
  /** Native disabled attribute — mapped internally to react-aria-components' `isDisabled`. */
  disabled?: boolean;
  className?: string;
}

/**
 * Button — Harbor Design System (experimental React Aria Components rebuild).
 *
 * Built on `react-aria-components`' `Button` primitive instead of a native
 * `<button>`. Interaction states are exposed as `data-hovered` / `data-pressed` /
 * `data-focus-visible` / `data-disabled` attributes (see `Button.css`) rather than
 * `:hover` / `:active` / `:focus-visible` pseudo-classes. Fully token-driven —
 * `Button.css` references the same real `--ds-component-button-*` /
 * `--ds-semantic-*` values as the pre-rebuild version.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', disabled, children, className, type = 'button', ...rest },
    ref
  ) => {
    const classes = ['harbor-button', className].filter(Boolean).join(' ');
    return (
      <AriaButton
        ref={ref}
        type={type}
        className={classes}
        data-variant={variant}
        isDisabled={disabled}
        {...rest}
      >
        {children}
      </AriaButton>
    );
  }
);

Button.displayName = 'Button';
