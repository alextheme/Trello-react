/* eslint-disable no-restricted-syntax */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
  deleteList,
  getBoard,
  renameTitleBoard,
  renameTitleCard,
  deleteCard,
  movedLists,
  movedCards,
} from '../../store/modules/board/actions';
import AddList from './components/List/AddList';
import EditableTitleBoard from './EditableTitleBoard';
import List from './components/List/List';
import './board.scss';
import { IBoard } from '../../common/interfaces/Interfaces';

interface TypeProps extends RouteComponentProps {
  boardId: string;
  board: IBoard;
  getBoard: (boardId: string) => Promise<void>;
}

interface TypeState {
  inputTitleBoard: string;
  settingsEditCard: {
    x: string;
    y: string;
    boardId: string;
    cardId: string;
    title: string;
    saveTitle: any;
    deleteCard: any;
    closeEditor: any;
    closeBGEditor: any;
  } | null;
  openEditCard: boolean;
  heightListContainer: number;
}
class Board extends React.Component<TypeProps, TypeState> {
  constructor(props: TypeProps) {
    super(props);
    this.state = {
      inputTitleBoard: '',
      openEditCard: false,
      settingsEditCard: {
        x: '',
        y: '',
        boardId: '',
        cardId: '',
        title: '',
        saveTitle: null,
        deleteCard: null,
        closeEditor: null,
        closeBGEditor: null,
      },
      heightListContainer: 0,
    };
  }

