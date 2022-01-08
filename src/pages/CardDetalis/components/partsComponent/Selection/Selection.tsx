/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { SelectionProps } from './Selection.props';
import styles from './Selection.module.scss';
import Select from "./components/Select";
// import ArrowIcon from './arrow.svg'; key, value, valueId

export const Selection = ({ data, children, className, ...props }: SelectionProps): JSX.Element => {
  const { src } = data;
  const current = '(текущий)';

  // BOARDS
  if (data.key === 'boards') {
    const buttonLabel = 'Доска';
    const boardTitle = data.value.boards.find((b) => b.id === data.valueId)?.title;

    return (
      <div className={cn(styles.buttonSelection, className)} {...props}>
        <div className={cn(styles.buttonLink)}>
          <span className={styles.label}>{buttonLabel}</span>
          <span className={styles.value}>{boardTitle}</span>

          {data.value.boards.length && (
            <select className={styles.selectBoard} defaultValue={data.valueId}>
              {data.value.boards.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} {b.id} {src.boardId === b.id ? current : ''}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    );
  }

  // LISTS
  if (data.key === 'lists') {
    const buttonLabel = 'Список';
    const list = Object.entries(data.value.lists).find(([, l]) => l.id === data.valueId)?.[1];

    if (list) {
      return (
        <div className={cn(styles.buttonSelection, className)} {...props}>
          <div className={cn(styles.buttonLink)}>
            <span className={styles.label}>{buttonLabel}</span>
            <span className={styles.value}>{list.title}</span>
            <Select 
              options={data.value.lists} 
              defaultValue={data.valueId} 
              additionalOption={undefined}
              startValueId={src.listId}
              textCurrnt={current}
            />
          </div>
        </div>
      );
    }
  }

  // CARDS
  if (data.key === 'cards') {
    const buttonLabel = 'Позиция';
    const { boardId, listId, positionCard, numberCards } = data;

    const isThisCardInThisList = src.boardId === boardId && src.listId === listId;
    const optionsArray = (new Array(numberCards)).fill(1).map((ae,i)=>i + 1);
      
    if (!isThisCardInThisList) {
      optionsArray.push(numberCards + 1);
    }    

    return (
      <div className={cn(styles.buttonSelection, className)} {...props}>
        <div className={cn(styles.buttonLink)}>
          <span className={styles.label}>{buttonLabel}</span>
          <span className={styles.value}>{positionCard}</span>

          <select className={styles.selectBoard} value={positionCard} onChange={(): void => {}}>
            {optionsArray.map((v) => (
              <option key={v} value={v}>
                {v} {v === positionCard && isThisCardInThisList && current}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return <div />;
};
