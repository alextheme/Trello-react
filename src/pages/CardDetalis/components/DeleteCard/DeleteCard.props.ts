import { ReactNode } from 'react';
import { IBoardContent, IListContent } from '../../../../common/interfaces/Interfaces';

export interface ICurrentValue {
  src: {
    cardId: number;
    positionCard: number;
    listId: number;
    boardId: number;
    boardData: IBoardContent;
  };
}

export interface PopupCardDialogProps extends ICurrentValue {
  children?: ReactNode;
  closeCardDialog: () => void;
  closePopup: () => void;
  deleteCrd: (
    boardId: number,
    cardId: number,
    listContent?: IListContent | null,
    listId?: number | undefined
  ) => Promise<boolean>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PopupCardDialogState {}