  // eslint-disable-next-line react/sort-comp
  updateBoard = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { getBoard, match } = this.props;
    const { params } = match; // @ts-ignore
    const { boardId } = params;
    await getBoard(boardId);
  };

  async componentDidMount(): Promise<void> {
    await this.updateBoard();
    const { board } = this.props;
    if (board) {
      const heightWindow = window.innerHeight;
      const topElement = document.querySelector('.list-container')?.getBoundingClientRect().top;
      const heightListContainer = heightWindow - (topElement || 0);
      this.setState((state) => ({ ...state, heightListContainer }));
    }
  }

  shouldComponentUpdate(nextProps: Readonly<TypeProps>): boolean {
    const { inputTitleBoard } = this.state;
    return nextProps.board.title !== inputTitleBoard;
  }

  /** Rename Title Board */
  handleRenameBoard = async (boardId: number, value: string): Promise<void> => {
    await renameTitleBoard(boardId, value);
    await this.updateBoard();
  };

  /** Delete List */
  handlerDeleteList = async (boardId: number, listId: number): Promise<void> => {
    await deleteList(boardId, listId);
    await this.updateBoard();
  };

  /** Delete Card */
  onClickDeleteCard = async (e: any): Promise<void> => {
    const idCard =
      e.target.dataset.idCard ||
      e.target.parentElement.dataset.idCard ||
      e.target.parentElement.parentElement.dataset.idCard ||
      e.target.parentElement.parentElement.parentElement.dataset.idCard;
    const { match } = this.props;
    const { params } = match; // @ts-ignore
    const { boardId } = params;
    await deleteCard(boardId, idCard);
    this.updateBoard();
    this.onClickClosedEditCard();
  };

  /** Closed Edit Card window */
  onClickClosedEditCard = (): void => {
    this.setState((state) => ({ ...state, openEditCard: false }));
  };

  /** Save Title Card, ajax */
  saveTitleCard = async (titleCard: string, idCard: string): Promise<void> => {
    await renameTitleCard('123', idCard, { title: titleCard, list_id: `${'id'}` });
    this.updateBoard();
    this.onClickClosedEditCard();
  };

  /** Implementation of closing the card editing window */
  handlerClickClosedEditCard = (e: any): void => {
    let canBeClosed = true;
    ['.editor-card__title', '.editor-card__buttons'].forEach((cls) => {
      if (e.target.closest(cls)) canBeClosed = false;
    });
    if (canBeClosed) this.onClickClosedEditCard();
  };

  /** Opening the card editing window */
  onClickOpenEditCard = ({ ...params }: any): void => {
    const { openedEditCard, x, y, boardId, cardId, title } = params;
    const settingsEditCard = {
      x,
      y,
      boardId,
      cardId,
      title,
      saveTitle: this.saveTitleCard,
      deleteCard: this.onClickDeleteCard,
      closeEditor: this.onClickClosedEditCard,
      closeBGEditor: this.handlerClickClosedEditCard,
    };

    this.setState((state) => ({ ...state, openEditCard: openedEditCard, settingsEditCard }));
  };

  /** Drag and drop implementation functions  */
  /** Start */
  onDragStart = () => {};

  /** End */
  onDragEnd = async (result: any): Promise<Promise<void>> => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (result.type === 'column') {
      // return;
    }

    const { lists } = this.props.board;

    // Move Cards
    // get source & destination lists
    const listSourse = lists[source.droppableId];
    const listDestination = lists[destination.droppableId];

    const resultOrderCards: { id: number; position: number; list_id: number }[] = [];
    // [
    //   {id: 1, position: 3, list_id: 2},
    //   {id: 2, position: 1, list_id: 1}
    // ]

    // If source & destination is different
    if (listSourse !== listDestination) {
      const cardsSource = Object.entries(listSourse.cards)
        .sort((a, b) => a[1].position - b[1].position)
        .map(([, card]) => card);
      const moveCard = cardsSource.splice(source.index, 1)[0];

      const cardsDestination = Object.entries(listDestination.cards)
        .sort((a, b) => a[1].position - b[1].position)
        .map(([, card]) => card);
      cardsDestination.splice(destination.index, 0, moveCard);

      cardsSource.forEach((card, index) => {
        if (card) resultOrderCards.push({ id: card.id, position: index + 1, list_id: +source.droppableId });
      });

      cardsDestination.forEach((card, index) => {
        if (card) resultOrderCards.push({ id: card.id, position: index + 1, list_id: +destination.droppableId });
      });

      // If source & destination is not different
    } else if (listSourse) {
      const cardsSource = Object.entries(listSourse.cards)
        .sort((a, b) => a[1].position - b[1].position)
        .map(([, card]) => card);
      const moveCard = cardsSource.splice(source.index, 1)[0];
      cardsSource.splice(destination.index, 0, moveCard);

      cardsSource.forEach((card, index) => {
        resultOrderCards.push({ id: card.id, position: index + 1, list_id: +source.droppableId });
      });
    }

    const { match } = this.props;
    const { params } = match; // @ts-ignore
    const { boardId } = params;
    await movedCards(boardId, resultOrderCards);
    await this.updateBoard();
    this.updateBoard();
  };

  /** Update */
  onDragUpdate = async (result: any): Promise<void> => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const { match } = this.props;
    const { params } = match; // @ts-ignore
    const { boardId } = params;
    const { lists } = this.props.board;

    // Move Columns
    if (result.type === 'column') {
      const newcardsOrder = Object.entries(lists)
        .sort((a: any, b: any) => a[1].position - b[1].position)
        .map(([, list]) => list);
      const moveList = newcardsOrder.splice(source.index, 1);
      newcardsOrder.splice(destination.index, 0, moveList[0]);

      const resultOrderList: { id: number; position: number }[] = [];
      newcardsOrder.forEach((elem, index) => {
        resultOrderList.push({ id: elem.id, position: index + 1 });
      });

      await movedLists(boardId, resultOrderList);
      await this.updateBoard();
    }
  }; // end update dnd

  // Render
  render(): JSX.Element | null {
    const { board, match } = this.props;

    if (!board) return null;

    const { params } = match; // @ts-ignore
    const { boardId } = params;
    const { title, lists } = board;

    if (!lists) return null;

    //
    return (
      <div className="board">
        <div className="board__title-container">
          <EditableTitleBoard
            key={title}
            title={title}
            listId=""
            boardId={boardId}
            renameBoard={this.handleRenameBoard}
            updateBoard={this.updateBoard}
          />
        </div>
        <p>{boardId}</p>
        <div id="board_lists_container">
          {/* DnD Context */}
          <DragDropContext onDragEnd={this.onDragEnd} onDragUpdate={this.onDragUpdate} onDragStart={this.onDragStart}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
              {(provided) => {
                /* List */
                const btn = <AddList key="btn" boardId={boardId} position={1} updateBoard={this.updateBoard} />;
                const listsRender = Object.entries(lists)
                  .sort((a: any, b: any) => a[1].position - b[1].position)
                  .map(([id, list], index) => (
                    <List key={id} boardId={boardId} list={list} index={index} updateBoard={this.updateBoard} />
                  ));

                return (
                  <div className="board_lists" ref={provided.innerRef} {...provided.droppableProps}>
                    {listsRender}
                    {btn}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any): void => ({ ...state.board });

export default connect(mapStateToProps, { getBoard })(withRouter(Board));
