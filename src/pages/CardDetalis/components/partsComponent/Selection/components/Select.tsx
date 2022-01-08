/* eslint-disable react/prefer-stateless-function */
/* eslint-disable prettier/prettier */
import React from 'react';
import styles from './Select.module.scss';
import { SelectProps } from "./Select.props";

class Select extends React.Component<SelectProps> {
  render(): React.ReactNode {
    const { options, defaultValue, additionalOption, startValueId, textCurrnt } = this.props;
      return (
        <select className={styles.selectBoard} value={defaultValue} onChange={(): void => {}}>
            {Object.entries(options)
                .sort(([, a], [, b]) => a.position - b.position)
                .map(([, c]) => (
                  <option key={c.id} value={c.id}>
                    {c.id} | {c.position} {c.id === startValueId && textCurrnt}
                  </option>
              ))}
            {additionalOption && <option value={additionalOption}>{additionalOption}</option>}
          </select>
      );
  }
}

export default Select;
