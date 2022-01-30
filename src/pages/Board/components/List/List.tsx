import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { IListContent } from '../../../../common/interfaces/Interfaces';
import Card from './Card';
import EditableTitleList from './EditableTitleList';
import AddList from './AddList';
import AddCard from './AddCard';
import { deleteList } from '../../../../store/modules/board/action-creators';
import { BoardContext, IBoardContext } from '../../boardContext';

interface TypeProps {
  lists: { [id: number]: IListContent };
  heightContainer: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMouseDownForList: (event: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMouseDownForCard: (event: any) => void;
  processMovingList: boolean;
  listDelete: (boardId: number, listId: number) => void;
}

interface TypeState {
  openAddCard: string;
}

class List extends React.Component<TypeProps, TypeState> {
  constructor(props: TypeProps) {
    super(props);
    this.state = {
      openAddCard: '',
    };
  }

  componentDidMount(): void {}

  componentWillUnmount(): void {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClickOpenAddedCard = (event: any): void => {
    this.setState({ openAddCard: event.target.dataset.btnAddCardListId });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClickDeleteList = async (event: any): Promise<void> => {
    const { target } = event;
    const listId = target.dataset.listId || target.parentElement.dataset.listId;

    const { listDelete } = this.props;
    const { boardId, updateBoard } = this.context as IBoardContext;
    await listDelete(+boardId, listId);
    updateBoard();
  };

  handlerClickCloseAddedCard = (): void => {
    this.setState({ openAddCard: '' });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClickColumn = (event: any): void => {
    const { target } = event;
    if (target.classList.contains('list_wrapper')) {
      this.setState({ openAddCard: '' });
    }
  };

  render(): JSX.Element | null {
    const { lists, heightContainer, onMouseDownForList, onMouseDownForCard, processMovingList } = this.props;
    const { boardId } = this.context;
    const { openAddCard } = this.state;

    return (
      <>
        {Object.entries(lists)
          .sort((a, b) => a[1].position - b[1].position)
          .map(([, list]) => {
            const openFieldForAddCard = +openAddCard === list.id;
            return (
              <div
                key={list.id}
                className="list_wrapper"
                data-list-id={list.id}
                onClick={this.onClickColumn}
                style={{ height: heightContainer }}
                onMouseDown={onMouseDownForList}
              >
                <div className="list_detalis" style={{ maxHeight: heightContainer }}>
                  <div>
                    {list.id}, pos: {list.position}
                  </div>
                  {/* Header */}
                  <div className="list_header">
                    <EditableTitleList titleList={list.title} listId={list.id} processMovingList={processMovingList} />
                    <span className="list__delete-btn" data-list-id={list.id} onClick={this.onClickDeleteList}>
                      <FontAwesomeIcon icon={['fas', 'ellipsis-h']} />
                    </span>
                  </div>
                  <div className="list_content" data-list-id={list.id} style={{ maxHeight: heightContainer - 125 }}>
                    {/* Cards */}
                    <Card listId={list.id} cards={list.cards} onMouseDownForCard={onMouseDownForCard} />
                    {openFieldForAddCard ? (
                      <AddCard
                        listId={`${list.id}`}
                        countCards={Object.keys(list.cards).length}
                        addCardInputId={`add_card_textarea_${list.id}`}
                        handlerClickCloseAddedCard={this.handlerClickCloseAddedCard}
                      />
                    ) : null}
                  </div>

                  <div className="list_bottom">
                    {!openFieldForAddCard ? (
                      <button
                        id={`btn-list-add-card-${list.id}`}
                        data-btn-add-card-list-id={list.id}
                        className="add-card__add-btn-start"
                        onClick={this.onClickOpenAddedCard}
                      >
                        + Добавить карточку
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        <AddList boardId={boardId} position={Object.entries(lists).length + 1} />
      </>
    );
  }
}

List.contextType = BoardContext;

export default connect(null, { listDelete: deleteList })(List);
