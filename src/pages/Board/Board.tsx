import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IList } from '../../common/interfaces/Interfaces';
import './board.scss';
import List from './components/List/List';

type TParams = { boardId: string };

class Board extends React.Component<RouteComponentProps<TParams>, any> {
  constructor(props: RouteComponentProps<TParams>) {
    super(props);
    this.state = {
      title: 'Моя тестовая доска',
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
    const { boardId } = this.props.match.params;
    console.log(this.props.match.params.boardId);

    const { title, lists } = this.state;
    const listsCards = lists
      .map((list: IList) => (
        <li key={list.id}>
          <List id={list.id} title={list.title} cards={list.cards} />
        </li>
      ))
      .concat([
        <li className="board__add-list-btn" key="btn">
          <button>
            <span> + </span> Добавить список
          </button>
        </li>,
      ]);
    //
    //
    return (
      <div className="board">
        <h2 className="board__title">{`${title}, id: ${boardId}`}</h2>
        <div className="boards__container">
          <ul className="boards__list">{listsCards}</ul>
        </div>
      </div>
    );
  }
}

export default withRouter(Board);
