import { ActionType } from './action-types';

interface IAutorizationAction {
  type: ActionType.AUTORIZATION;
  payload: string;
}

interface ILogOutAction {
  type: ActionType.LOGOUT;
}

interface IAuthorizedUserFillData {
  type: ActionType.AUTHORIZED_USER_FILL_THE_DATA;
  payload: { userName: string; userId: number };
}

export type Action = IAutorizationAction | IAuthorizedUserFillData | ILogOutAction;
