/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-console */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './board.scss';
import { IBoard, IList } from '../../common/interfaces/Interfaces';
import { getBoard, movedCards, movedLists } from '../../store/modules/board/actions';
import List from './components/List/List';
import EditableTitleBoard from './components/EditableTitleBoard';
import CardDetalis from '../CardDetalis/CardDetalis';

interface TypeProps extends RouteComponentProps {
  boardId: number;
  title: string;
  board: IBoard;
  updBoard: (boardId: string) => Promise<void>;
}

interface TypeState {
  mount: boolean;
  movingProcess: boolean;
  heightContainer: number;
  shiftForCard: { x: number; y: number };
  shiftForList: { x: number; y: number };
  cardActive: HTMLElement | null;
  listActive: HTMLElement | null;
  placeholder: HTMLElement | null;
  dataLists: { [id: number]: IList } | null;
  doAddPlaceholder: boolean;
  indexNewPositionActiveElement: number;
  movingCard: { indexSourceList: number; indexCard: number } | null;
  movingListId: number;
  progressBar: boolean;
  openDetailEditCard: boolean;
  detalisEditCard: JSX.Element;
}
class Board extends React.Component<TypeProps, TypeState> {
  constructor(props: TypeProps) {
    super(props);
    this.state = {
      mount: true,
      movingProcess: false,
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
      progressBar: false,
      openDetailEditCard: false,
      detalisEditCard: <div />,
    };
    this.onMouseDownForCard = this.onMouseDownForCard.bind(this);
  }

