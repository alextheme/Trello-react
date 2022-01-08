import { DetailedHTMLProps, ReactNode, SelectHTMLAttributes } from 'react';
import { ICardContent, IListContent } from '../../../../../../common/interfaces/Interfaces';

export interface SelectProps extends DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  children?: ReactNode;
  options: { [id: number]: ICardContent } | { [id: number]: IListContent };
  defaultValue: number;
  additionalOption: number | undefined;
  startValueId: number;
  textCurrnt: string;
}
