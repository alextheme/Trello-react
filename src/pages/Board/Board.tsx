import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './board.scss';
import { IBoardContent, IListContent, IMatch } from '../../common/interfaces/Interfaces';
import { getBoard, movedCards, movedLists } from '../../store/modules/board/action-creators';
import List from './components/List/List';
import EditableTitleBoard from './components/EditableTitleBoard/EditableTitleBoard';
import CardDetalis from '../CardDetalis/CardDetalis';
import { BoardContext } from './boardContext';
import { movingCardsBetweenDifferentList, movingCardsInOneList } from './functionBoard/functionsForWorkingWithCards';
import { movingList } from './functionBoard/functionsForWorkingWithLists';

interface IPropsFromState {
  boardContent: IBoardContent;
}

interface IBoardProps extends RouteComponentProps, IPropsFromState {
  cardsMoved: (boardId: number, data: { id: number; position: number; list_id: number }[]) => Promise<void>;
  listsMoved: (boardId: number, data: { id: number; position: number }[]) => Promise<void>;
  updBoard: (boardId: string) => Promise<void>;
}

interface IBoardState {
  // mount: boolean;
  processMovingList: boolean;
  processMovingCard: boolean;
  heightContainer: number;
  shiftForCard: { x: number; y: number };
  shiftForList: { x: number; y: number };
  cardActive: HTMLElement | null;
  listActive: HTMLElement | null;
  placeholder: HTMLElement | null;
  dataLists: { [id: number]: IListContent } | null;
  doAddPlaceholder: boolean;
  indexNewPositionActiveElement: number;
  movingCard: { indexSourceList: number; indexCard: number } | null;
  movingListId: number;
  openDetailEditCard: boolean;
  dataDetailEditCard: { cardId: number };
}

class Board extends React.Component<IBoardProps, IBoardState> {
  mount = false;

  constructor(props: IBoardProps) {
    super(props);
    this.state = {
      // mount: true,
      processMovingList: false,
      processMovingCard: false,
      heightContainer: 0,
      shiftForCard: { x: 0, y: 0 },
      shiftForList: { x: 0, y: 0 },
      cardActive: null,
      listActive: null,
      placeholder: null,
      dataLists: null,
      doAddPlaceholder: false,
      indexNewPositionActiveElement: 0,
      movingCard: null,
      movingListId: -1,
      openDetailEditCard: false,
      dataDetailEditCard: { cardId: -1 },
    };
    this.onMouseDownForCard = this.onMouseDownForCard.bind(this);
  }

  async componentDidMount(): Promise<void> {
    this.mount = true;
    // this.setState({ mount: true });
    await this.updateBoard();

    // Set Height Container
    const heightWindow = window.innerHeight;
    const containerTop = document.getElementById('dnd_container')?.getBoundingClientRect().top;
    const heightContainer = heightWindow - (containerTop || 0);
    this.setState((state) => ({ ...state, heightContainer }));

    // Show Detalis Card for PAGE REFRESH
    const { match } = this.props;
    const { params, path } = match as IMatch;
    const cardDetalisShow = path.slice(0, 4) === '/b/:';

    if (cardDetalisShow) {
      const { cardId } = params;
      this.showDetalisCard(+cardId);
    }

    /** close the window with details on the card when pressing the ESCAPE key */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    document.addEventListener('keyup', (event: any) => {
      const { key, keyCode } = event;
      const { openDetailEditCard } = this.state;
      if (openDetailEditCard && key === 'Escape' && keyCode === 27) {
        this.closeDetalisCard();
      }
    });

    // Off Move Effect for List || Card
    document.addEventListener('mouseup', () => {
      const { cardActive, listActive } = this.state;
      if (cardActive) {
        document.removeEventListener('mousemove', this.moveCard);
        this.mouseUpForCard();
      }
      if (listActive) {
        document.removeEventListener('mousemove', this.moveList);
        this.mouseUpForList();
      }
    });
  }

  componentWillUnmount(): void {
    this.mount = false;
    // this.setState({ mount: false });
  }

  updateBoard = async (): Promise<void> => {
    if (!this.mount) return;

    const { updBoard, match } = this.props;
    const { params } = match as IMatch;
    const { boardId } = params;

    await updBoard(boardId);
    const { boardContent } = this.props;

    if (!boardContent) return;
    const { lists } = boardContent;

    if (!lists) return;
    this.setState((state) => ({ ...state, dataLists: lists }));
  };