  async componentDidMount(): Promise<void> {
    this.setState({ mount: true });
    await this.updateBoard();

    // Set Height Container
    const heightWindow = window.innerHeight;
    const containerTop = document.getElementById('dnd_container')?.getBoundingClientRect().top;
    const heightContainer = heightWindow - (containerTop || 0);
    this.setState((state) => ({ ...state, heightContainer }));

    // Show Detalis Card
    const { match } = this.props;
    const { params, path } = match; // @ts-ignore
    const cardDetalisShow = path.slice(0, 4) === '/b/:';
    if (cardDetalisShow) {
      // @ts-ignore
      const { boardId, cardId } = params;
      this.showDetalisCard(+boardId, +cardId);
    }

    // close the window with details on the card when pressing the escape key
    document.addEventListener('keyup', (event: any) => {
      const { key, keyCode } = event;
      const { openDetailEditCard } = this.state;
      if (openDetailEditCard && key === 'Escape' && keyCode === 27) {
        this.handlerCloseDetalisCard();
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
    this.setState({ mount: false });
  }

  updateBoard = async (): Promise<void> => {
    const { updBoard, match } = this.props;
    const { params } = match; // @ts-ignore
    const { boardId } = params;
    await updBoard(boardId);
    const { board } = this.props;
    if (!board) return;
    const { lists } = board;
    if (!lists) return;
    this.setState((state) => ({ ...state, dataLists: lists }));
  };

  /** CARD
   *
   *
   * Mouse press on CARD element
   * */
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
  moveCard = (event: any): void => {
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
        // @ts-ignore
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
  mouseUpForCard = (): void => {
    const { cardActive, placeholder, dataLists, movingCard, indexNewPositionActiveElement } = this.state;
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

    /**
     * Moving in one list
     */
    const newCardPosition: { id: number; position: number; list_id: number }[] = [];

    if (indexSourceList === +indexDestintaionList) {
      const list = dataLists[indexSourceList];
      const cards = { ...list.cards };
      const sort = Object.entries(cards).sort((a, b) => a[1].position - b[1].position);
      const delCard = sort.splice(cards[idCard].position - 1, 1);
      sort.splice(indexNewPositionActiveElement, 0, delCard[0]);
      sort.forEach(([, card], index) => {
        if (card.position !== index + 1) {
          // eslint-disable-next-line no-param-reassign
          card.position = index + 1;
          newCardPosition.push({ id: card.id, position: card.position, list_id: indexSourceList });
        }
      });

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
      const sourceList = dataLists[indexSourceList];
      const sourceCards = { ...sourceList.cards };
      const deleteCard = sourceCards[idCard];
      delete sourceCards[idCard];
      Object.entries(sourceCards)
        .sort((a, b) => a[1].position - b[1].position)
        .forEach(([, card], index) => {
          if (card.position !== index + 1) {
            // eslint-disable-next-line no-param-reassign
            card.position = index + 1;
            newCardPosition.push({ id: card.id, position: card.position, list_id: indexSourceList });
          }
        });

      /* destination list cards */
      const destinationList = dataLists[+indexDestintaionList];
      const destinationCards = { ...destinationList.cards };
      const sort = Object.entries(destinationCards).sort((a, b) => a[1].position - b[1].position);
      sort.splice(indexNewPositionActiveElement, 0, [`${deleteCard.id}`, deleteCard]);
      sort.forEach(([, card], index) => {
        if (card.position !== index + 1 || (card.position === index + 1 && index + 1 === deleteCard.position)) {
          // eslint-disable-next-line no-param-reassign
          card.position = index + 1;
          newCardPosition.push({ id: card.id, position: card.position, list_id: +indexDestintaionList });
        }
      });
      destinationCards[deleteCard.id] = deleteCard;

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
    const { match } = this.props;
    const { params } = match; // @ts-ignore
    const { boardId } = params;
    movedCards(boardId, newCardPosition);
  };

  /** LIST
   *
   *
   * Mouse press on LIST element
   * */
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
  moveList = (event: any): void => {
    this.setState({ movingProcess: true });

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
        // @ts-ignore
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
    const { movingProcess } = this.state;
    if (movingProcess) {
      const { listActive, placeholder, dataLists, movingListId, indexNewPositionActiveElement } = this.state;
      if (!listActive || !placeholder || !dataLists || !movingListId) return;

      listActive.classList.remove('list_move');
      placeholder.parentNode?.removeChild(placeholder);

      /*
       * Moving list
       */
      const newListsPosition: { id: number; position: number }[] = [];

      const lists = { ...dataLists };
      const sort = Object.entries(lists).sort((a, b) => a[1].position - b[1].position);
      const delList = sort.splice(lists[movingListId].position - 1, 1);
      sort.splice(indexNewPositionActiveElement, 0, delList[0]);
      sort.forEach(([, list], index) => {
        if (list.position !== index + 1) {
          // eslint-disable-next-line no-param-reassign
          list.position = index + 1;
          newListsPosition.push({ id: list.id, position: list.position });
        }
      });

      /* Set State */
      this.setState((state) => ({
        ...state,
        dataLists: lists,
        listActive: null,
        placeholder: null,
      }));

      setTimeout(() => {
        this.setState({ movingProcess: false });
      }, 100);

      /* Backend */
      const { match } = this.props;
      const { params } = match; // @ts-ignore
      const { boardId } = params;
      movedLists(boardId, newListsPosition);
    }
  };

  /**
   * Detalis Card Functions ...
   */
  handlerOpenDetatisCard = (event: any): void => {
    event.preventDefault();
    if (event.target.closest('.card__open-card-editor-btn')) return;

    const { match } = this.props;
    const { params } = match; // @ts-ignore
    const { boardId } = params;
    const { cardId } = event.currentTarget.dataset;

    this.showDetalisCard(+boardId, +cardId);
  };

  showDetalisCard = (boardId: number, cardId: number): void => {
    const { board } = this.props;
    this.setState({
      openDetailEditCard: true,
      detalisEditCard: (
        <CardDetalis
          board={board}
          boardId={boardId}
          cardId={cardId}
          updateBoard={this.updateBoard}
          handlerCloseDetalisCard={this.handlerCloseDetalisCard}
        />
      ),
    });
  };

  handlerCloseDetalisCard = (): void => {
    this.setState({
      openDetailEditCard: false,
      detalisEditCard: <div />,
    });
  };

  /** RENDER
   *
   */
  render(): JSX.Element | null {
    const { match, board } = this.props;

    if (!board) return null;

    const { params } = match; // @ts-ignore
    const { boardId } = params;
    const { title } = board;
    const { heightContainer, dataLists, movingProcess, openDetailEditCard, detalisEditCard } = this.state;
    if (!dataLists) return null;

    return (
      // comment
      <div className="DnD">
        {openDetailEditCard && detalisEditCard}
        <div className="board-header">
          <h2 className="title-board">
            ({boardId})
            <EditableTitleBoard title={title} boardId={boardId} />
          </h2>
        </div>
        <div id="dnd_container">
          {/* Lists */}
          <List
            lists={dataLists}
            boardId={boardId}
            heightContainer={heightContainer}
            updateBoard={this.updateBoard}
            onMouseDownForCard={this.onMouseDownForCard}
            onMouseDownForList={this.onMouseDownForList}
            movingProcess={movingProcess}
            handlerOpenDetatisCard={this.handlerOpenDetatisCard}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any): any => ({ ...state.board.board, ...state.load });

export default connect(mapStateToProps, { updBoard: getBoard })(withRouter(Board));
