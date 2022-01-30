import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import './HeaderPopupCardDialog.modules.scss';
import { HeaderPopupCardDialogProps } from './HeaderPopupCardDialog.props';

const HeaderPopupCardDialog: React.FC<HeaderPopupCardDialogProps> = ({ ...props }) => {
  const { title, classname } = props;
  return (
    <div className={cn('dialog-header', classname)}>
      <span className="title">{title}</span>
      <span className="close-btn" aria-label="Закрыть диалог добавления участников">
        <FontAwesomeIcon icon={['fas', 'times']} />
      </span>
    </div>
  );
};

export default HeaderPopupCardDialog;
