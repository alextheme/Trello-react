import React from 'react';
import './card.scss';

const Card = ({ title }: { title: string }): JSX.Element => (
  <div className="card">
    <span className="card__title">{title}</span>
  </div>
);

export default Card;
