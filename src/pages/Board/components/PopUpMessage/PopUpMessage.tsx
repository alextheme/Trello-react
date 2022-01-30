import React from 'react';
import './popUpMessage.scss';

type TypeProps = {
  statusErrorText: boolean;
  res: string;
  errSymbols: string;
  parentId: string;
};

const PopUpMessage: React.FC<TypeProps> = ({ statusErrorText, res, errSymbols, parentId }) => {
  const plural = errSymbols.length > 1;
  const parent = document.getElementById(parentId);
  const stylePosition: { top: number; left: number } = { top: 0, left: 0 };
  if (parent) {
    const { top, left, height } = parent.getBoundingClientRect();
    stylePosition.top = top + height + 8;
    stylePosition.left = left;
  }

  if (statusErrorText) {
    return (
      <div className="pop-up-message" style={{ ...stylePosition }}>
        <div className="triangle" />
        <div className="message">
          {res === 'empty' ? (
            <p>Поле не может быть пустым</p>
          ) : (
            <>
              <p>{`Эт${plural ? 'ти' : 'от'} символ${plural ? 'ы' : ''} не разрешен${plural ? 'ы' : ''}.`}</p>
              <p>{errSymbols}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default PopUpMessage;
