import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { IList, IBoard } from '../../common/interfaces/Interfaces';
import './board.scss';
import List from './components/List/List';
import { getBoard } from '../../store/modules/board/actions';
import AddList from './components/AddList/AddList';
import EditableTitle from './components/EditableTitle/EditableTitle';

interface TypeProps extends RouteComponentProps {
  boardId: string;
  board: IBoard;
  getBoard: (boardId: string) => Promise<void>;
}

interface TypeState {
  openInputEditTitle: boolean;
  inputTitleBoard: string;
}

class Board extends React.Component<TypeProps, TypeState> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: TypeProps) {
    super(props);
    this.state = {
      openInputEditTitle: false,
      inputTitleBoard: '',
    };

    this.updateBoard();
  }

  // eslint-disable-next-line react/sort-comp
  updateBoard = async (): Promise<void> => {
    // @ts-ignore
    const { boardId }: { boardId: string } = this.props.match.params;
    await this.props.getBoard(boardId);
  };

  async componentDidMount(): Promise<void> {
    document.addEventListener('keypress', (e) => {
      const inputField = document.getElementById('board__input-edit-title');
      if (inputField === document.activeElement && e.key === 'Enter') {
        // @ts-ignore
        this.handleRenameBoard(e.path[0].value);
      }
    });
  }

  shouldComponentUpdate(nextProps: Readonly<TypeProps>, nextState: Readonly<TypeState>, nextContext: any): boolean {
    return nextProps.board.title !== this.state.inputTitleBoard;
  }

  render(): JSX.Element {
    // @ts-ignore
    const { boardId } = this.props.match.params as number;
    const { title, lists } = this.props.board;
    const list1 = Object.keys(lists).map((k: any) => lists[k]);

    let listsCards;
    const button = [
      <li className="board__add-list-btn" key="btn">
        <AddList boardId={boardId} position={list1.length + 1} />
      </li>,
    ];

    if (list1.length) {
      listsCards = list1
        .sort((a, b) => a.position - b.position)
        .map((list: IList) => (
          <li key={list.id}>
            <List boardId={boardId} {...list} />
          </li>
        ))
        .concat(button);
    } else {
      listsCards = button;
    }

    //
    return (
      <div className="board">
        <div className="board__title-container">
          <EditableTitle
            key={title}
            title={title}
            listId=""
            boardId={boardId}
            updateBoard={null}
            titleClassName="board__title"
            inputClassName=""
            inputId="board__input-edit-title"
          />
        </div>
        <p>{boardId}</p>
        <div className="boards__container">
          <ul className="boards__list">{listsCards}</ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any): void => ({ ...state.board });

export default connect(mapStateToProps, { getBoard })(withRouter(Board));
