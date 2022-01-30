/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dispatch } from 'redux';
import instance from '../../../api/request';
import { ActionType } from './action-types';
import { ActionType as ActionTypeBoard } from '../board/action-types';
import { ActionType as ActionTypeBoards } from '../boards/action-types';
import { ActionType as ActionTypeLoading } from '../loading/reducer';
import { ActionType as ActionTypeError } from '../error/reducer';
import { removeFromSessionStorageToken, setInSessionStorageToken } from './session-storage-actions';

export const authorization =
  (email: string, password: string) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeLoading.LOGGING });

    try {
      const result = (await instance.post('/login', { email, password })) as {
        result: string;
        token: string;
      };

      if (result && result.result === 'Authorized') {
        setInSessionStorageToken(result.token);
        dispatch({ type: ActionType.AUTORIZATION });
      } else {
        removeFromSessionStorageToken();
        dispatch({ type: ActionType.LOGOUT });
      }
    } catch (err) {
      // @ts-ignore
      dispatch({ type: ActionTypeError.ERROR, payload: [err.message, 'Не удалось авторизироваться'] });
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
      dispatch({ type: ActionTypeLoading.LOGGING_END });
    }
  };

export const registration =
  (email: string, password: string) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeLoading.LOGGING });

    try {
      const result = (await instance.post('/user', { email, password })) as {
        result: string;
        id: number;
      };

      if (result && result.result === 'Created') {
        return true;
      }
    } catch (err) {
      // @ts-ignore
      dispatch({ type: ActionTypeError.ERROR, payload: [err.message, 'Не удалось создать пользователя'] });
      return false;
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
      dispatch({ type: ActionTypeLoading.LOGGING_END });
    }
    return false;
  };

export const logOut =
  () =>
  (dispatch: Dispatch): void => {
    removeFromSessionStorageToken();
    dispatch({ type: ActionType.LOGOUT });
    dispatch({ type: ActionTypeBoard.CLEAR_BOARD });
    dispatch({ type: ActionTypeBoards.CLEAR_BOARDS });
  };