  /** CARD
   *
   *
   * Mouse press on CARD element
   * */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMouseDownForCard = (event: any): void => {
    event.preventDefault();

    const { clientX, clientY, currentTarget } = event;
    currentTarget.ondragstart = (): boolean => false;

    const shiftX = clientX - currentTarget.getBoundingClientRect().left;
    const shiftY = clientY - currentTarget.getBoundingClientRect().top;

    const placeholder = document.createElement('A');
    placeholder.classList.add('card_item');
    placeholder.classList.add('placeholder');

    this.setState({
      movingCard: {
        indexSourceList: +currentTarget.parentElement?.getAttribute('data-list-id'),
        indexCard: +currentTarget.getAttribute('data-card-id'),
      },
      shiftForCard: { x: shiftX, y: shiftY },
      cardActive: currentTarget,
      placeholder,
      doAddPlaceholder: true,
    });

    document.addEventListener('mousemove', this.moveCard);
  };

  /** Move CARD
   *
   * */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moveCard = (event: any): void => {
    this.setState((state) => ({ ...state, processMovingCard: true }));

    const { shiftForCard, cardActive, placeholder } = this.state;
    if (!cardActive || !placeholder) return;

    const { pageX, pageY, clientX, clientY } = event;

    const { clientWidth, clientHeight } = cardActive;

    cardActive.style.width = `${clientWidth}px`;
    cardActive.style.height = `${clientHeight}px`;
    cardActive.style.left = `${pageX - shiftForCard.x}px`;
    cardActive.style.top = `${pageY - shiftForCard.y}px`;
    cardActive.classList.add('card_move');

    placeholder.style.width = `${clientWidth}px`;
    placeholder.style.height = `${clientHeight}px`;

    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.doAddPlaceholder) {
      cardActive.parentElement?.insertBefore(placeholder, cardActive);
      this.setState({ doAddPlaceholder: false });
    }

    /* The element under the arm during movement */
    cardActive.style.display = 'none';
    const elemBelowColumn = document.elementFromPoint(clientX, clientY)?.closest('.list_wrapper');
    const elemBelowListContent = elemBelowColumn?.getElementsByClassName('list_content')[0];
    const elemBelowCard = document.elementFromPoint(clientX, clientY)?.closest('.card_item');
    cardActive.style.display = 'block';

    /** Logic move Card
     *
     */
    const getIndexPositionPlaceholder = (htmlCollection: HTMLCollection): void => {
      const collection: HTMLElement[] = [];
      [].forEach.call(htmlCollection, (elem: HTMLElement) => {
        if (!elem.classList.contains('card_move')) {
          collection.push(elem);
        }
      });

      for (let i = 0; i < collection.length; i++) {
        if (collection[i].classList.contains('placeholder')) {
          this.setState({ indexNewPositionActiveElement: i });
        }
      }
    };

