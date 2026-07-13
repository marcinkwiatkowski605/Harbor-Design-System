import React from 'react';
import {
  Select as AriaSelect,
  SelectValue,
  Button,
  Label,
  Text,
  FieldError,
  Popover,
  ListBox,
  ListBoxItem,
  type SelectProps as AriaSelectProps,
  type ValidationResult,
} from 'react-aria-components';
import { ChevronDownIcon, InfoCircleFilledIcon, AlertTriangleFilledIcon } from '../../icons';
import './Select.css';

export interface SelectOption {
  /** Unique key for this option. */
  id: string;
  /** Text shown in the trigger and in the list of options. */
  label: string;
  /** Disables just this option, leaving the rest of the list interactive. */
  isDisabled?: boolean;
}

export interface SelectProps
  extends Omit<AriaSelectProps<SelectOption>, 'children' | 'items'> {
  /** Field label, shown above the trigger. */
  label?: React.ReactNode;
  /** Helper text shown below the trigger when the field is valid. */
  description?: React.ReactNode;
  /** Error message shown below the trigger when `isInvalid` is true. */
  errorMessage?: string | ((validation: ValidationResult) => string);
  /** The list of selectable options. */
  items: SelectOption[];
}

/**
 * Select — Harbor Design System (experimental React Aria Components build).
 *
 * Composed from `react-aria-components`' `Select` + `Label` + `Button` +
 * `SelectValue` + `Popover` + `ListBox`/`ListBoxItem` + `Text` (slot="description")
 * + `FieldError` — the same "explicit anatomy" composition style as TextField,
 * giving full control over styling each part. Single-selection only for now
 * (RAC also supports `selectionMode="multiple"`, not exposed here yet). Trigger
 * colors/sizes are real component tokens; Popover/ListBox/option colors are
 * still placeholders (no Figma tokens exist for those yet).
 *
 * Note on prop naming: unlike Button (which keeps `disabled` for backward
 * compatibility with its pre-RAC API), this is a net-new component, so it
 * exposes RAC's native `isDisabled`/`isRequired`/`isInvalid` directly — the
 * intended convention going forward for components without a legacy API to
 * preserve.
 */
export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ label, description, errorMessage, items, className, ...rest }, ref) => {
    const classes = ['harbor-select', className].filter(Boolean).join(' ');
    return (
      <AriaSelect ref={ref} className={classes} {...rest}>
        {label && <Label className="harbor-select__label">{label}</Label>}
        <Button className="harbor-select__trigger">
          <SelectValue className="harbor-select__value" />
          <ChevronDownIcon className="harbor-select__chevron" aria-hidden="true" />
        </Button>
        {description && (
          <Text slot="description" className="harbor-select__description">
            <InfoCircleFilledIcon className="harbor-select__description-icon" />
            <span className="harbor-select__description-text">{description}</span>
          </Text>
        )}
        <FieldError className="harbor-select__error">
          {(validation) => (
            <>
              <AlertTriangleFilledIcon className="harbor-select__error-icon" />
              <span className="harbor-select__error-text">
                {typeof errorMessage === 'function' ? errorMessage(validation) : errorMessage}
              </span>
            </>
          )}
        </FieldError>
        <Popover className="harbor-select__popover">
          <ListBox items={items} className="harbor-select__listbox">
            {(item) => (
              <ListBoxItem
                id={item.id}
                isDisabled={item.isDisabled}
                className="harbor-select__option"
              >
                {item.label}
              </ListBoxItem>
            )}
          </ListBox>
        </Popover>
      </AriaSelect>
    );
  }
);

Select.displayName = 'Select';
