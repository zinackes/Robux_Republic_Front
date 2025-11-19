'use client';;
import * as React from 'react';
import { Menu as MenuPrimitive } from '@base-ui-components/react/menu';
import { AnimatePresence, motion } from 'motion/react';

import { Highlight, HighlightItem } from '@/components/animate-ui/primitives/effects/highlight';
import { getStrictContext } from '@/lib/get-strict-context';
import { useControlledState } from '@/hooks/use-controlled-state';
import { useDataState } from '@/hooks/use-data-state';

const [MenuActiveValueProvider, useMenuActiveValue] =
  getStrictContext('MenuActiveValueContext');
const [MenuProvider, useMenu] =
  getStrictContext('MenuContext');

function Menu(props) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props?.open,
    defaultValue: props?.defaultOpen,
    onChange: props?.onOpenChange,
  });
  const [highlightedValue, setHighlightedValue] = React.useState(null);

  return (
    <MenuActiveValueProvider value={{ highlightedValue, setHighlightedValue }}>
      <MenuProvider value={{ isOpen, setIsOpen }}>
        <MenuPrimitive.Root data-slot="menu" {...props} onOpenChange={setIsOpen} />
      </MenuProvider>
    </MenuActiveValueProvider>
  );
}

function MenuTrigger(props) {
  return <MenuPrimitive.Trigger data-slot="menu-trigger" {...props} />;
}

function MenuPortal(props) {
  const { isOpen } = useMenu();

  return (
    <AnimatePresence>
      {isOpen && (
        <MenuPrimitive.Portal keepMounted data-slot="menu-portal" {...props} />
      )}
    </AnimatePresence>
  );
}

function MenuGroup(props) {
  return <MenuPrimitive.Group data-slot="menu-group" {...props} />;
}

function MenuGroupLabel(props) {
  return <MenuPrimitive.GroupLabel data-slot="menu-group-label" {...props} />;
}

function MenuSubmenu(props) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props?.open,
    defaultValue: props?.defaultOpen,
    onChange: props?.onOpenChange,
  });

  return (
    <MenuProvider value={{ isOpen, setIsOpen }}>
      <MenuPrimitive.SubmenuRoot data-slot="menu-submenu" {...props} onOpenChange={setIsOpen} />
    </MenuProvider>
  );
}

function MenuSubmenuTrigger({
  label,
  id,
  nativeButton,
  ...props
}) {
  const { setHighlightedValue } = useMenuActiveValue();
  const [, highlightedRef] = useDataState('highlighted', undefined, (value) => {
    if (value === true) {
      const el = highlightedRef.current;
      const v = el?.dataset.value || el?.id || null;
      if (v) setHighlightedValue(v);
    }
  });

  return (
    <MenuPrimitive.SubmenuTrigger
      ref={highlightedRef}
      label={label}
      id={id}
      nativeButton={nativeButton}
      data-slot="menu-submenu-trigger"
      {...props} />
  );
}

function MenuHighlight({
  transition = { type: 'spring', stiffness: 350, damping: 35 },
  ...props
}) {
  const { highlightedValue } = useMenuActiveValue();

  return (
    <Highlight
      data-slot="menu-highlight"
      click={false}
      controlledItems
      transition={transition}
      value={highlightedValue}
      {...props} />
  );
}

function MenuHighlightItem(props) {
  return <HighlightItem data-slot="menu-highlight-item" {...props} />;
}

function MenuPositioner(props) {
  return <MenuPrimitive.Positioner data-slot="menu-positioner" {...props} />;
}

function MenuPopup({
  finalFocus,
  id,
  transition = { duration: 0.2 },
  style,
  ...props
}) {
  return (
    <MenuPrimitive.Popup
      finalFocus={finalFocus}
      id={id}
      render={
        <motion.div
          key="menu-popup"
          data-slot="menu-popup"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={transition}
          style={{ willChange: 'opacity, transform', ...style }}
          {...props} />
      } />
  );
}

