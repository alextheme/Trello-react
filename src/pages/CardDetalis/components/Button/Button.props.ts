import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  appearance?: 'blue' | 'grey' | 'brown';
  circle?: boolean;
  simpleButton?: boolean;
  awesomeIconProp?: IconProp;
  children: ReactNode;
}