    if (elemBelowColumn && elemBelowListContent) {
      const { top, bottom } = elemBelowListContent.getBoundingClientRect();
      if (pageY < top) {
        elemBelowListContent.insertBefore(placeholder, elemBelowListContent.firstChild);
        getIndexPositionPlaceholder(elemBelowListContent.children);
      }

      if (pageY > bottom) {
        elemBelowListContent.appendChild(placeholder);
        getIndexPositionPlaceholder(elemBelowListContent.children);
      }

      if (pageY > top && pageY < bottom) {
        if (!elemBelowCard) return;
        const item = elemBelowCard;
        if (!item) return;
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const { top, bottom } = elemBelowCard.getBoundingClientRect();
        if (pageY < top + (bottom - top) / 2) {
          elemBelowListContent.insertBefore(placeholder, item);
          getIndexPositionPlaceholder(elemBelowListContent.children);
        } else {
          elemBelowListContent.insertBefore(placeholder, item.nextSibling);
          getIndexPositionPlaceholder(elemBelowListContent.children);
        }
      }
    }
  };

  /** Mouse UP for CARD
   *
   * */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mouseUpForCard = (): void => {
    const { cardActive, placeholder, dataLists, movingCard, indexNewPositionActiveElement: newPosition } = this.state;
    if (!cardActive || !placeholder || !dataLists || !movingCard) return;

    cardActive.classList.remove('card_move');
    cardActive.style.top = '0';
    cardActive.style.left = '0';
    cardActive.style.width = 'auto';
    cardActive.style.height = 'auto';

    const { indexSourceList, indexCard: idCard } = movingCard;

    if (!placeholder.parentElement) return;

    const parent = placeholder.parentElement;
    const indexDestintaionList = parent.getAttribute('data-list-id');

    if (!indexDestintaionList) return;

    const indexDestList = +indexDestintaionList;

    if (!indexDestList) return;

    /**
     * Moving in one list
     */
    let newCardPosition: { id: number; position: number; list_id: number }[] = [];

    if (indexSourceList === +indexDestintaionList) {
      const data = movingCardsInOneList({ idCard, indexSourceList, newPosition, dataLists });
      newCardPosition = data.newCardPosition;
      const { sourceList: list, sourceCards: cards } = data.dataForState;

      /* Set State */
      this.setState((state) => ({
        ...state,
        dataLists: {
          ...state.dataLists,
          [list.id]: { ...list, cards },
        },
      }));

      /**
       * Moving between different lists
       */
    } else {
      /* source list cards */
      const data = movingCardsBetweenDifferentList({
        idCard,
        indexSourceList,
        indexDestintaionList: +indexDestintaionList,
        newPosition,
        dataLists,
      });

      newCardPosition = data.newCardPosition;
      const { sourceList, sourceCards, destinationList, destinationCards } = data.dataForState;

      /* Set State */
      this.setState((state) => ({
        ...state,
        placeholder: null,
        dataLists: {
          ...state.dataLists,
          [sourceList.id]: { ...sourceList, cards: sourceCards },
          [+indexDestintaionList]: { ...destinationList, cards: destinationCards },
        },
      }));
    }

    placeholder.parentNode?.removeChild(placeholder);

    /* Backend */
    const { match, cardsMoved } = this.props;
    const { params } = match as IMatch;
    const { boardId } = params;
    cardsMoved(+boardId, newCardPosition);
  };

  /** LIST
   *
   *
   * Mouse press on LIST element
   * */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMouseDownForList = (event: any): void => {
    const { clientX, clientY, target, currentTarget } = event;
    // Move only by grabbing the head of the element
    const dragElement = currentTarget.querySelector('.list_header');
    const clickElement = target.closest('.list_header');
    if (clickElement !== dragElement) return;
    // Move if there is no focus in the input field
    const textAreaElem = currentTarget.querySelector('.editable-list-textarea');
    if (textAreaElem.classList.contains('focus')) return;

    const shiftX = clientX - currentTarget.getBoundingClientRect().left;
    const shiftY = clientY - currentTarget.getBoundingClientRect().top;

    const placeholder = document.createElement('DIV');
    placeholder.classList.add('list_wrapper');
    placeholder.classList.add('placeholder_list');

    this.setState({
      shiftForList: { x: shiftX, y: shiftY },
      listActive: currentTarget,
      placeholder,
      doAddPlaceholder: true,
      movingListId: +currentTarget.getAttribute('data-list-id'),
    });
    document.addEventListener('mousemove', this.moveList);
  };

  /** Move LIST element
   *
   * */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moveList = (event: any): void => {
    this.setState({ processMovingList: true });

    const { shiftForList, listActive, placeholder } = this.state;

    if (!listActive || !placeholder) return;

    const { pageX, pageY, clientX, clientY } = event;
    const { clientWidth, clientHeight } = listActive;

    listActive.style.width = `${clientWidth}px`;
    listActive.style.height = `${clientHeight}px`;
    listActive.style.left = `${pageX - shiftForList.x}px`;
    listActive.style.top = `${pageY - shiftForList.y}px`;
    listActive.classList.add('list_move');
    listActive.style.height = 'auto';

    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.doAddPlaceholder) {
      listActive.parentElement?.insertBefore(placeholder, listActive);
      this.setState({ doAddPlaceholder: false });
    }

    /* The element under the arm during movement */
    listActive.style.display = 'none';
    const elemBelowColumn = document.elementFromPoint(clientX, clientY)?.closest('.list_wrapper');
    listActive.style.display = 'block';

    if (!elemBelowColumn) return;
    const parent = elemBelowColumn.parentElement;
    if (!parent) return;

    /*
     * Logic move List (placeholder)
     */
    const getIndexPositionPlaceholder = (htmlCollection: HTMLCollection): void => {
      const collection: HTMLElement[] = [];
      [].forEach.call(htmlCollection, (elem: HTMLElement) => {
        if (elem.classList.contains('list_wrapper') && !elem.classList.contains('list_move')) {
          collection.push(elem);
        }
      });

      for (let i = 0; i < collection.length; i++) {
        if (collection[i].classList.contains('placeholder_list')) {
          this.setState({ indexNewPositionActiveElement: i });
        }
      }
    };

    const { left, right } = elemBelowColumn.getBoundingClientRect();
    const middle = left + (right - left) / 2;

    if (pageX > middle && pageX <= right) {
      parent.insertBefore(placeholder, elemBelowColumn);
      getIndexPositionPlaceholder(parent.children);
    }

    if (pageX < middle && pageX >= left) {
      parent.insertBefore(placeholder, elemBelowColumn.nextSibling);
      getIndexPositionPlaceholder(parent.children);
    }
  };

  /** Mouse UP for LIST
   *
   * */
  mouseUpForList = (): void => {
    const { processMovingList, listActive, placeholder, dataLists, movingListId, indexNewPositionActiveElement } =
      this.state;
    if (!processMovingList || !listActive || !placeholder || !dataLists || !movingListId) return;

    listActive.classList.remove('list_move');
    placeholder.parentNode?.removeChild(placeholder);

    /* Moving list */
    const {
      newListsPosition,
      dataForState: { lists },
    } = movingList({ movingListId, indexNewPositionActiveElement, dataLists });

    /* Set State */
    this.setState((state) => ({
      ...state,
      dataLists: lists,
      listActive: null,
      placeholder: null,
    }));

    setTimeout(() => {
      this.setState({ processMovingList: false });
    }, 100);

    /* Backend */
    const { match, listsMoved } = this.props;
    const { params } = match as IMatch;
    const { boardId } = params;
    listsMoved(+boardId, newListsPosition);
  };

  /**
   * Detalis Card Functions ...
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlerOpenDetatisCard = (event: any): void => {
    // Prevent opening when moving card
    const { processMovingCard } = this.state;
    if (processMovingCard) {
      this.setState((state) => ({ ...state, processMovingCard: false }));
      return;
    }

    if (event.target.closest('.card__open-card-editor-btn')) return;
    const { cardId } = event.currentTarget.dataset;
    this.showDetalisCard(+cardId);
  };

  showDetalisCard = (cardId: number): void => {
    const { boardContent } = this.props;
    if (!boardContent) return;

    this.setState({
      openDetailEditCard: true,
      dataDetailEditCard: { cardId },
    });
  };

  closeDetalisCard = (): void => {
    this.setState({
      openDetailEditCard: false,
      dataDetailEditCard: { cardId: -1 },
    });
  };

  /** RENDER
   *
   */
  render(): JSX.Element | null {
    const { match, boardContent } = this.props;
    if (!boardContent) return null;

    const { params } = match as IMatch;
    const { boardId } = params;
    const { title } = boardContent;
    const { heightContainer, dataLists, processMovingList, openDetailEditCard, dataDetailEditCard } = this.state;
    if (!dataLists) return null;

    return (
      <BoardContext.Provider
        value={{
          updateBoard: this.updateBoard,
          boardId: +boardId,
          boardUsers: boardContent.users,
          handlerOpenDetatisCard: this.handlerOpenDetatisCard,
          boardData: boardContent,
        }}
      >
        <div className="DnD">
          {openDetailEditCard && (
            <CardDetalis
              board={boardContent}
              cardId={dataDetailEditCard.cardId}
              closeDetalisCard={this.closeDetalisCard}
            />
          )}
          <div className="board-header">
            <h2 className="title-board">
              ({boardId})
              <EditableTitleBoard title={title} />
            </h2>
          </div>
          <div id="dnd_container">
            {/* Lists */}
            <List
              lists={dataLists}
              heightContainer={heightContainer}
              onMouseDownForCard={this.onMouseDownForCard}
              onMouseDownForList={this.onMouseDownForList}
              processMovingList={processMovingList}
            />
          </div>
        </div>
      </BoardContext.Provider>
    );
  }
}

interface IMapStateToProps {
  board: IBoardContent;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapStateToProps = (state: IMapStateToProps): any => ({
  ...state.board,
});

const mapDispatchToProps = { updBoard: getBoard, listsMoved: movedLists, cardsMoved: movedCards };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Board));
