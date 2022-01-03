import React from 'react';
import { connect } from 'react-redux';
import './home.scss';
import { Link, RouteComponentProps } from 'react-router-dom';
import { IBoardsListReducer, IBoardCover, IBoards } from '../../common/interfaces/Interfaces';
import AddBoard from './components/AddBoard/AddBoard';
import Board from './components/Board/Board';
import { getBoards } from '../../store/modules/boards/action-creators';

interface PropsType extends RouteComponentProps, IBoardsListReducer {
  boardsGet: () => Promise<void>;
}

class Home extends React.Component<PropsType> {
  componentDidMount(): void {
    this.fetchBoards();
  }

  fetchBoards = (): void => {
    const { boardsGet } = this.props;
    boardsGet();
  };

  render(): JSX.Element {
    const {
      match: { url },
      boardsList,
    } = this.props;

    return (
      <div className="home-boards">
        <div className="home-boards__wrapper">
          <ul className="home-boards__list">
            {boardsList &&
              boardsList.map((board: IBoardCover) => (
                <li className="home-boards__list-element" key={board.id}>
                  <Link to={`${url}board/${board.id}`}>
                    <Board boardId={board.id} title={board.title} />
                  </Link>
                </li>
              ))}
            {/* Add a button for create a new board */}
            <li className="home-boards__list-element btn" key="btn">
              <AddBoard />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default connect((state: IBoards) => ({ ...state.boards }), { boardsGet: getBoards })(Home);
