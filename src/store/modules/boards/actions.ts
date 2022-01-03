import { ActionType } from './action-types';

export interface IBoard {
  id: number;
  title: string;
}

interface IUpdateBoardsAction {
  type: ActionType.UPDATE_BOARDS;
  payload: IBoard[];
}

interface IClearBoardsAction {
  type: ActionType.CLEAR_BOARDS;
}

export type Action = IUpdateBoardsAction | IClearBoardsAction;
