import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Maps to the Figma `Type` variant axis. */
  variant?: ButtonVariant;
  /** Shows a spinner, marks the button busy, and blocks interaction. */
  loading?: boolean;
  /** Button label. */
  children: React.ReactNode;
}

/**
 * Button — Harbor Design System.
 *
 * Token-driven: every color, size, radius, and type value comes from the
 * `--ds-component-button-*` / `--ds-semantic-typography-label-lg-*` CSS variables built
 * from the Figma `Button` component set. Interaction states are CSS-driven
 * (`:hover`, `:active`, `:focus-visible`), `disabled` via the native attribute,
 * and `loading` via `aria-busy`.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', loading = false, disabled, children, className, type = 'button', ...rest },
    ref
  ) => {
    const classes = ['harbor-button', className].filter(Boolean).join(' ');
    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        data-variant={variant}
        aria-busy={loading || undefined}
        disabled={disabled}
        {...rest}
      >
        {loading && <span className="harbor-button__spinner" aria-hidden="true" />}
        <span className="harbor-button__label">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
