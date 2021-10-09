/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  checkInputText,
  // closeInputField,
  getHtmlElementByID,
  isCloseInputField,
  // isCloseInputField,
} from '../../../../common/scripts/commonFunctions';
import { addCard } from '../../../../store/modules/board/actions';
import PopUpMessage from '../PopUpMessage/PopUpMessage';

interface TypeProps {
  listId: string;
  boardId: string;
  countCards: number;
  updateBoard: any;
  addCardInputId: string;
  handlerClickCloseAddedCard: () => void;
}

interface TypeState {
  nameCard: string;
  statusErrorText: boolean;
  res: string;
  errSymbols: string;
  positionFixed: boolean;
}

class AddCard extends React.Component<TypeProps, TypeState> {
  globalValue: {
    mounted: boolean | undefined;
  } = {
    mounted: undefined,
  };

  constructor(props: TypeProps) {
    super(props);
    this.state = {
      nameCard: '',
      statusErrorText: false,
      res: '',
      errSymbols: '',
      positionFixed: true,
    };
  }

  componentDidMount(): void {
    this.globalValue.mounted = true;
    const { addCardInputId } = this.props;
    const textarea: HTMLElement | null = document.getElementById(addCardInputId);
    textarea?.focus();
  }

  componentWillUnmount(): void {
    this.globalValue.mounted = false;
  }

  // set value in title, tracked component
  inputOnChangeHandler = (e: any): void => {
    if (this.globalValue.mounted) {
      if (this.state.statusErrorText) {
        this.setState((state: TypeState) => ({ ...state, statusErrorText: false }));
      }
      this.setState((state: TypeState) => ({ ...state, nameCard: e.target.value }));
    }
  };

  onClickButtonCloseInputField = (): void => {
    this.props.handlerClickCloseAddedCard();
    this.setState((state) => ({ ...state, statusErrorText: false }));
  };

  onKeyPressInputAddCard = (e: any): void => {
    if (e.code === 'Enter' && e.charCode === 13) {
      const { dataset } = e.target;
      const { countcards, idlist } = dataset;

      this.addNewCard(idlist, countcards);
    }
  };

  onClickButtonAddCard = (e: any): void => {
    const { dataset } = e.target;
    const { countcards, idlist } = dataset;

    this.addNewCard(idlist, countcards);
  };

  /** Get Input Html Element */
  getInput = (): HTMLElement | null => getHtmlElementByID(this.props.addCardInputId);

  /** Add New Card */
  addNewCard = async (listId: string, countcards: string): Promise<void> => {
    const { ...props } = this.props;
    const { ...state } = this.state;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, res, errSymbols } = checkInputText(state.nameCard);

    if (status) {
      await addCard(props.boardId, state.nameCard, +listId, +countcards + 1);
      await props.updateBoard();
      if (this.globalValue.mounted) {
        this.setState((st) => ({ ...st, openInputAddCard: false, nameCard: '' }));
        props.handlerClickCloseAddedCard();
      }
      return;
    }

    if (this.globalValue.mounted) {
      this.setState((st) => ({ ...st, statusErrorText: true, res, errSymbols }));
      setTimeout(() => {
        this.setState((st) => ({ ...st, statusErrorText: false }));
      }, 2000);
    }

    const input = this.getInput();
    input?.focus(); // @ts-ignore
    input?.select();
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

export default AddCard;
