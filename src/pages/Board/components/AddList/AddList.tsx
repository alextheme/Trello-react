import React from 'react';
import './addList.scss';
import { connect } from 'react-redux';
import { getBoard, addList } from '../../../../store/modules/board/actions';
import {
  checkInputText,
  setFocusToElement,
  closeInputField,
  getHtmlElementByID,
  getHtmlElementQS,
} from '../../../../common/scripts/commonFunctions';

interface TypeState {
  nameList: string;
  openInput: boolean;
}

interface TypeProps {
  boardId: number;
  position: number;
  getBoard: any;
}

class AddList extends React.Component<TypeProps, TypeState> {
  globalValue: {
    mounted: boolean | undefined;
    nameRunButton: string | undefined;
    bgRunButton: string | undefined;
    timeOut: NodeJS.Timeout | null | undefined;
  } = {
    mounted: undefined,
    nameRunButton: undefined,
    bgRunButton: undefined,
    timeOut: undefined,
  };

  constructor(props: TypeProps) {
    super(props);
    this.state = {
      nameList: '',
      openInput: false,
    };

    this.handlerAddNewList = this.handlerAddNewList.bind(this);
    this.onInputHandler = this.onInputHandler.bind(this);
  }

  componentDidMount(): void {
    this.globalValue.mounted = true;

    const inputBtn = getHtmlElementQS('.add-list__add-btn-run');

    if (inputBtn) {
      this.globalValue.nameRunButton = inputBtn.innerText;
      this.globalValue.bgRunButton = inputBtn.style.background;
    }

    document.addEventListener('keypress', (e) => {
      const inputField = getHtmlElementByID('add-list__input-field1');
      if (this.globalValue.mounted) {
        if (inputField === document.activeElement && e.key === 'Enter') {
          this.handlerAddNewList();
        }
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

      if (this.globalValue.mounted) {
        if (closeInputField(classes, e.target)) {
          this.closeFieldInputHandler();
        }
      }
    });
  }

  componentWillUnmount(): void {
    this.globalValue.mounted = false;
  }

  onInputHandler = (e: any): void => {
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

      if (this.globalValue.timeOut) {
        clearTimeout(this.globalValue.timeOut);
      }
      this.globalValue.timeOut = setTimeout(() => {
        inputBtn.innerText = this.globalValue.nameRunButton || '';
        inputBtn.style.background = this.globalValue.bgRunButton || '';
      }, 2000);
    }
  };

  buttonHandlerOpenFieldInput = (): void => {
    setFocusToElement('add-list__input-field1');
    this.setState((state: TypeState) => ({ ...state, openInput: true }));
  };

  closeFieldInputHandler = (): void => {
    this.setState((state: TypeState) => ({ ...state, openInput: false }));
  };

  handlerAddNewList = (): void => {
    if (this.state.nameList === '') {
      this.showMessageInBottom(0, '');
      return;
    }

    setTimeout(async () => {
      const { ...a } = this.props;
      await addList(a.boardId, this.state.nameList, a.position);
      this.setState((state: any) => ({ ...state, nameList: '' }));
      await a.getBoard(a.boardId);
      await this.closeFieldInputHandler();
    }, 10);
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
            onInput={this.onInputHandler}
            value={this.state.nameList}
          />
          <div className="add-list__btn-box">
            <button className="add-list__add-btn-run" onClick={this.handlerAddNewList}>
              Добавить список
            </button>
            <div className="add-list__close-btn" onClick={this.closeFieldInputHandler} />
          </div>
        </div>

        <button
          className="add-list__add-btn-start"
          onClick={this.buttonHandlerOpenFieldInput}
          style={{ display: this.state.openInput ? 'none' : 'inline-block' }}
        >
          + Добавить еще одну колонку
        </button>
      </div>
    );
  }
}

export default connect(null, { getBoard })(AddList);
