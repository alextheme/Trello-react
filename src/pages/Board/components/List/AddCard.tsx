import React from 'react';
import { connect } from 'react-redux';
import { checkInputText } from '../../../../common/scripts/commonFunctions';
import { addCard } from '../../../../store/modules/board/action-creators';
import { BoardContext } from '../../boardContext';
import PopUpMessage from '../PopUpMessage/PopUpMessage';

interface TypeProps {
  listId: string;
  countCards: number;
  addCardInputId: string;
  handlerClickCloseAddedCard: () => void;
  cardCreate: (boardId: number, title: string, list_id: number, position: number) => void;
}

interface TypeState {
  nameCard: string;
  statusErrorText: boolean;
  res: string;
  errSymbols: string;
  positionFixed: boolean;
}

class AddCard extends React.Component<TypeProps, TypeState> {
  mounted = false;

  textareaRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: TypeProps) {
    super(props);
    this.state = {
      nameCard: '',
      statusErrorText: false,
      res: '',
      errSymbols: '',
      positionFixed: true,
    };

    this.textareaRef = React.createRef();
  }

  componentDidMount(): void {
    this.mounted = true;
    const { addCardInputId } = this.props;
    const textarea: HTMLElement | null = document.getElementById(addCardInputId);
    textarea?.focus();
  }

  componentWillUnmount(): void {
    this.mounted = false;
  }

  /** set value in title, tracked component */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputOnChangeHandler = (e: any): void => {
    if (this.mounted) {
      const { statusErrorText } = this.state;
      if (statusErrorText) {
        this.setState((state: TypeState) => ({ ...state, statusErrorText: false }));
      }
      this.setState((state: TypeState) => ({ ...state, nameCard: e.target.value }));
    }
  };

  onClickButtonCloseInputField = (): void => {
    const { handlerClickCloseAddedCard } = this.props;
    handlerClickCloseAddedCard();
    this.setState((state) => ({ ...state, statusErrorText: false }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onKeyPressInputAddCard = (e: any): void => {
    if (e.code === 'Enter' && e.charCode === 13) {
      const { dataset } = e.target;
      const { countcards, idlist } = dataset;

      this.addNewCard(idlist, countcards);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClickButtonAddCard = (e: any): void => {
    const { dataset } = e.target;
    const { countcards, idlist } = dataset;

    this.addNewCard(idlist, countcards);
  };

  /** Add New Card */
  addNewCard = async (listId: string, countcards: string): Promise<void> => {
    if (!this.mounted) return;

    const { cardCreate, ...props } = this.props;
    const { ...state } = this.state;
    const { boardId } = this.context;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, res, errSymbols } = checkInputText(state.nameCard);

    if (status) {
      await cardCreate(boardId, state.nameCard, +listId, +countcards + 1);
      const { updateBoard } = this.context;
      await updateBoard();
      this.setState((st) => ({ ...st, openInputAddCard: false, nameCard: '' }));
      props.handlerClickCloseAddedCard();
      return;
    }

    this.setState((st) => ({ ...st, statusErrorText: true, res, errSymbols }));
    setTimeout(() => {
      this.setState((st) => ({ ...st, statusErrorText: false }));
    }, 2000);

    const { addCardInputId } = this.props;
    const node = document.getElementById(addCardInputId);

    // const node = this.textareaRef.current;

    if (node) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      node.focus(); // @ts-ignore
      node.select();
    }
  };

  // Render
  render(): JSX.Element {
    const { listId, countCards, addCardInputId } = this.props;
    const { nameCard } = this.state;

    //
    return (
      <div id={`add-card-container-${listId}`} className="add-card__container" style={{ position: 'relative' }}>
        <div className="add-card__input-box">
          <div className="textarea-wrapper">
            <textarea
              ref={this.textareaRef}
              id={addCardInputId}
              className="add-card__input-field"
              placeholder="Ввести заголовок для этой карточки"
              value={nameCard}
              data-idlist={listId}
              data-countcards={countCards}
              onChange={this.inputOnChangeHandler}
              onKeyPress={this.onKeyPressInputAddCard}
              autoComplete="off"
              onFocus={(e): void => e.currentTarget.select()}
            />
          </div>

          <div id={`btn-add-card-container-${listId}`} className="add-card__btn-box">
            <button
              id={`btn-add-card-${listId}`}
              className="add-card__add-btn-run"
              data-idlist={listId}
              data-countcards={countCards}
              onClick={this.onClickButtonAddCard}
            >
              {`Добавить карточку ${countCards + 1}`}
            </button>
            <div className="add-card__close-btn" onClick={this.onClickButtonCloseInputField} />
          </div>
          <PopUpMessage {...this.state} parentId={addCardInputId} />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = { cardCreate: addCard };

AddCard.contextType = BoardContext;

export default connect(null, mapDispatchToProps)(AddCard);
