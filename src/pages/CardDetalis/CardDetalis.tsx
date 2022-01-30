import React from 'react';
import './cardDetalis.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IBoardContent } from '../../common/interfaces/Interfaces';
import Title from './components/TitleCard/Title';
import Description from './components/DescriptionCard/Description';
import Members from './components/MembersCard/Members';
import { BoardContext } from '../Board/boardContext';
import { CardDetalisContext } from './CardDetalisContext';
import MoveCard from './components/MoveCard/MoveCard';
import { ICurrentValue } from './components/MoveCard/MoveCard.props';
import { Button } from './components/Button/Button';
import CopyCard from './components/CopyCard/CopyCard';
import DeleteCard from './components/DeleteCard/DeleteCard';

interface TypeProps extends RouteComponentProps {
  board: IBoardContent;
  cardId: number;
  closeDetalisCard: () => void;
}

interface TypeState {
  showDialogMoveCardInTitleBox: boolean;
  showDialogCopyCardInSidebar: boolean;
  showDialogMoveToCardInSidebar: boolean;
  showDialogArchiveCardInSidebar: boolean;
}

class CardDetalis extends React.Component<TypeProps, TypeState> {
  mount = false;

  constructor(props: TypeProps) {
    super(props);
    this.state = {
      showDialogMoveCardInTitleBox: !1,
      showDialogCopyCardInSidebar: !1,
      showDialogMoveToCardInSidebar: !1,
      showDialogArchiveCardInSidebar: !1,
    };
  }

  componentDidMount(): void {
    this.mount = true;
    const { cardId } = this.props;
    const { boardId } = this.context;
    this.setLocation(`/b/${boardId}/c/${cardId}`);
  }

  componentWillUnmount(): void {
    this.mount = false;
    const { boardId } = this.context;
    this.setLocation(`/board/${boardId}`);
  }

