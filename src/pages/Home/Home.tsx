import React from 'react';
import { connect } from 'react-redux';
import './home.scss';
import { RouteComponentProps } from 'react-router-dom';
import { IData as IBoard } from '../../common/interfaces/Interfaces';
// import AddBoard from './components/Board/AddBoard';
// import Board from './components/Board/Board';
import { getBoards } from '../../store/modules/boards/actions';

interface PropsType extends RouteComponentProps {
  boards: IBoard[];
  getBoards: () => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type StateType = {};

class Home extends React.Component<PropsType, StateType> {
  // @ts-ignore
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }

  async componentDidMount(): Promise<void> {
    await this.props.getBoards();
  }

  render(): JSX.Element {
    // const { url } = this.props.match;

    // const boardslist = this.state.boards
    //   .map((board: IData) => (
    //     <li className="home-boards__list-element" key={board.id}>
    //       <Link to={`${url}board/${board.id}`}>
    //         <Board title={board.title} />
    //       </Link>
    //     </li>
    //   ))
    //   .concat([
    //     <li className="home-boards__list-element btn" key="btn">
    //       <AddBoard onClick={this.handleAddNewBoard} />
    //     </li>,
    //   ]);

    return (
      <div>{JSON.stringify(this.props.boards)}</div>
      // <div className="home-boards">
      //   <div className="home-boards__wrapper">
      //     <ul className="home-boards__list">{boardslist}</ul>
      //   </div>
      // </div>
    );
  }
}

const mapStateToProps = (state: any): void => ({
  ...state.boards,
});

export default connect(mapStateToProps, { getBoards })(Home);
