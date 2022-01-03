/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { AnyAction, Dispatch } from "redux";
import { IBoardContent, IBoards } from '../../../../common/interfaces/Interfaces';


export interface IFuncType {
  delCrd: (boardId: number, cardId: number) => Promise<void>;
  createCrd: (boardId: number, title: string, list_id: number, position: number) => Promise<void>;
  editCrd: (board_id: number, list_id: number, card_id: number, description: string) => Promise<boolean>;
  moveCards: (boardId: number, data: { id: number; position: number; list_id: number; }[]) => Promise<void>;
  update: (boardId: number) => Promise<void>;
};

export interface ICurrentValue {
  startingValues: {
    cardId: number;
    listId: number;
    boardId: number;
    boardData: IBoardContent;
  };
}

export interface PopupCardDialogProps extends ICurrentValue {
  children?: ReactNode;
  closeCardDialog: () => void;
}

export interface PopupCardDialogState {
  boardId: number;
  listId: number;
  cardId: number;
  boardsList: IBoards | null;
  currentBoardData: IBoardContent;
}
