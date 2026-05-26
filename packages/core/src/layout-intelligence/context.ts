import * as React from 'react';

// Specialised contexts beat a god-object context here: each compound parent
// publishes exactly the info its children need, and children that don't care
// don't subscribe. All contexts default to `undefined` so a component renders
// fine without a wrapping parent.

// --- ButtonGroup --------------------------------------------------------
export interface ButtonGroupContextValue {
  readonly orientation: 'horizontal' | 'vertical';
  readonly size: 'sm' | 'md' | 'lg';
  readonly variant: 'solid' | 'outline' | 'ghost' | 'link';
  readonly attached: boolean;
  /** Position helpers for the LIL to round outer corners / merge borders. */
  readonly position: { readonly index: number; readonly isFirst: boolean; readonly isLast: boolean };
}
export const ButtonGroupContext = React.createContext<ButtonGroupContextValue | undefined>(undefined);

// --- List ---------------------------------------------------------------
export interface ListContextValue {
  readonly density: 'compact' | 'comfortable' | 'spacious';
  readonly dividers: boolean;
  readonly interactive: boolean;
}
export const ListContext = React.createContext<ListContextValue | undefined>(undefined);

// --- Stack --------------------------------------------------------------
export interface StackContextValue {
  readonly orientation: 'row' | 'column';
  readonly align: 'start' | 'center' | 'end' | 'stretch';
  readonly justify: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
}
export const StackContext = React.createContext<StackContextValue | undefined>(undefined);

// --- Form ---------------------------------------------------------------
export interface FormFieldContextValue {
  readonly id: string;
  readonly labelId: string;
  readonly descriptionId: string;
  readonly errorId: string;
  readonly invalid: boolean;
  readonly disabled: boolean;
  readonly required: boolean;
}
export const FormFieldContext = React.createContext<FormFieldContextValue | undefined>(undefined);

// --- Card ---------------------------------------------------------------
export interface CardContextValue {
  readonly variant: 'elevated' | 'outlined' | 'filled';
  readonly density: 'compact' | 'comfortable' | 'spacious';
  readonly interactive: boolean;
}
export const CardContext = React.createContext<CardContextValue | undefined>(undefined);

// Hooks ------------------------------------------------------------------
export const useButtonGroupContext = (): ButtonGroupContextValue | undefined =>
  React.useContext(ButtonGroupContext);
export const useListContext = (): ListContextValue | undefined => React.useContext(ListContext);
export const useStackContext = (): StackContextValue | undefined => React.useContext(StackContext);
export const useFormFieldContext = (): FormFieldContextValue | undefined =>
  React.useContext(FormFieldContext);
export const useCardContext = (): CardContextValue | undefined => React.useContext(CardContext);
