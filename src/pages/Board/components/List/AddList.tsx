/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { connect } from 'react-redux';
import { addList } from '../../../../store/modules/board/action-creators';
import { checkInputText, isCloseInputField } from '../../../../common/scripts/commonFunctions';
import { BoardContext, IBoardContext } from '../../boardContext';

interface TypeState {
  nameList: string;
  openInput: boolean;
}

interface TypeProps {
  boardId: number;
  position: number;
  listAdd: (boardId: number, title: string, position: number) => void;
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

  inputRef: React.RefObject<HTMLInputElement>;

  constructor(props: TypeProps) {
    super(props);
    this.state = {
      nameList: '',
      openInput: false,
    };

    this.inputRef = React.createRef();

    this.handlerAddNewList = this.handlerAddNewList.bind(this);
    this.onInputHandler = this.onInputHandler.bind(this);
  }

  componentDidMount(): void {
    this.globalValue.mounted = true;

    const inputBtn: HTMLElement | null = document.querySelector('.add-list__add-btn-run');

    if (inputBtn) {
      this.globalValue.nameRunButton = inputBtn.innerText;
      this.globalValue.bgRunButton = inputBtn.style.background;
    }

    document.addEventListener('keypress', (e) => {
      const inputField = document.getElementById('add-list__input-field1');
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
        if (isCloseInputField(classes, e.target)) {
          this.closeFieldInputHandler();
        }
      }
    });
  }

  componentWillUnmount(): void {
    this.globalValue.mounted = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onInputHandler = (e: any): void => {
    e.preventDefault();
    const { value } = e.target;
    const { status, errSymbols } = checkInputText(value);
    if (status) {
      this.setState((state: TypeState) => ({ ...state, nameList: value }));
    } else {
      this.errorHandling(1, errSymbols);
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
    const node = this.inputRef.current;
    if (node) {
      node.focus();
      node.select();
    }

    this.setState((state: TypeState) => ({ ...state, openInput: true }));
  };

  closeFieldInputHandler = (): void => {
    this.setState((state: TypeState) => ({ ...state, openInput: false }));
  };

  handlerAddNewList = (): void => {
    const { nameList } = this.state;
    if (nameList === '') {
      this.showMessageInBottom(0, '');
      return;
    }

    setTimeout(async () => {
      const { listAdd, ...a } = this.props;
      await listAdd(a.boardId, nameList, a.position);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.setState((state: any) => ({ ...state, nameList: '' }));
      const { updateBoard } = this.context as IBoardContext;
      await updateBoard();
      this.closeFieldInputHandler();
    }, 10);
  };

  render(): JSX.Element {
    const { openInput, nameList } = this.state;
    return (
      <div className="board__add-list-btn">
        <div className="add-list">
          <div className="add-list__edit-container" style={{ display: openInput ? 'block' : 'none' }}>
            <input
              ref={this.inputRef}
              id="add-list__input-field1"
              type="text"
              placeholder="ввести заголовок списка"
              autoComplete="off"
              onInput={this.onInputHandler}
              value={nameList}
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
            style={{ display: openInput ? 'none' : 'inline-block' }}
          >
            + Добавить еще одну колонку
          </button>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = { listAdd: addList };

AddList.contextType = BoardContext;

export default connect(null, mapDispatchToProps)(AddList);
