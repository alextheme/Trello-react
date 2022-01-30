import { ReactNode } from 'react';
import { IBoardContent, IBoards, IListContent } from '../../../../common/interfaces/Interfaces';

export interface IFuncType {
  deleteCrd: (
    boardId: number,
    cardId: number,
    listContent?: IListContent | null,
    listId?: number | undefined
  ) => Promise<boolean>;
  createCrd: (
    boardId: number,
    listContent: IListContent,
    position: number,
    title: string
  ) => Promise<number | undefined>;
  editCrd: (
    board_id: number,
    list_id: number,
    card_id: number,
    text: string,
    textType: 'title' | 'description'
  ) => Promise<boolean>;
  moveCards: (boardId: number, data: { id: number; position: number; list_id: number }[]) => Promise<boolean>;
  update: (boardId: number) => Promise<void>;
}

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
}

export interface PopupCardDialogState {
  boardId: number;
  listId: number;
  positionCard: number;
  boardsList: IBoards | null;
  boardData: IBoardContent;
}