  setLocation = (curLoc: string): void => {
    const { history, location } = window;
    try {
      history.pushState(null, '', curLoc);
      return;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
    location.hash = `#${curLoc}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlerOnClickClose = ({ target }: { target: any }): void => {
    if (!target.closest('.card-dialog__wrapper')) {
      this.closedCardDialog();
    }

    const {
      showDialogMoveCardInTitleBox,
      showDialogCopyCardInSidebar,
      showDialogMoveToCardInSidebar,
      showDialogArchiveCardInSidebar,
    } = this.state;

    const clickedNoPopapOrBtnClose = !target.closest('.popup-card-dialog') || target.closest('.close-btn');

    if (showDialogMoveCardInTitleBox && clickedNoPopapOrBtnClose) {
      this.closeDialogMoveCardInTitleBox();
    }

    if (showDialogCopyCardInSidebar && clickedNoPopapOrBtnClose) {
      this.closeDialogCopyCardInSidebar();
    }

    if (showDialogMoveToCardInSidebar && clickedNoPopapOrBtnClose) {
      this.closeDialogMoveToCardInSidebar();
    }

    if (showDialogArchiveCardInSidebar && clickedNoPopapOrBtnClose) {
      this.closeDialogArchiveCardInSidebar();
      this.setState({ showDialogArchiveCardInSidebar: !1 });
    }
  };

  closedCardDialog = (): void => {
    const { closeDetalisCard } = this.props;
    closeDetalisCard();
  };

  // open dialog moved card
  handlerTitleColumnName = (): void => {
    this.setState({ showDialogMoveCardInTitleBox: !0 });
  };

  // close dialog moved card
  closeDialogMoveCardInTitleBox = (): void => {
    this.setState({ showDialogMoveCardInTitleBox: !1 });
  };

  // close dialog copy card
  closeDialogCopyCardInSidebar = (): void => {
    this.setState({ showDialogCopyCardInSidebar: !1 });
  };

  // close dialog move to card
  closeDialogMoveToCardInSidebar = (): void => {
    this.setState({ showDialogMoveToCardInSidebar: !1 });
  };

  // close dialog archive card
  closeDialogArchiveCardInSidebar = (): void => {
    this.setState({ showDialogArchiveCardInSidebar: !1 });
  };

  // Copy, Move, Archive
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handlerButtonSidebarActionToCard = (event: any): void => {
    const id = event?.target?.id;
    if (id === 'sdb-copy-card') this.setState({ showDialogCopyCardInSidebar: !0 });
    if (id === 'sdb-move-card') this.setState({ showDialogMoveToCardInSidebar: !0 });
    if (id === 'sdb-archive-card') this.setState({ showDialogArchiveCardInSidebar: !0 });
  };

  render(): JSX.Element | null {
    const { cardId, board } = this.props;
    const {
      showDialogMoveCardInTitleBox,
      showDialogCopyCardInSidebar,
      showDialogMoveToCardInSidebar,
      showDialogArchiveCardInSidebar,
    } = this.state;
    const { boardId } = this.context as { boardId: number };
    const list = Object.entries(board.lists).find(([, listContent]) => cardId in listContent.cards)?.[1];
    if (!list) return null;
    const cardContent = list.cards[cardId];

    const startingValues: ICurrentValue = {
      src: {
        cardId,
        positionCard: cardContent.position,
        listId: list.id,
        boardId,
        boardData: board,
      },
    };

    return (
      <CardDetalisContext.Provider value={{ updateBoard: async (): Promise<void> => {} }}>
        <div className="card-dialog" onClick={this.handlerOnClickClose}>
          <div className="card-dialog__wrapper">
            <button className="card-dialog__close-dialog" onClick={this.closedCardDialog}>
              <FontAwesomeIcon icon={['fas', 'times']} />
            </button>

            <div className="card-dialog__header">
              <div className="title-box">
                <div className="icon">
                  <FontAwesomeIcon icon={['fas', 'credit-card']} />
                </div>
                <Title title={cardContent.title} boardId={boardId} listId={list.id} cardId={cardId} />
              </div>
              <div className="title-column-name-box">
                <div className="tlt-col-name">
                  in the column{' '}
                  <a href="#" onClick={this.handlerTitleColumnName}>
                    <span className="tlt-col-name-title">{list.title}</span>
                    {showDialogMoveCardInTitleBox && (
                      <MoveCard
                        {...startingValues}
                        closeCardDialog={this.closedCardDialog}
                        closePopup={this.closeDialogMoveCardInTitleBox}
                      />
                    )}
                  </a>
                </div>
              </div>
            </div>

            <div className="card-dialog__content">
              <div className="card-dialog__information">
                <span className="title-content information">
                  <span className="icon">
                    <FontAwesomeIcon icon={['fas', 'user']} />
                  </span>
                  <h3 className="title">Members</h3>
                </span>

                <div className="card-dialog_members">
                  <Members boardId={`${boardId}`} card={cardContent} boardUsers={board.users} />
                </div>

                <div className="card-dialog_description">
                  <div className="title-box">
                    <div className="icon">
                      <FontAwesomeIcon icon={['fas', 'bars']} />
                    </div>
                    <h3 className="title">Description</h3>
                  </div>
                  <Description listId={list.id} cardId={cardId} description={cardContent.description} />
                </div>
              </div>

              <div className="card-dialog__sidebar">
                <span className="title-content sidebar">
                  <span className="icon">
                    <FontAwesomeIcon icon={['fas', 'cogs']} />
                  </span>
                  <h3 className="title">Action to card</h3>
                </span>

                <ul className="list-actions-to-card">
                  <li className="button-element">
                    <Button
                      id="sdb-copy-card"
                      appearance="grey"
                      awesomeIconProp={['fas', 'copy']}
                      className="button"
                      onClick={this.handlerButtonSidebarActionToCard}
                    >
                      Copy
                    </Button>
                    {showDialogCopyCardInSidebar && (
                      <CopyCard
                        {...startingValues}
                        closeCardDialog={this.closedCardDialog}
                        closePopup={this.closeDialogCopyCardInSidebar}
                      />
                    )}
                  </li>
                  <li className="button-element">
                    <Button
                      id="sdb-move-card"
                      appearance="grey"
                      awesomeIconProp={['fas', 'exchange-alt']}
                      className="button"
                      onClick={this.handlerButtonSidebarActionToCard}
                    >
                      Move to
                    </Button>
                    {showDialogMoveToCardInSidebar && (
                      <MoveCard
                        {...startingValues}
                        closeCardDialog={this.closedCardDialog}
                        closePopup={this.closeDialogMoveToCardInSidebar}
                      />
                    )}
                  </li>
                  <li className="button-element">
                    <Button
                      id="sdb-archive-card"
                      appearance="grey"
                      awesomeIconProp={['fas', 'box']}
                      className="button"
                      onClick={this.handlerButtonSidebarActionToCard}
                    >
                      Archive
                    </Button>
                    {showDialogArchiveCardInSidebar && (
                      <DeleteCard
                        {...startingValues}
                        closeCardDialog={this.closedCardDialog}
                        closePopup={this.closeDialogArchiveCardInSidebar}
                      />
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardDetalisContext.Provider>
    );
  }
}

CardDetalis.contextType = CardDetalisContext;

CardDetalis.contextType = BoardContext;

export default withRouter(CardDetalis);
