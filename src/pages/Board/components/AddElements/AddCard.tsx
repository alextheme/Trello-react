/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import React from 'react';
import './addCard.scss';
import { closeInputField, getHtmlElementByID, setFocusToElement } from '../../../../common/scripts/commonFunctions';
import { addCard } from '../../../../store/modules/board/actions';

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
    };
  }

  componentDidMount(): void {
    this.globalValue.mounted = true;

    const { addCardInputId } = this.props;

    document.addEventListener('click', (e) => {
      const htmlElements = [
        '.lists-list',
        '.lists-element',
        '.lists',
        '.add-card__input-box',
        addCardInputId, // id
        '.add-card__btn-box',
        '.add-card__input-field',
        '.add-card__add-btn-run',
        '.add-card__close-btn',
        '.add-class__add-btn-start',
      ];

      if (this.globalValue.mounted) {
        if (closeInputField(htmlElements, e.target)) {
          this.onClickButtonCloseInputField();
        }
      }
    });

    document.addEventListener('keypress', (e) => {
      const inputField = getHtmlElementByID(addCardInputId);
      if (inputField === document.activeElement && e.key === 'Enter') {
        // @ts-ignore
        const { dataset } = e.target;
        const { countcards } = dataset;
        // @ts-ignore
        this.addNewCard(e.target.dataset.list_id, countcards);
      }
    });
  }

  componentWillUnmount(): void {
    this.globalValue.mounted = false;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleAddNewCard = (e: any): void => {
    const { dataset } = e.target;
    const { countcards } = dataset;

    this.addNewCard(e.target.dataset.list_id, countcards);
  };

  addNewCard = async (listId: string, countcards: string): Promise<void> => {
    const { ...p } = this.props;
    const { ...s } = this.state;
    await addCard(p.boardId, s.nameCard, +listId, +countcards + 1);
    await p.updateBoard();
    if (this.globalValue.mounted) {
      this.setState((state) => ({ ...state, openInputAddCard: false, nameCard: '' }));
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  inputOnChangeHandler = (e: any): void => {
    this.setState((state: TypeState) => ({ ...state, nameCard: e.target.value }));
  };

  onClickButtonOpenInputField = (): void => {
    const { addCardInputId } = this.props;

    setFocusToElement(addCardInputId);

    setTimeout(() => {
      this.setState((state: TypeState) => ({ ...state, openInputAddCard: true }));
    }, 0);
  };

  onClickButtonCloseInputField = (): void => {
    this.setState((state: TypeState) => ({ ...state, openInputAddCard: false }));
  };

  render(): JSX.Element {
    const { listId, countCards, addCardInputId } = this.props;
    const { openInputAddCard, nameCard } = this.state;
    return (
      <div className="add-card__container">
        <div className="add-card__input-box" style={{ display: openInputAddCard ? 'block' : 'none' }}>
          <input
            type="text"
            className="add-card__input-field"
            data-list_id={listId}
            id={addCardInputId}
            placeholder="Ввести заголовок для этой карточки"
            autoComplete="off"
            value={nameCard}
            onChange={this.inputOnChangeHandler}
          />
          <div className="add-card__btn-box">
            <button
              className="add-card__add-btn-run"
              data-list_id={listId}
              data-countcards={countCards}
              onClick={this.handleAddNewCard}
            >
              {`Добавить карточку ${countCards + 1}`}
            </button>
            <div className="add-card__close-btn" onClick={this.onClickButtonCloseInputField} />
          </div>
        </div>

        <button
          className="add-card__add-btn-start no-selected"
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
