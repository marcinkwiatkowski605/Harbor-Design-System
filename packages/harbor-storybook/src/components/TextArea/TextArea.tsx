import React from 'react';
import {
  TextField as AriaTextField,
  Label,
  TextArea as AriaTextArea,
  Text,
  FieldError,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from 'react-aria-components';
import { InfoCircleFilledIcon, AlertTriangleFilledIcon } from '../../icons';
import './TextArea.css';

export interface TextAreaProps extends Omit<AriaTextFieldProps, 'children'> {
  /** Field label, shown above the textarea. */
  label?: React.ReactNode;
  /** Helper text shown below the textarea when the field is valid. */
  description?: React.ReactNode;
  /** Error message shown below the textarea when `isInvalid` is true. */
  errorMessage?: string | ((validation: ValidationResult) => string);
  /** Placeholder text shown when the textarea is empty. */
  placeholder?: string;
  /** Visible number of text lines (native `rows` attribute). */
  rows?: number;
  /** A ref for the underlying `<textarea>` element. */
  textAreaRef?: React.Ref<HTMLTextAreaElement>;
}

/**
 * TextArea — Harbor Design System (experimental React Aria Components build).
 *
 * Like TextField, RAC's `TextArea` is a drop-in swap for `Input` inside the same
 * `TextField` container — Harbor's TextField and TextArea share the exact same
 * Label/description/error wiring, just a different editable element.
 *
 * Note on prop naming: unlike Button (which keeps `disabled` for backward
 * compatibility with its pre-RAC API), this is a net-new component, so it
 * exposes RAC's native `isDisabled`/`isRequired`/`isInvalid` directly — the
 * intended convention going forward for components without a legacy API to
 * preserve.
 */
export const TextArea = React.forwardRef<HTMLDivElement, TextAreaProps>(
  (
    { label, description, errorMessage, placeholder, rows, textAreaRef, className, ...rest },
    ref
  ) => {
    const classes = ['harbor-textarea', className].filter(Boolean).join(' ');
    return (
      <AriaTextField ref={ref} className={classes} {...rest}>
        {label && <Label className="harbor-textarea__label">{label}</Label>}
        <AriaTextArea
          ref={textAreaRef}
          placeholder={placeholder}
          rows={rows}
          className="harbor-textarea__input"
        />
        {description && (
          <Text slot="description" className="harbor-textarea__description">
            <InfoCircleFilledIcon aria-hidden="true" className="harbor-textarea__description-icon" />
            <span className="harbor-textarea__description-text">{description}</span>
          </Text>
        )}
        <FieldError className="harbor-textarea__error">
          {(validation) => (
            <>
              <AlertTriangleFilledIcon aria-hidden="true" className="harbor-textarea__error-icon" />
              <span className="harbor-textarea__error-text">
                {(typeof errorMessage === 'function' ? errorMessage(validation) : errorMessage) ??
                  validation.defaultChildren}
              </span>
            </>
          )}
        </FieldError>
      </AriaTextField>
    );
  }
);

TextArea.displayName = 'TextArea';
