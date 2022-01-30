import { ActionType } from './action-types';

interface IAutorizationAction {
  type: ActionType.AUTORIZATION;
}

interface ILogOutAction {
  type: ActionType.LOGOUT;
}

export type Action = IAutorizationAction | ILogOutAction;
