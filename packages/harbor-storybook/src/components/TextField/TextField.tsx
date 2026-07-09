import React from 'react';
import {
  TextField as AriaTextField,
  Label,
  Input,
  Text,
  FieldError,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from 'react-aria-components';
import './TextField.css';

export interface TextFieldProps extends Omit<AriaTextFieldProps, 'children'> {
  /** Field label, shown above the input. */
  label?: React.ReactNode;
  /** Helper text shown below the input when the field is valid. */
  description?: React.ReactNode;
  /** Error message shown below the input when `isInvalid` is true. Accepts a
   * static string or a function of the current validation result. */
  errorMessage?: string | ((validation: ValidationResult) => string);
  /** Placeholder text shown when the input is empty. */
  placeholder?: string;
  /** A ref for the underlying `<input>` element. */
  inputRef?: React.Ref<HTMLInputElement>;
}

/**
 * TextField — Harbor Design System (experimental React Aria Components build).
 *
 * Composed from `react-aria-components`' `TextField` + `Label` + `Input` +
 * `Text` (slot="description") + `FieldError`, following the same anatomy as
 * Adobe's React Aria docs and Workleap Hopper's TextField. Exposes the full
 * React Aria surface (validation, disabled/read-only/required, controlled or
 * uncontrolled value). Colors and sizes are PLACEHOLDER values on this
 * branch, pending component tokens.
 */
export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  ({ label, description, errorMessage, placeholder, inputRef, className, ...rest }, ref) => {
    const classes = ['harbor-textfield', className].filter(Boolean).join(' ');
    return (
      <AriaTextField ref={ref} className={classes} {...rest}>
        {label && <Label className="harbor-textfield__label">{label}</Label>}
        <Input ref={inputRef} placeholder={placeholder} className="harbor-textfield__input" />
        {description && (
          <Text slot="description" className="harbor-textfield__description">
            {description}
          </Text>
        )}
        <FieldError className="harbor-textfield__error">{errorMessage}</FieldError>
      </AriaTextField>
    );
  }
);

TextField.displayName = 'TextField';
