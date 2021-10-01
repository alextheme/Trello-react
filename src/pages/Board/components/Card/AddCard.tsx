/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import React from 'react';
import './card.scss';
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
  listId: number;
  boardId: string;
  countCards: number;
  updateBoard: any;
  addCardInputId: string;
}

interface TypeState {
  nameCard: string;
  openInputAddCard: boolean;
  status: boolean;
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
      openInputAddCard: false,
      status: false,
      res: '',
      errSymbols: '',
      positionFixed: true,
    };
  }

  componentDidMount(): void {
    this.globalValue.mounted = true;

    document.addEventListener('click', (e: any): void => {
      const { listId } = this.props;

      // Close editor added card on eny field then this
      const classes = [
        `list-card-wrapper-${listId}`,
        `container-btn-add-card-${listId}`,
        `btn-add-card-container-${listId}`,
        `btn-open-input-${listId}`,
        `btn-add-card-${listId}`,
        `add-card__input-field-${listId}`,
      ];
      if (this.globalValue.mounted) {
        if (isCloseInputField(classes, e.target)) {
          this.closeInput();
          this.closeErrorMessage();
        }
      }
    });
  }

  componentWillUnmount(): void {
    this.globalValue.mounted = false;
  }

  // status: false
  closeErrorMessage = (): void => {
    if (this.globalValue.mounted) {
      this.setState((state: TypeState) => ({ ...state, status: false }));
    }
  };

  // openInputAddCard: true, status: false
  openInput = (): void => {
    this.setState((state: TypeState) => ({ ...state, openInputAddCard: true }));
    this.closeErrorMessage();
    setTimeout(() => {
      const { addCardInputId } = this.props;
      const input = document.getElementById(addCardInputId);
      input?.focus();
    }, 10);
  };

  // openInputAddCard: true
  closeInput = (): void => {
    if (this.globalValue.mounted) {
      this.setState((state: TypeState) => ({ ...state, openInputAddCard: false }));
    }
  };

  // set value in title, tracked component
  inputOnChangeHandler = (e: any): void => {
    if (this.globalValue.mounted) {
      if (this.state.status) {
        this.setState((state: TypeState) => ({ ...state, status: false }));
      }
      this.setState((state: TypeState) => ({ ...state, nameCard: e.target.value }));
    }
  };

  onClickButtonOpenInputField = (): void => {
    this.openInput();
  };

  onClickButtonCloseInputField = (): void => {
    this.closeErrorMessage();
    this.closeInput();
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

  getInput = (): HTMLElement | null => getHtmlElementByID(this.props.addCardInputId);

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
      }
      return;
    }

    if (this.globalValue.mounted) {
      this.setState((st) => ({ ...st, status: true, res, errSymbols }));
      setTimeout(() => {
        this.closeErrorMessage();
      }, 2000);
    }

    const input = this.getInput();
    input?.focus(); // @ts-ignore
    input?.select();
  };

  render(): JSX.Element {
    const { listId, countCards, addCardInputId } = this.props;
    const { openInputAddCard, nameCard } = this.state;

    //
    return (
      <div id={`add-card-container-${listId}`} className="add-card__container" style={{ position: 'relative' }}>
        <div className="add-card__input-box" style={{ display: openInputAddCard ? 'block' : 'none' }}>
          <input
            type="text"
            id={addCardInputId}
            className="add-card__input-field"
            placeholder="Ввести заголовок для этой карточки"
            value={nameCard}
            data-idlist={listId}
            data-countcards={countCards}
            onChange={this.inputOnChangeHandler}
            onKeyPress={this.onKeyPressInputAddCard}
            autoComplete="off"
          />
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

        <button
          id={`btn-open-input-${listId}`}
          className="add-card__add-btn-start"
          onClick={this.onClickButtonOpenInputField}
          style={{ display: openInputAddCard ? 'none' : 'block' }}
        >
          + Добавить еще одну карточку
        </button>
      </div>
    );
  }
}

export default AddCard;
