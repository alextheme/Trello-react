import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { IList, IBoard } from '../../common/interfaces/Interfaces';
import './board.scss';
import List from './components/List/List';
import { getBoard, renameTitleBoard } from '../../store/modules/board/actions';
import AddList from './components/AddList/AddList';
import { getHtmlElementByID, getHtmlElementQS, setFocusToElement } from '../../common/scripts/commonFunctions';

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
  }

  // eslint-disable-next-line react/sort-comp
  updateBoard = async (): Promise<void> => {
    // @ts-ignore
    const { boardId }: { boardId: string } = this.props.match.params;
    await this.props.getBoard(boardId);
  };

  async componentDidMount(): Promise<void> {
    this.updateBoard();
    // @ts-ignore
    const { title } = this.props.board;
    this.setState((state) => ({
      ...state,
      inputTitleBoard: title,
    }));

    document.addEventListener('keypress', (e) => {
      const inputField = document.getElementById('board__input-edit-title');
      if (inputField === document.activeElement && e.key === 'Enter') {
        // @ts-ignore
        this.handleRenameBoard(e.path[0].value);
      }
    });
  }

  handleRenameBoard = async (oldName: string): Promise<void> => {
    const titleBoard = getHtmlElementQS('.board__title')?.innerText;
    if (oldName === titleBoard) {
      this.setState((state: any) => ({ ...state, openInputEditTitle: false }));
      return;
    }

    // @ts-ignore
    const { boardId } = this.props.match.params as number;
    await renameTitleBoard(boardId, this.state.inputTitleBoard);
    await this.updateBoard();
    this.setState((state: any) => ({ ...state, inputTitleBoard: '', openInputEditTitle: false }));
  };

  /**
   * Focus out
   * @param e e
   */
  handleTitleBoardInputOnBlur = async (e: any): Promise<void> => {
    await this.handleRenameBoard(e.target.value);
  };

  handleTitleBoardOnClick = (e: any): void => {
    const htmlElementInput = getHtmlElementByID('board__input-edit-title');
    // @ts-ignore
    htmlElementInput.style.width = `${e.target.clientWidth}px`;
    setFocusToElement('board__input-edit-title');
    this.setState((state) => ({ ...state, inputTitleBoard: e.target.innerText, openInputEditTitle: true }));
  };

  /**
   * Print new name board
   * @param e ...
   */
  handleTitleBoardInputEdit = (e: any): void => {
    const inputElem = getHtmlElementByID('board__input-edit-title');
    if (inputElem) inputElem.style.width = `${e.target.value.length * 12}px`;

    this.setState((state) => ({ ...state, inputTitleBoard: e.target.value }));
  };

  render(): JSX.Element {
    // @ts-ignore
    const { boardId } = this.props.match.params as number;
    // @ts-ignore
    const { title, lists } = this.props.board;
    const list1 = Object.keys(lists).map((k: string) => lists[k]);

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
            <List boardId={boardId} listId={list.id} listTitle={list.title} listCards={list.cards} />
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
          <h2
            className="board__title"
            onClick={this.handleTitleBoardOnClick}
            style={{ display: this.state.openInputEditTitle ? 'none' : 'block' }}
          >
            {title}
          </h2>
          <input
            id="board__input-edit-title"
            type="text"
            onInput={this.handleTitleBoardInputEdit}
            onBlur={this.handleTitleBoardInputOnBlur}
            defaultValue={this.state.inputTitleBoard}
            style={{ display: this.state.openInputEditTitle ? 'block' : 'none' }}
            autoComplete="off"
          />
          <p style={{ margin: '0 0 0 20px' }}>({boardId})</p>
        </div>

        <div className="boards__container">
          <ul className="boards__list">{listsCards}</ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any): void => ({ ...state.board });

export default connect(mapStateToProps, { getBoard })(withRouter(Board));
