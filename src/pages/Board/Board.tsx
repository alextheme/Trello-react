/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
// import { useParams } from 'react-router-dom';
import { IList } from '../../common/interfaces/Interfaces';
import './board.scss';
import List from './components/List/List';

// eslint-disable-next-line react/prefer-stateless-function
class Board extends React.Component<any, any> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(props: any) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      title: 'Моя тестовая доска',
      // eslint-disable-next-line react/no-unused-state
      lists: [
        {
          id: 1,
          title: 'Планы',
          cards: [
            { id: 1, title: 'помыть кота' },
            { id: 2, title: 'приготовить суп' },
            { id: 3, title: 'сходить в магазин' },
          ],
        },
        { id: 2, title: 'В процессе', cards: [{ id: 4, title: 'посмотреть сериал' }] },
        {
          id: 3,
          title: 'Сделано',
          cards: [
            { id: 5, title: 'сделать домашку' },
            { id: 6, title: 'погулять с собакой' },
          ],
        },
      ],
    };
  }

  render(): JSX.Element {
    const { title, lists } = this.state;
    const listsCards = lists
      .map((list: IList) => (
        <li key={list.id}>
          <List id={list.id} title={list.title} cards={list.cards} />
        </li>
      ))
      .concat([
        <li className="board-add-list-btn" key="btn">
          <button>
            <span>+</span> Добавить список
          </button>
        </li>,
      ]);
    return (
      <div className="board">
        <h2 className="board__title">{title}</h2>
        <div className="boards-wrapper">
          <div className="boards-container">
            <ul className="boards-list">{listsCards}</ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Board;
