import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface HeaderPopupCardDialogProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children?: ReactNode;
  title: string;
  classname: string;
}
