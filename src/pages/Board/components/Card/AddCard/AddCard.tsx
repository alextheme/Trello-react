import React from 'react';
import './addCard.scss';
import { getObjectQS, closeInputField, setFocusToElement } from '../../../../../common/scripts/commonFunctions';

interface TypeState {
  nameCard: string;
}

class AddCard extends React.Component<any, TypeState> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(props: any) {
    super(props);
    this.state = {
      nameCard: '',
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
    document.addEventListener('keypress', () => {});
    document.addEventListener('click', () => {});
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleInput = (e: any): void => {
    this.setState((state: TypeState) => ({ ...state, nameCard: e.target.value }));
  };

  openInputField = (): void => {
    setFocusToElement('add-card__input-field');
    const btn = getObjectQS('.add-class__add-btn-start');
    const fieldInput = getObjectQS('.add-card__input-box');
    if (btn && fieldInput) {
      // @ts-ignore
      btn.style.display = 'none';
      // @ts-ignore
      fieldInput.style.display = 'block';
    }
  };

  closeInputField = (): void => {
    const btn = getObjectQS('.add-class__add-btn-start');
    const fieldInput = getObjectQS('.add-card__input-box');
    if (btn && fieldInput) {
      // @ts-ignore
      btn.style.display = 'block';
      // @ts-ignore
      fieldInput.style.display = 'none';
    }
  };

  render(): JSX.Element {
    return (
      <div className="add-card__container">
        <div className="add-card__input-box">
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

        <button className="add-card__add-btn-start" onClick={this.openInputField}>
          + Добавить еще одну карточку
        </button>
      </div>
    );
  }
}

export default AddCard;