function MenuItem({
  disabled,
  label,
  closeOnClick,
  nativeButton,
  id,
  ...props
}) {
  const { setHighlightedValue } = useMenuActiveValue();
  const [, highlightedRef] = useDataState('highlighted', undefined, (value) => {
    if (value === true) {
      const el = highlightedRef.current;
      const v = el?.dataset.value || el?.id || null;
      if (v) setHighlightedValue(v);
    }
  });

  return (
    <MenuPrimitive.Item
      ref={highlightedRef}
      label={label}
      closeOnClick={closeOnClick}
      nativeButton={nativeButton}
      disabled={disabled}
      id={id}
      data-slot="menu-item"
      {...props} />
  );
}

function MenuCheckboxItem({
  label,
  defaultChecked,
  checked,
  onCheckedChange,
  disabled,
  closeOnClick,
  nativeButton,
  id,
  ...props
}) {
  const { setHighlightedValue } = useMenuActiveValue();
  const [, highlightedRef] = useDataState('highlighted', undefined, (value) => {
    if (value === true) {
      const el = highlightedRef.current;
      const v = el?.dataset.value || el?.id || null;
      if (v) setHighlightedValue(v);
    }
  });
  return (
    <MenuPrimitive.CheckboxItem
      ref={highlightedRef}
      label={label}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      closeOnClick={closeOnClick}
      nativeButton={nativeButton}
      id={id}
      data-slot="menu-checkbox-item"
      {...props} />
  );
}

function MenuCheckboxItemIndicator({
  keepMounted,
  ...props
}) {
  return (
    <MenuPrimitive.CheckboxItemIndicator
      data-slot="menu-checkbox-item-indicator"
      keepMounted={keepMounted}
      render={
        <motion.div data-slot="menu-checkbox-item-indicator" {...props} />
      } />
  );
}

function MenuRadioGroup(props) {
  return <MenuPrimitive.RadioGroup data-slot="menu-radio-group" {...props} />;
}

function MenuRadioItem({
  value,
  disabled,
  label,
  closeOnClick,
  nativeButton,
  id,
  ...props
}) {
  const { setHighlightedValue } = useMenuActiveValue();
  const [, highlightedRef] = useDataState('highlighted', undefined, (value) => {
    if (value === true) {
      const el = highlightedRef.current;
      const v = el?.dataset.value || el?.id || null;
      if (v) setHighlightedValue(v);
    }
  });
  return (
    <MenuPrimitive.RadioItem
      ref={highlightedRef}
      value={value}
      disabled={disabled}
      label={label}
      closeOnClick={closeOnClick}
      nativeButton={nativeButton}
      id={id}
      data-slot="menu-radio-item"
      {...props} />
  );
}

function MenuRadioItemIndicator({
  keepMounted,
  ...props
}) {
  return (
    <MenuPrimitive.RadioItemIndicator
      data-slot="menu-radio-item-indicator"
      keepMounted={keepMounted}
      render={<motion.div data-slot="menu-radio-item-indicator" {...props} />} />
  );
}

function MenuShortcut(props) {
  return <span data-slot="menu-shortcut" {...props} />;
}

function MenuArrow(props) {
  return <MenuPrimitive.Arrow data-slot="menu-arrow" {...props} />;
}

function MenuSeparator(props) {
  return <MenuPrimitive.Separator data-slot="menu-separator" {...props} />;
}

export { Menu, MenuTrigger, MenuPortal, MenuPositioner, MenuPopup, MenuArrow, MenuItem, MenuCheckboxItem, MenuCheckboxItemIndicator, MenuRadioGroup, MenuRadioItem, MenuRadioItemIndicator, MenuGroup, MenuGroupLabel, MenuSeparator, MenuShortcut, MenuHighlight, MenuHighlightItem, MenuSubmenu, MenuSubmenuTrigger, useMenuActiveValue, useMenu };
