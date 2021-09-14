import React from 'react';
import './addList.scss';
import { connect } from 'react-redux';
import { addList } from '../../../../store/modules/board/actions';
import { checkInputText, setFocusToElement, closeInputField } from '../../../../common/scripts/commonFunctions';
import gListVar from './constantsList';

interface TypeState {
  nameList: string;
  openInput: boolean;
}

interface TypeProps {
  boardId: number;
  position: number;
  updateBoard: any;
}

class AddList extends React.Component<TypeProps, TypeState> {
  constructor(props: TypeProps) {
    super(props);
    this.state = {
      nameList: '',
      openInput: false,
    };
    this.handleAddNewList = this.handleAddNewList.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount(): void {
    const inputBtn: HTMLElement | null = document.querySelector('.add-list__add-btn-run');
    const inputField: HTMLElement | null = document.getElementById('add-list__input-field1');

    if (inputBtn) {
      gListVar.nameRunButton = inputBtn.innerText;
      gListVar.bgRunButton = inputBtn.style.background;
    }

    document.addEventListener('keypress', (e) => {
      if (inputField === document.activeElement && e.key === 'Enter') {
        this.handleAddNewList();
      }
    });

    document.addEventListener('click', (e) => {
      const classes = [
        '.add-list__add-btn-start',
        '.add-list__edit-container',
        '.add-list__btn-box',
        '.add-list__add-btn-run',
        '.add-list__close-btn',
        'add-list__input-field1', // id
      ];

      if (closeInputField(classes, e.target)) {
        this.handleCloseFieldInput();
      }
    });
  }

  componentWillUnmount(): void {
    document.addEventListener('keypress', () => {});
    document.addEventListener('click', () => {});
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleInput = (e: any): void => {
    e.preventDefault();
    const { value } = e.target;
    const check = checkInputText(value);
    if (check.res < 0) {
      this.setState((state: TypeState) => ({ ...state, nameList: value }));
    } else {
      this.errorHandling(1, check.errSymbols);
    }
  };

  errorHandling = (numberError: number, errorSymbols?: string): void => {
    if (numberError === 1) {
      this.showMessageInBottom(numberError, errorSymbols);
    }
  };

  showMessageInBottom = (numberError: number, errorSymbols?: string): void => {
    const inputBtn: HTMLElement | null = document.querySelector('.add-list__add-btn-run');

    if (inputBtn) {
      inputBtn.innerText =
        numberError === 0 ? 'The input field is empty' : `character ' ${errorSymbols} ' is not allowed`;
      inputBtn.style.background = 'red';

      if (gListVar.timeOut) {
        clearTimeout(gListVar.timeOut);
      }
      gListVar.timeOut = setTimeout(() => {
        inputBtn.innerText = gListVar.nameRunButton;
        inputBtn.style.background = gListVar.bgRunButton;
      }, 2000);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleOpenFieldInput = (): void => {
    setFocusToElement('add-list__input-field1');
    this.setState((state: TypeState) => ({ ...state, openInput: true }));
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleCloseFieldInput = (): void => {
    this.setState((state: TypeState) => ({ ...state, openInput: false }));
  };

  handleAddNewList = (): void => {
    const nameLst = this.state.nameList;
    this.setState((state: any) => ({ ...state, nameList: '' }));

    if (nameLst === '') {
      this.showMessageInBottom(0, '');
      return;
    }

    // @ts-ignore
    addList(this.props.boardId, nameLst, this.props.position);
    // @ts-ignore
    this.props.updateBoard(this.props.boardId);
    this.handleCloseFieldInput();
  };

  render(): JSX.Element {
    return (
      <div className="add-list">
        <div className="add-list__edit-container" style={{ display: this.state.openInput ? 'block' : 'none' }}>
          <input
            id="add-list__input-field1"
            type="text"
            placeholder="ввести заголовок списка"
            autoComplete="off"
            onInput={this.handleInput}
            value={this.state.nameList}
          />
          <div className="add-list__btn-box">
            <button className="add-list__add-btn-run" onClick={this.handleAddNewList}>
              Добавить список
            </button>
            <div className="add-list__close-btn" onClick={this.handleCloseFieldInput} />
          </div>
        </div>

        <button
          className="add-list__add-btn-start"
          onClick={this.handleOpenFieldInput}
          style={{ display: this.state.openInput ? 'none' : 'inline-block' }}
        >
          + Добавить еще одну колонку
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state: any): void => ({ ...state.board });

export default connect(mapStateToProps, null)(AddList);
