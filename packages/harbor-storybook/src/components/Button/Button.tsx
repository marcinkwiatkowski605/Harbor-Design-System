import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Maps to the Figma `Type` variant axis. */
  variant?: ButtonVariant;
  /** Button label. */
  children: React.ReactNode;
}

/**
 * Button — Harbor Design System.
 *
 * Token-driven: every color, size, radius, and type value comes from the
 * `--ds-component-button-*` / `--ds-semantic-typography-label-lg-*` CSS variables built
 * from the Figma `Button` component set. Interaction states are CSS-driven
 * (`:hover`, `:active`, `:focus-visible`), and `disabled` via the native attribute.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', disabled, children, className, type = 'button', ...rest },
    ref
  ) => {
    const classes = ['harbor-button', className].filter(Boolean).join(' ');
    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        data-variant={variant}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
