import React from 'react';
import './addBoard.scss';
import { connect } from 'react-redux';
import { addBoard, getBoards } from '../../../../store/modules/boards/action-creators';
import { checkInputText, setFocusToElement, toggleClassElement } from '../../../../common/scripts/commonFunctions';
import { showErrText, toggleClassBody } from './functionsAddBoard';

interface PropsType {
  getBrds?: () => Promise<void>;
  addBrd?: (newTitleBoard: string) => Promise<void>;
}

interface StateType {
  nameNewBoard: string;
  clickContainerPopap: boolean;
}

interface GlobalValue {
  mounted: boolean;
  isOpenPopap: boolean;
  clickedContainerPopap: boolean;
}

class AddBoard extends React.Component<PropsType, StateType> {
  globalValue: GlobalValue = {
    mounted: false,
    isOpenPopap: false,
    clickedContainerPopap: false,
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      nameNewBoard: '',
      clickContainerPopap: false,
    };

    this.closedPopap = this.closedPopap.bind(this);
    this.openPopap = this.openPopap.bind(this);
    this.addNewBoard = this.addNewBoard.bind(this);
  }

  componentDidMount(): void {
    this.globalValue.mounted = true;

    document.addEventListener('keypress', (e: KeyboardEvent) => {
      if (this.globalValue.isOpenPopap && e.key === 'Enter') {
        e.preventDefault();
        this.createNewBoard();
      }
    });
  }

  componentWillUnmount(): void {
    this.globalValue.mounted = false;
    document.removeEventListener('keypress', (e: KeyboardEvent) => {
      if (this.globalValue.isOpenPopap && e.key === 'Enter') {
        e.preventDefault();
        this.createNewBoard();
      }
    });
  }

  inputOnChangeHandler = (e: { target: { value: string } }): void => {
    this.setState({ nameNewBoard: e.target.value });
  };

  closedPopap = (): void => {
    this.globalValue.isOpenPopap = toggleClassElement('.add-board__popapp', 'display-none');
    toggleClassBody('overflowHidden');
  };

  openPopap = (): void => {
    this.globalValue.isOpenPopap = toggleClassElement('.add-board__popapp', 'display-none');
    toggleClassBody('overflowHidden');
    setFocusToElement('addNewBoardInpt');
  };

  // Check data input
  checkInputData = (): boolean => {
    const { nameNewBoard } = this.state;
    const { status: statusErrorMessage, res, errSymbols } = checkInputText(nameNewBoard);

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

  addNewBoard = (): void => {
    this.createNewBoard();
  };

  createNewBoard = async (): Promise<void> => {
    if (!this.checkInputData()) return;
    this.closedPopap();

    const { nameNewBoard } = this.state;
    const { addBrd, getBrds } = this.props;

    if (addBrd && getBrds) {
      await addBrd(nameNewBoard);
      await getBrds();
      this.setState((state) => ({ ...state, nameNewBoard: '' }));
    }
  };

  // close element for click out element
  popapClick = (): void => {
    if (this.globalValue.clickedContainerPopap) this.globalValue.clickedContainerPopap = false;
    else this.closedPopap();
  };

  popapContainerClick = (): void => {
    this.globalValue.clickedContainerPopap = true;
  };

  render(): JSX.Element {
    const { nameNewBoard } = this.state;

    return (
      <div className="add-board">
        <div className="add-board__popapp display-none" onClick={this.popapClick}>
          <div className="add-board__container" onClick={this.popapContainerClick}>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button className="add-board__close-btn" onClick={this.closedPopap} />
            <div className="add-board__input-container">
              <div id="add-board-error-text" className="add-board__errorHint" />
              <input
                id="addNewBoardInpt"
                type="text"
                autoComplete="off"
                value={nameNewBoard}
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

export default connect(null, { getBrds: getBoards, addBrd: addBoard })(AddBoard);
