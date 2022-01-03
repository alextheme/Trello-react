import { ActionType } from './action-types';

export interface IBoard {
  id: number;
  title: string;
}

interface IUpdateBoardsAction {
  type: ActionType.UPDATE_BOARD;
  payload: IBoard[];
}

export type Action = IUpdateBoardsAction;
