/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import { AnyAction, Dispatch } from "redux";
import { IBoardContent, IBoards, IListContent } from '../../../../common/interfaces/Interfaces';


export interface IFuncType {
  createCrd: (boardId: number, listContent: IListContent, position: number, title: string) => Promise<number | undefined>;
  editCrd: (board_id: number, list_id: number, card_id: number, text: string, textType: 'title' | 'description') => Promise<boolean>;
  copyMembersInCard: (boardId: number, cardId: number, updateBoard: () => void, add: number[], remove: number[]) => Promise<boolean>; 
};

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
  titleCard: string;
  copyDescription: boolean;
  copyMembers: boolean;
}
