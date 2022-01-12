/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import './HeaderPopupCardDialog.modules.scss';
import { HeaderPopupCardDialogProps } from './HeaderPopupCardDialog.props';

interface IState {}

class HeaderPopupCardDialog extends React.Component<HeaderPopupCardDialogProps, IState> {
  render(): JSX.Element {
    const { title, classname } = this.props;

    return (
      <div className={cn('dialog-header', classname)}>
        <span className="title">{title}</span>
        <span className="close-btn" aria-label="Закрыть диалог добавления участников">
          <FontAwesomeIcon icon={['fas', 'times']} />
        </span>
      </div>
    );
  }
}

export default HeaderPopupCardDialog;
