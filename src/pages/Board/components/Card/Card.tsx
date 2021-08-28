import React from 'react';
import './card.scss';

export default function Card({ title }: { title: string }): JSX.Element {
  return (
    <div className="card">
      <div className="card__title">{title}</div>
    </div>
  );
}
