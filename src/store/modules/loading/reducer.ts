import { ILoadingReducer } from '../../../common/interfaces/Interfaces';

/* eslint-disable no-console */
export enum ActionType {
  LOADING = 'LOADING',
  LOADING_END = 'LOADING_END',
}

export type Action = { type: ActionType.LOADING } | { type: ActionType.LOADING_END };

const reducer = (state: ILoadingReducer = { loading: false }, action: Action): ILoadingReducer => {
  switch (action.type) {
    case ActionType.LOADING:
      return { loading: true };
    case ActionType.LOADING_END:
      return { loading: false };
    default: {
      return { ...state };
    }
  }
};

export default reducer;
