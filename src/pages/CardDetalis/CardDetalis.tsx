/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import './cardDetalis.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IBoard, ICard } from '../../common/interfaces/Interfaces';
import Title from './components/Titlle';
import Description from './components/Description';

interface TypeProps extends RouteComponentProps {
  board: IBoard;
  boardId: number;
  cardId: number;
  updateBoard: () => void;
  handlerCloseDetalisCard: () => void;
}

interface TypeState {
  historyUrl: string;
}

class CardDetalis extends React.Component<TypeProps, TypeState> {
  componentDidMount(): void {
    const { boardId, cardId } = this.props;
    this.setLocation(`/b/${boardId}/c/${cardId}`);
  }

  componentWillUnmount(): void {
    const { boardId } = this.props;
    this.setLocation(`/board/${boardId}`);
  }

  setLocation = (curLoc: string): void => {
    const { history, location } = window;
    try {
      history.pushState(null, '', curLoc);
      return;
    } catch (e) {
      console.error(e);
    }
    location.hash = `#${curLoc}`;
  };

  handlerOnClickClose = (event: any): void => {
    const { target } = event;
    const elem = target.closest('.card-dialog__wrapper');
    const closeElem = target.closest('.card-dialog__close-dialog');
    if (elem && !closeElem) return;

    const { handlerCloseDetalisCard } = this.props;
    handlerCloseDetalisCard();
  };

  render(): JSX.Element {
    const { boardId, cardId, board, updateBoard } = this.props;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const list = Object.entries(board.lists).filter(([, list]) => cardId in list.cards)[0][1];
    const card = list.cards[cardId];

    return (
      <div className="card-dialog" onClick={this.handlerOnClickClose}>
        <div className="card-dialog__wrapper">
          <button className="card-dialog__close-dialog" onClick={this.handlerOnClickClose}>
            <FontAwesomeIcon icon={['fas', 'times']} />
          </button>

          <div className="card-dialog__header">
            <div className="title-box">
              <div className="icon">
                <FontAwesomeIcon icon={['fas', 'credit-card']} />
              </div>
              <Title title={card.title} boardId={boardId} listId={list.id} cardId={cardId} updateBoard={updateBoard} />
            </div>
            <div className="title-column-name-box">
              <p className="tlt-col-name">
                in the column <a href="#">{list.title}</a>
              </p>
            </div>
          </div>

          <div className="content">
            <div className="card-dialog__description">
              <div className="title-box">
                <div className="icon">
                  <FontAwesomeIcon icon={['fas', 'bars']} />
                </div>
                <h3 className="title">Description</h3>
              </div>
              <Description
                boardId={boardId}
                listId={list.id}
                cardId={cardId}
                description={card.description}
                updateBoard={updateBoard}
              />
            </div>

            <div className="card-dialog__sidebar">
              <div className="title-sidebar">Add on card</div>
              <a href="#" className="button-link">
                <span className="icon">
                  <FontAwesomeIcon icon={['fas', 'user']} />
                </span>
                <span className="user">user: {card.users[0]}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CardDetalis);
