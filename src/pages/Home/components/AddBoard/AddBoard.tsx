/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import './addBoard.scss';
import { connect } from 'react-redux';
import { addBoard, getBoards } from '../../../../store/modules/boards/actions';
import { checkInputText, setFocusToElement, toggleClassElement } from '../../../../common/scripts/commonFunctions';
import { showErrText, toggleClassBody } from './functionsAddBoard';

type PropsType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/ban-ts-comment
  getBoards: any;
};

type StateType = { nameNewBoard: string };

class AddBoard extends React.Component<PropsType, StateType> {
  globalValue: {
    mounted: boolean | undefined;
    isOpenPopap: boolean | undefined;
  } = {
    mounted: undefined,
    isOpenPopap: undefined,
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      nameNewBoard: '',
    };

    this.closedPopap = this.closedPopap.bind(this);
    this.openPopap = this.openPopap.bind(this);
    this.addNewBoard = this.addNewBoard.bind(this);
  }

  componentDidMount(): void {
    this.globalValue.mounted = true;

    document.addEventListener('click', (e) => {
      if (this.globalValue.mounted) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!this.isOpenPopap && e.target.classList.contains('add-board__popapp')) {
          this.closedPopap();
        }
      }
    });
    document.addEventListener('keypress', (e) => {
      if (this.globalValue.isOpenPopap && e.key === 'Enter') {
        e.preventDefault();
        this.addNewBoard();
      }
    });
  }

  componentWillUnmount(): void {
    this.globalValue.mounted = false;
  }

  inputOnChangeHandler = (e: { target: { value: string } }): void => {
    this.setState({ nameNewBoard: e.target.value });
  };

  closedPopap = (): void => {
    this.globalValue.isOpenPopap = toggleClassElement('.add-board__popapp', 'display-none');
    toggleClassBody('overflowHidden');
    this.setState({ nameNewBoard: '' });
  };

  openPopap = (): void => {
    this.globalValue.isOpenPopap = toggleClassElement('.add-board__popapp', 'display-none');
    toggleClassBody('overflowHidden');
    setFocusToElement('addNewBoardInpt');
  };

  // Check data input
  checkInputData = (): boolean => {
    const { status: statusErrorMessage, res, errSymbols } = checkInputText(this.state.nameNewBoard);

    if (!statusErrorMessage) {
      if (res === 'empty') {
        showErrText('add-board-error-text', 2000, 'Поле не может быть пустым.');
        return false;
      }

      if (res === 'forbidden') {
        setFocusToElement('addNewBoardInpt');
        showErrText('add-board-error-text', 2000, `Эти символы не допустимы: \n${errSymbols}`);
        return false;
      }
    }

    return true;
  };

  addNewBoard = async (): Promise<void> => {
    if (!this.checkInputData()) return;
    console.log('98: ', '??');

    await addBoard(this.state.nameNewBoard);
    await this.props.getBoards();
    this.closedPopap();
  };

  render(): JSX.Element {
    return (
      <div className="add-board">
        <div className="add-board__popapp display-none">
          <div className="add-board__container">
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button className="add-board__close-btn" onClick={this.closedPopap} />
            <div className="add-board__input-container">
              <div id="add-board-error-text" className="add-board__errorHint" />
              <input
                id="addNewBoardInpt"
                type="text"
                autoComplete="off"
                value={this.state.nameNewBoard}
                onChange={this.inputOnChangeHandler}
              />
            </div>
            <button className="add-board__create-new-board" onClick={this.addNewBoard}>
              Создать доску
            </button>
          </div>
        </div>

        <button className="create-new-board-begin" onClick={this.openPopap}>
          + Создать доску
        </button>
      </div>
    );
  }
}

export default connect(null, { getBoards })(AddBoard);
