// your-select.jsx
import React, { ComponentProps } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';

import styles from './Select.module.css';

type SelectRef = HTMLButtonElement;
type SelectProps = ComponentProps<typeof SelectPrimitive.Root>;

export const Select = React.forwardRef<SelectRef, SelectProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger
          className={styles.selectTrigger}
          ref={forwardedRef}
        >
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon className={styles.selectIcon}>
            <ChevronDownIcon />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className={styles.selectContent}>
            {/* <SelectPrimitive.ScrollUpButton>
              <ChevronUpIcon />
            </SelectPrimitive.ScrollUpButton> */}
            <SelectPrimitive.Viewport className={styles.selectViewport}>
              {children}
            </SelectPrimitive.Viewport>
            {/* <SelectPrimitive.ScrollDownButton>
              <ChevronDownIcon />
            </SelectPrimitive.ScrollDownButton> */}
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  },
);

type SelectItemRef = HTMLDivElement;
type SelectItemProps = ComponentProps<typeof SelectPrimitive.Item>;

export const SelectItem = React.forwardRef<SelectItemRef, SelectItemProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <SelectPrimitive.Item
        className={styles.selectItem}
        {...props}
        ref={forwardedRef}
      >
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <SelectPrimitive.ItemIndicator className={styles.selectItemIndicator}>
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    );
  },
);
