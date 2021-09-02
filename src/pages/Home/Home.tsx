import React from 'react';
import './home.scss';
import { Link, RouteComponentProps } from 'react-router-dom';
import { IData } from '../../common/interfaces/Interfaces';
import AddBoard from './components/Board/AddBoard';
import Board from './components/Board/Board';

type TypeState = {
  boards: { id: number; title: string }[];
};
class Home extends React.Component<RouteComponentProps, TypeState> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      boards: [
        { id: 1, title: 'покупки' },
        { id: 2, title: 'подготовка к свадьбе' },
        { id: 3, title: 'разработка интернет-магазина' },
        { id: 4, title: 'курс по продвижению в соцсетях' },
        { id: 5, title: 'курс фронтэнда' },
      ],
    };
  }

  handleAddNewBoard = (nameBoard: string): void => {
    const { ...a } = this.state;
    const { boards } = this.state;
    const listId = boards.map((elem: IData) => elem.id);
    const newId = Math.max(...listId) + 1;
    const newBoard = { id: newId, title: nameBoard };
    this.setState({ ...a, boards: [...a.boards, newBoard] });
  };

  render(): JSX.Element {
    const { url } = this.props.match;

    const boardslist = this.state.boards
      .map((board: IData) => (
        <li className="home-boards__list-element" key={board.id}>
          <Link to={`${url}board/${board.id}`}>
            <Board title={board.title} />
          </Link>
        </li>
      ))
      .concat([
        <li className="home-boards__list-element btn" key="btn">
          <AddBoard onClick={this.handleAddNewBoard} />
        </li>,
      ]);

    return (
      <div className="home-boards">
        <div className="home-boards__wrapper">
          <ul className="home-boards__list">{boardslist}</ul>
        </div>
      </div>
    );
  }
}

export default Home;
