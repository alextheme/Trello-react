import React from 'react';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonProps } from './Button.props';
import styles from './Button.module.scss';

export const Button = ({
  appearance = 'grey',
  circle,
  simpleButton,
  awesomeIconProp,
  children,
  className,
  ...props
}: ButtonProps): JSX.Element => (
  <button
    className={cn(styles.button, className, {
      [styles.simpleButton]: simpleButton,
      [styles.grey]: appearance === 'grey',
      [styles.blue]: appearance === 'blue',
      [styles.brown]: appearance === 'brown',
      [styles.circle]: circle,
    })}
    {...props}
  >
    {awesomeIconProp && (
      <span className={cn(styles.icon)}>
        <FontAwesomeIcon icon={awesomeIconProp} />
      </span>
    )}
    {children}
  </button>
);
