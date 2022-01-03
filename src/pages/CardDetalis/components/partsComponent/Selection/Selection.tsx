/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import React from 'react';
import cn from 'classnames';
import { SelectionProps } from './Selection.props';
import styles from './Selection.module.scss';
// import ArrowIcon from './arrow.svg'; key, value, valueId

export const Selection = ({ data, children, className, ...props }: SelectionProps): JSX.Element => {
  const { startingValues } = data;
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
                  {b.title} {b.id} {startingValues.boardId === b.id ? current : ''}
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

            {Object.keys(data.value.lists).length && (
              <select className={styles.selectBoard} defaultValue={data.valueId}>
                {Object.entries(data.value.lists)
                  .sort(([, a], [, b]) => a.position - b.position)
                  .map(([, l]) => (
                    <option key={l.id} value={l.id}>
                      {l.title} {l.id} {l.position} {startingValues.listId === l.id ? current : ''}
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>
      );
    }
  }

  // CARDS
  if (data.key === 'cards') {
    const buttonLabel = 'Позиция';
    const numberCardsThisList = Object.keys(data.value.cards).length;
    // Is the card being moved in this list?
    const relocatableCardIsInThisList = Object.entries(data.value.cards).find(([, c]) => c.id === startingValues.cardId)?.[1];
    const positionExistingCard = Object.entries(data.value.cards).find(([, c]) => c.id === data.valueId)?.[1].position;
    const additionalPosition = numberCardsThisList + 1;
    const positionTitle = positionExistingCard || additionalPosition;
    
    return (
      <div className={cn(styles.buttonSelection, className)} {...props}>
        <div className={cn(styles.buttonLink)}>
          <span className={styles.label}>{buttonLabel}</span>
          <span className={styles.value}>{positionTitle}</span>

          {!!numberCardsThisList && (
            <select className={styles.selectBoard} defaultValue={data.valueId}>
              {Object.entries(data.value.cards)
                .sort(([, a], [, b]) => a.position - b.position)
                .map(([, c]) => (
                  <option key={c.id} value={c.id}>
                    {c.id} | {c.position} {c.id === startingValues.cardId ? current : ''}
                  </option>
                ))}
              {!relocatableCardIsInThisList && <option value={additionalPosition}>{additionalPosition}</option>}
            </select>
          )}
        </div>
      </div>
    );
  }

  return <div />;
};
