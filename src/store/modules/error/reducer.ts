import { IErrorReducer } from '../../../common/interfaces/Interfaces';

export enum ActionType {
  ERROR = 'ERROR',
  ERROR_CLEAR = 'ERROR_CLEAR',
}

export interface Error {
  type: ActionType.ERROR;
  payload: string[];
}
export interface ErrorClear {
  type: ActionType.ERROR_CLEAR;
}

type Action = Error | ErrorClear;

export const errorClear = (): { type: string } => ({ type: ActionType.ERROR_CLEAR });

const reducer = (state: IErrorReducer = { errorMessages: [] }, action: Action): IErrorReducer => {
  switch (action.type) {
    case ActionType.ERROR:
      return { errorMessages: action.payload };
    case ActionType.ERROR_CLEAR:
      return { errorMessages: [] };
    default: {
      return { ...state };
    }
  }
};

export default reducer;
