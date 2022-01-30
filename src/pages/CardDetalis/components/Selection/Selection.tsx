/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import cn from 'classnames';
import { SelectionProps } from './Selection.props';
import './Selection.scss';
// import ArrowIcon from './arrow.svg'; key, value, valueId

export const Selection = ({ data, children, className, ...props }: SelectionProps): JSX.Element => {
  const { src } = data;
  const current = '(текущий)';

  // BOARDS
  if (data.key === 'boards') {
    const buttonLabel = 'Доска';
    const boardTitle = data.value.boards.find((b) => b.id === data.valueId)?.title;

    return (
      <div className={cn(className, 'selection-wrapper')} {...props}>
        <div className="button">
          <span className="label">{buttonLabel}</span>
          <span className="value">{boardTitle}</span>

          {data.value.boards.length && (
            <select className="select" defaultValue={data.valueId}>
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
        <div className={cn(className, 'selection-wrapper')} {...props}>
          <div className="button">
            <span className="label">{buttonLabel}</span>
            <span className="value">{list.title}</span>
            <select className="select" value={data.valueId} onChange={(): void => {}}>
              {Object.entries(data.value.lists)
                .sort(([, a], [, b]) => a.position - b.position)
                .map(([, l]) => (
                  <option key={l.id} value={l.id}>
                    {l.title} *** {l.id} {l.id === src.listId && current}
                  </option>
                ))}
            </select>
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
    const optionsArray = new Array(numberCards).fill(1).map((ae, i) => i + 1);

    if (!isThisCardInThisList) {
      optionsArray.push(numberCards + 1);
    }

    return (
      <div className={cn(className, 'selection-wrapper')} {...props}>
        <div className="button">
          <span className="label">{buttonLabel}</span>
          <span className="value">{positionCard}</span>

          <select className="select" value={positionCard} onChange={(): void => {}}>
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
