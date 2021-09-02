import React, { useState } from 'react';
import './AddBoard.scss';

type TypeProps = {
  onClick: (nameBoard: string) => void;
};

const AddBoard = (props: TypeProps): JSX.Element => {
  const [state, setState] = useState({ nameNewBoard: '', isOpenPopap: false });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any): void => {
    setState({ ...state, nameNewBoard: e.target.value });
  };
  const closedPopap = (): void => {
    setState({ ...state, isOpenPopap: false });
    document.body.classList.remove('bodyStyle');
  };
  const openPopap = (): void => {
    setState({ ...state, isOpenPopap: true, nameNewBoard: '' });
    document.body.classList.add('bodyStyle');
  };
  const addNewBoard = (): void => {
    if (state.nameNewBoard !== '') {
      props.onClick(state.nameNewBoard);
      setState({ ...state, isOpenPopap: false, nameNewBoard: '' });
    }
  };

  const elemPopap = document.querySelector('.add-board__popapp');
  if (elemPopap) {
    elemPopap.addEventListener('click', (e: any) => {
      if (e.target.classList.contains('add-board__popapp')) {
        setState({ ...state, isOpenPopap: false });
      }
    });
  }

  return (
    <div className="add-board">
      <div className={`add-board__popapp ${state.isOpenPopap ? 'display-flex' : 'display-none'}`}>
        <div className="add-board__container">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button className="add-board__close-btn" onClick={closedPopap} />
          <input type="text" value={state.nameNewBoard} onChange={handleChange} />
          <button className="add-board__create-new-board" onClick={addNewBoard}>
            Создать доску
          </button>
        </div>
      </div>

      <button className="create-new-board-begin" onClick={openPopap}>
        + Создать доску
      </button>
    </div>
  );
};

export default AddBoard;
