import * as React from 'react';

import {
  Menu as MenuPrimitive,
  MenuTrigger as MenuTriggerPrimitive,
  MenuPortal as MenuPortalPrimitive,
  MenuPopup as MenuPopupPrimitive,
  MenuPositioner as MenuPositionerPrimitive,
  MenuGroup as MenuGroupPrimitive,
  MenuGroupLabel as MenuGroupLabelPrimitive,
  MenuArrow as MenuArrowPrimitive,
  MenuItem as MenuItemPrimitive,
  MenuCheckboxItem as MenuCheckboxItemPrimitive,
  MenuCheckboxItemIndicator as MenuCheckboxItemIndicatorPrimitive,
  MenuRadioGroup as MenuRadioGroupPrimitive,
  MenuRadioItem as MenuRadioItemPrimitive,
  MenuRadioItemIndicator as MenuRadioItemIndicatorPrimitive,
  MenuHighlightItem as MenuHighlightItemPrimitive,
  MenuHighlight as MenuHighlightPrimitive,
  MenuSeparator as MenuSeparatorPrimitive,
  MenuShortcut as MenuShortcutPrimitive,
  MenuSubmenu as MenuSubmenuPrimitive,
  MenuSubmenuTrigger as MenuSubmenuTriggerPrimitive,
} from '@/components/animate-ui/primitives/base/menu';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';

function Menu(props) {
  return <MenuPrimitive {...props} />;
}

function MenuTrigger(props) {
  return <MenuTriggerPrimitive {...props} />;
}

function MenuPortal(props) {
  return <MenuPortalPrimitive {...props} />;
}

function MenuPanel({
  className,
  finalFocus,
  id,
  children,
  sideOffset = 4,
  transition = { duration: 0.2 },
  ...props
}) {
  return (
    <MenuPortal>
      <MenuPositionerPrimitive className="z-50" sideOffset={sideOffset} {...props}>
        <MenuPopupPrimitive
          finalFocus={finalFocus}
          transition={transition}
          id={id}
          className={cn(
            'bg-popover text-popover-foreground max-h-(--available-height) min-w-[8rem] origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md outline-none',
            className
          )}>
          <MenuHighlightPrimitive className="absolute inset-0 bg-accent z-0 rounded-sm">
            {children}
          </MenuHighlightPrimitive>
        </MenuPopupPrimitive>
      </MenuPositionerPrimitive>
    </MenuPortal>
  );
}

function MenuGroup(props) {
  return <MenuGroupPrimitive {...props} />;
}

function MenuGroupLabel({
  className,
  inset,
  ...props
}) {
  return (
    <MenuGroupLabelPrimitive
      data-inset={inset}
      className={cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)}
      {...props} />
  );
}

function MenuItem({
  className,
  inset,
  variant = 'default',
  disabled,
  ...props
}) {
  return (
    <MenuHighlightItemPrimitive
      activeClassName={
        variant === 'destructive'
          ? 'bg-destructive/10 dark:bg-destructive/20'
          : ''
      }
      disabled={disabled}>
      <MenuItemPrimitive
        disabled={disabled}
        data-inset={inset}
        data-variant={variant}
        className={cn(
          "focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        {...props} />
    </MenuHighlightItemPrimitive>
  );
}

function MenuCheckboxItem({
  className,
  children,
  checked,
  disabled,
  ...props
}) {
  return (
    <MenuHighlightItemPrimitive disabled={disabled}>
      <MenuCheckboxItemPrimitive
        disabled={disabled}
        className={cn(
          "focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        checked={checked}
        {...props}>
        <span
          className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          <MenuCheckboxItemIndicatorPrimitive initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckIcon className="size-4" />
          </MenuCheckboxItemIndicatorPrimitive>
        </span>
        {children}
      </MenuCheckboxItemPrimitive>
    </MenuHighlightItemPrimitive>
  );
}

function MenuRadioGroup(props) {
  return <MenuRadioGroupPrimitive {...props} />;
}

function MenuRadioItem({
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <MenuHighlightItemPrimitive disabled={disabled}>
      <MenuRadioItemPrimitive
        disabled={disabled}
        className={cn(
          "focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
        {...props}>
        <span
          className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          <MenuRadioItemIndicatorPrimitive layoutId="dropdown-menu-item-indicator-radio">
            <CircleIcon className="size-2 fill-current" />
          </MenuRadioItemIndicatorPrimitive>
        </span>
        {children}
      </MenuRadioItemPrimitive>
    </MenuHighlightItemPrimitive>
  );
}

function MenuSeparator({
  className,
  ...props
}) {
  return (<MenuSeparatorPrimitive className={cn('bg-border -mx-1 my-1 h-px', className)} {...props} />);
}

function MenuShortcut({
  className,
  ...props
}) {
  return (
    <MenuShortcutPrimitive
      className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
      {...props} />
  );
}

function MenuArrow(props) {
  return <MenuArrowPrimitive {...props} />;
}

function MenuSubmenu(props) {
  return <MenuSubmenuPrimitive {...props} />;
}

function MenuSubmenuTrigger({
  disabled,
  className,
  inset,
  children,
  ...props
}) {
  return (
    <MenuHighlightItemPrimitive disabled={disabled}>
      <MenuSubmenuTriggerPrimitive
        disabled={disabled}
        data-inset={inset}
        className={cn(
          'focus:text-accent-foreground data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8',
          'aria-[expanded=true]:[&_[data-slot=chevron]]:rotate-90 [&_[data-slot=chevron]]:transition-transform [&_[data-slot=chevron]]:duration-300 [&_[data-slot=chevron]]:ease-in-out',
          className
        )}
        {...props}>
        {children}
        <ChevronRightIcon data-slot="chevron" className="ml-auto size-4" />
      </MenuSubmenuTriggerPrimitive>
    </MenuHighlightItemPrimitive>
  );
}

function MenuSubmenuPanel({
  className,
  finalFocus,
  id,
  children,
  sideOffset = 4,
  transition = { duration: 0.2 },
  ...props
}) {
  return (
    <MenuPortal>
      <MenuPositionerPrimitive className="z-50" sideOffset={sideOffset} {...props}>
        <MenuPopupPrimitive
          finalFocus={finalFocus}
          transition={transition}
          id={id}
          className={cn(
            'bg-popover text-popover-foreground max-h-(--available-height) min-w-[8rem] origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
            className
          )}>
          {children}
        </MenuPopupPrimitive>
      </MenuPositionerPrimitive>
    </MenuPortal>
  );
}

export { Menu, MenuTrigger, MenuPortal, MenuPanel, MenuGroup, MenuGroupLabel, MenuItem, MenuCheckboxItem, MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuShortcut, MenuArrow, MenuSubmenu, MenuSubmenuTrigger, MenuSubmenuPanel };
