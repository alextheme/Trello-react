import { ILoadingReducer } from '../../../common/interfaces/Interfaces';

export enum ActionType {
  LOADING = 'LOADING',
  LOADING_END = 'LOADING_END',
  LOGGING = 'LOGGING',
  LOGGING_END = 'LOGGING_END',
}

export type Action =
  | { type: ActionType.LOADING }
  | { type: ActionType.LOADING_END }
  | { type: ActionType.LOGGING }
  | { type: ActionType.LOGGING_END };

const reducer = (state: ILoadingReducer = { loading: false, logging: false }, action: Action): ILoadingReducer => {
  switch (action.type) {
    case ActionType.LOADING:
      return { ...state, loading: true };
    case ActionType.LOADING_END:
      return { ...state, loading: false };
    case ActionType.LOGGING:
      return { ...state, logging: true };
    case ActionType.LOGGING_END:
      return { ...state, logging: false };
    default: {
      return { ...state };
    }
  }
};

export default reducer;
