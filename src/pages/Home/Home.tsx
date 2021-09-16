import React from 'react';
import { connect } from 'react-redux';
import './home.scss';
import { Link, RouteComponentProps } from 'react-router-dom';
import { IData as IBoard } from '../../common/interfaces/Interfaces';
import AddBoard from './components/AddBoard/AddBoard';
import Board from './components/Board/Board';
import { getBoards } from '../../store/modules/boards/actions';

interface PropsType extends RouteComponentProps {
  boards: IBoard[];
  getBoards: () => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type StateType = {};

class Home extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }

  async componentDidMount(): Promise<void> {
    await this.props.getBoards();
  }

  fetchBoards = async (): Promise<void> => {
    await this.props.getBoards();
  };

  render(): JSX.Element {
    const { url } = this.props.match;

    // @ts-ignore
    const { boards } = this.props.boards;
    let boardsListBackend: JSX.Element[] = [];

    if (typeof boards === 'object') {
      // Form a list of boards and add a button to create a new board
      if (boards.length) {
        boardsListBackend = boards.map((board: IBoard) => (
          <li className="home-boards__list-element" key={board.id}>
            <Link to={`${url}board/${board.id}`}>
              <Board boardId={board.id} title={board.title} />
            </Link>
          </li>
        ));
      }
    }
    // Add a button to create a new board
    const boardsList = boardsListBackend.concat([
      <li className="home-boards__list-element btn" key="btn">
        <AddBoard />
      </li>,
    ]);

    return (
      <div className="home-boards">
        <div className="home-boards__wrapper">
          <ul className="home-boards__list">{boardsList}</ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any): void => ({ ...state.boards });

export default connect(mapStateToProps, { getBoards })(Home);
