import React from 'react';
import './list.scss';
import Card from '../Card/Card';
import { IList } from '../../../../common/interfaces/Interfaces';

export default function List({ title, cards }: IList): JSX.Element {
  const listCards = cards
    .map((card: { id: number; title: string }) => (
      <li key={card.id} className="lists-element">
        <Card title={card.title} />
      </li>
    ))
    .concat([
      <li className="lists-element lists-btn" key="btn">
        <button>
          <span>+</span> Добавить карточку
        </button>
      </li>,
    ]);
  return (
    <div className="lists">
      <div className="lists-title">{title}</div>
      <ul className="lists-list">{listCards}</ul>
      <br />
    </div>
  );
}
