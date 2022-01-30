import { Dispatch } from 'redux';
import instance from '../../../api/request';
import { ActionType } from './action-types';
import { ActionType as ActionTypeLoading } from '../loading/reducer';
import { ActionType as ActionTypeError } from '../error/reducer';
import { IBoardCover } from '../../../common/interfaces/Interfaces';

export const getBoards =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      const data = (await instance.get('/board')) as { boards: IBoardCover[] };
      dispatch({ type: ActionType.UPDATE_BOARDS, payload: data.boards });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const { message } = error;

      dispatch({
        type: ActionTypeError.ERROR,
        payload: ['Не удалось получить данные о досках.', message],
      });
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

export const addBoard =
  (newTitleBoard: string) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      const response = (await instance.post('/board', {
        title: newTitleBoard,
      })) as { id: number; result: string };

      if (response.result !== 'Created') {
        throw new Error('Не удалось создать доску.');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось создать доску.', error.message] });
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

export const deleteBoard =
  (boardId: number) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      const response = (await instance.delete(`/board/${boardId}`)) as { result: string };

      if (response.result !== 'Deleted') {
        throw new Error('Не удалось удалить эту доску.');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось удалить эту доску.', error.message] });
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };
