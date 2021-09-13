import React from 'react';
import './list.scss';
import Card from '../Card/Card';
import AddCard from '../Card/AddCard/AddCard';
import { deleteList } from '../../../../store/modules/board/actions';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function List({ boardId, listId, listTitle, listCards, update }): JSX.Element {
  const handleDeleteList = (): void => {
    deleteList(boardId, listId);
    update();
  };

  const button = [
    <li className="lists-element" key="btn">
      <AddCard />
    </li>,
  ];
  let listCardsRender;
  if (listCards.length) {
    listCardsRender = listCards
      .map((card: { id: number; title: string }) => (
        <li key={card.id} className="lists-element">
          <Card title={card.title} />
        </li>
      ))
      .concat(button);
  } else {
    listCardsRender = button;
  }

  //
  return (
    <div className="lists">
      <div className="lists-header">
        <h2 className="lists-title">{listTitle}</h2>
        <span className="lists__delete-btn" onClick={handleDeleteList}>
          ...
        </span>
      </div>
      <ul className="lists-list">{listCardsRender}</ul>
      <br />
    </div>
  );
}
