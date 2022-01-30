/* eslint-disable no-console */
import { Dispatch } from 'redux';
import instance from '../../../api/request';
import { ActionType } from './action-types';
import { ActionType as ActionTypeBoard } from '../board/action-types';
import { ActionType as ActionTypeBoards } from '../boards/action-types';
import { removeFromSessionStorageToken, setInSessionStorageToken } from './session-storage-actions';

export const authorization =
  (email: string, password: string) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      const resultAutorization = (await instance.post('/login', { email, password })) as {
        result: string;
        token: string;
      };

      if (resultAutorization && resultAutorization.result === 'Authorized') {
        setInSessionStorageToken(resultAutorization.token);
        dispatch({ type: ActionType.AUTORIZATION });
      } else {
        removeFromSessionStorageToken();
        dispatch({ type: ActionType.LOGOUT });
      }
    } catch (err) {
      console.log('Error authorized: ', err);
    }
  };

export const logOut =
  () =>
  (dispatch: Dispatch): void => {
    removeFromSessionStorageToken();
    dispatch({ type: ActionType.LOGOUT });
    dispatch({ type: ActionTypeBoard.CLEAR_BOARD });
    dispatch({ type: ActionTypeBoards.CLEAR_BOARDS });
  };
