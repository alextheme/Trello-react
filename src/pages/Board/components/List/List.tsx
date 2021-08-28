import React from 'react';
import './list.scss';
import Card from '../Card/Card';
import { IList } from '../../../../common/interfaces/Interfaces';

const List = ({ title, cards }: IList): JSX.Element => {
  const listCards = cards
    .map((card: { id: number; title: string }) => (
      <li key={card.id} className="lists__element">
        <Card title={card.title} />
      </li>
    ))
    .concat([
      <li className="lists__element lists__btn" key="btn">
        <button>
          <span>+</span> Добавить карточку
        </button>
      </li>,
    ]);
  return (
    <div className="lists">
      <div className="lists__title">{title}</div>
      <ul className="lists__list">{listCards}</ul>
      <br />
    </div>
  );
};

export default List;
