import React from 'react';
import './addCard.scss';
import { closeInputField } from '../../../../common/scripts/commonFunctions';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TypeProps {}

interface TypeState {
  nameCard: string;
  openInputAddCard: boolean;
}

class AddCard extends React.Component<TypeProps, TypeState> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(props: TypeProps) {
    super(props);
    this.state = {
      nameCard: '',
      openInputAddCard: false,
    };
  }

  componentDidMount(): void {
    document.addEventListener('click', (e) => {
      // @ts-ignore
      const htmlElements = [
        '.lists-list',
        '.lists-element',
        '.lists',
        '.add-card__input-box',
        'add-card__input-field', // id
        '.add-card__btn-box',
        '.add-card__add-btn-run',
        '.add-card__close-btn',
        '.add-class__add-btn-start',
      ];

      if (closeInputField(htmlElements, e.target)) {
        this.closeInputField();
      }
    });
  }

  componentWillUnmount(): void {
    document.removeEventListener('keypress', () => {});
    document.removeEventListener('click', () => {});
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleInput = (e: any): void => {
    this.setState((state: TypeState) => ({ ...state, nameCard: e.target.value }));
  };

  openInputField = (): void => {
    // setFocusToElement('add-card__input-field');
    setTimeout(() => {
      this.setState((state: TypeState) => ({ ...state, openInputAddCard: true }));
    }, 0);
  };

  closeInputField = (): void => {
    this.setState((state: TypeState) => ({ ...state, openInputAddCard: false }));
  };

  render(): JSX.Element {
    return (
      <div className="add-card__container">
        <div className="add-card__input-box" style={{ display: this.state.openInputAddCard ? 'block' : 'none' }}>
          <input
            type="text"
            id="add-card__input-field"
            placeholder="Ввести заголовок для этой карточки"
            autoComplete="off"
            value={this.state.nameCard}
            onChange={this.handleInput}
          />
          <div className="add-card__btn-box">
            <button className="add-card__add-btn-run">Добавить карточку</button>
            <div className="add-card__close-btn" onClick={this.closeInputField} />
          </div>
        </div>

        <button
          className="add-card__add-btn-start"
          onClick={this.openInputField}
          style={{ display: this.state.openInputAddCard ? 'none' : 'block' }}
        >
          + Добавить еще одну карточку
        </button>
      </div>
    );
  }
}

export default AddCard;
