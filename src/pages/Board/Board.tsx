import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { IList, IBoard } from '../../common/interfaces/Interfaces';
import './board.scss';
import List from './components/List/List';
import { getBoard } from '../../store/modules/board/actions';
import AddList from './components/List/AddList/AddList';

interface TypeProps extends RouteComponentProps {
  boardId: string;
  board: IBoard;
  getBoard: (boardId: string) => Promise<void>;
}

class Board extends React.Component<TypeProps, any> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: TypeProps) {
    super(props);
    this.state = {
      title: 'Моя тестовая доска',
      users: [{ id: 1, username: 'dff' }],
      lists: [
        {
          id: 1,
          title: 'Планы',
          cards: [
            { id: 1, title: 'помыть кота', description: '1descr', users: [1] },
            { id: 2, title: 'приготовить суп', description: '2descr', users: [1] },
            { id: 3, title: 'сходить в магазин', description: '3descr', users: [1] },
          ],
          position: 1,
        },
        {
          id: 2,
          title: 'В процессе',
          cards: [{ id: 4, title: 'посмотреть сериал', description: '4descr', users: [1] }],
          position: 2,
        },
        {
          id: 3,
          title: 'Сделано',
          cards: [
            { id: 5, title: 'сделать домашку', description: '5descr', users: [1] },
            { id: 6, title: 'погулять с собакой', description: '6descr', users: [1] },
          ],
          position: 3,
        },
      ],
    };
  }

  // eslint-disable-next-line react/sort-comp
  updateBoard = async (): Promise<void> => {
    // @ts-ignore
    const { boardId }: { boardId: string } = this.props.match.params;
    await this.props.getBoard(boardId);
  };

  componentDidMount(): void {
    this.updateBoard();
  }

  render(): JSX.Element {
    // @ts-ignore
    const { boardId } = this.props.match.params as number;
    // @ts-ignore
    // const { title, users, lists } = this.state;
    const { title, lists } = this.props.board;
    const list1 = Object.keys(lists).map((k: string) => lists[k]);

    let listsCards;
    const button = [
      <li className="board__add-list-btn" key="btn">
        <AddList boardId={boardId} position={list1.length + 1} updateBoard={this.props.getBoard} />
      </li>,
    ];

    if (list1.length) {
      listsCards = list1
        .sort((a, b) => a.position - b.position)
        .map((list: IList) => (
          <li key={list.id}>
            <List
              boardId={boardId}
              listId={list.id}
              listTitle={list.title}
              listCards={list.cards}
              update={this.updateBoard}
            />
          </li>
        ))
        .concat(button);
    } else {
      listsCards = button;
    }

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

const mapStateToProps = (state: any): void => ({ ...state.board });
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const mapDispatchToProps = () => ({
  getBoard,
});

export default connect(mapStateToProps, mapDispatchToProps())(withRouter(Board));
