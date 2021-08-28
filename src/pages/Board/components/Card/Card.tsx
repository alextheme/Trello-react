import React from 'react';
import './card.scss';

const Card = ({ title }: { title: string }): JSX.Element => {
  return (
    <div className="card">
      <div className="card__title">{title}</div>
    </div>
  );
};

export default Card;
