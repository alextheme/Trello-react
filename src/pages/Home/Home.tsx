/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment, @typescript-eslint/ban-ts-comment */
import React from 'react';
import { connect } from 'react-redux';
import './home.scss';
import { Link, RouteComponentProps } from 'react-router-dom';
import { IBoardTlt } from '../../common/interfaces/Interfaces';
import AddBoard from './components/AddBoard/AddBoard';
import Board from './components/Board/Board';
import { getBoards } from '../../store/modules/boards/actions';

interface PropsType extends RouteComponentProps {
  boards: { boards: IBoardTlt[] };
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

  render(): JSX.Element | null {
    const { url } = this.props.match;

    // console.log(this.props.boards);
    // if (!this.props.boards) return <div>HELLO</div>;

    const { boards } = this.props.boards;

    let boardsListBackend: JSX.Element[] = [];

    if (typeof boards === 'object') {
      // Form a list of boards and add a button to create a new board
      if (boards.length) {
        boardsListBackend = boards.map((board: IBoardTlt) => (
          <li className="home-boards__list-element" key={board.id}>
            <Link to={`${url}board/${board.id}`}>
              <Board boardId={board.id} title={board.title} />
            </Link>
          </li>
        ));
      }
    }
    // Add a button to create a new board
    const AddBoardButton = (
      <li className="home-boards__list-element btn" key="btn">
        <AddBoard />
      </li>
    );

    return (
      <div className="home-boards">
        <div className="home-boards__wrapper">
          <ul className="home-boards__list">
            {boardsListBackend}
            {AddBoardButton}
          </ul>
        </div>
      </div>
    );
  }
}

// @ts-ignore
const mapStateToProps = (state): StoreStateType => ({ ...state.boards });

export default connect(mapStateToProps, { getBoards })(Home);
