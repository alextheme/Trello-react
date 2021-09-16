import React from 'react';
import { connect } from 'react-redux';
import './addCard.scss';
import { closeInputField, getHtmlElementByID, setFocusToElement } from '../../../../common/scripts/commonFunctions';
import { addCard, getBoard } from '../../../../store/modules/board/actions';

interface TypeProps {
  listId: string;
  boardId: string;
  getBoard: any;
}

interface TypeState {
  nameCard: string;
  openInputAddCard: boolean;
  inputId: string;
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
      inputId: '0',
    };
  }

  componentDidMount(): void {
    this.globalValue.mounted = true;

    this.setState((state: TypeState) => ({ ...state, inputId: `add-card__input-field-${this.props.listId}` }));

    document.addEventListener('click', (e) => {
      const htmlElements = [
        '.lists-list',
        '.lists-element',
        '.lists',
        '.add-card__input-box',
        this.state.inputId, // id
        '.add-card__btn-box',
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
      const inputField = getHtmlElementByID(this.state.inputId);
      if (inputField === document.activeElement && e.key === 'Enter') {
        // @ts-ignore
        this.addNewCard(e.target.dataset.list_id);
      }
    });
  }

  componentWillUnmount(): void {
    this.globalValue.mounted = false;
  }

  handleAddNewCard = (e: any): void => {
    this.addNewCard(e.target.dataset.list_id);
  };

  addNewCard = async (listId: string): Promise<void> => {
    const { ...p } = this.props;
    const { ...s } = this.state;
    await addCard(p.boardId, s.nameCard, +listId, 1);
    await p.getBoard(p.boardId);
    if (this.globalValue.mounted) {
      this.setState((state) => ({ ...state, openInputAddCard: false, nameCard: '' }));
    }
  };

  updateBoard = (): void => {
    // @ts-ignore
    // console.log('P: ', this.props.board.lists[1631683944925].cards);
  };

  inputOnChangeHandler = (e: any): void => {
    this.setState((state: TypeState) => ({ ...state, nameCard: e.target.value }));
  };

  onClickButtonOpenInputField = (): void => {
    setFocusToElement(this.state.inputId);
    setTimeout(() => {
      this.setState((state: TypeState) => ({ ...state, openInputAddCard: true }));
    }, 0);
  };

  onClickButtonCloseInputField = (): void => {
    this.setState((state: TypeState) => ({ ...state, openInputAddCard: false }));
  };

  render(): JSX.Element {
    return (
      <div className="add-card__container">
        <div className="add-card__input-box" style={{ display: this.state.openInputAddCard ? 'block' : 'none' }}>
          <input
            type="text"
            className="add-card__input-field"
            data-list_id={this.props.listId}
            id={this.state.inputId}
            placeholder="Ввести заголовок для этой карточки"
            autoComplete="off"
            value={this.state.nameCard}
            onChange={this.inputOnChangeHandler}
          />
          <div className="add-card__btn-box">
            <button className="add-card__add-btn-run" data-list_id={this.props.listId} onClick={this.handleAddNewCard}>
              Добавить карточку
            </button>
            <div className="add-card__close-btn" onClick={this.onClickButtonCloseInputField} />
          </div>
        </div>

        <button
          className="add-card__add-btn-start"
          onClick={this.onClickButtonOpenInputField}
          style={{ display: this.state.openInputAddCard ? 'none' : 'block' }}
        >
          + Добавить еще одну карточку
        </button>
      </div>
    );
  }
}

// const mapStateToProps = (state: any): void => ({ ...state.board });

export default connect(null, { getBoard })(AddCard);
