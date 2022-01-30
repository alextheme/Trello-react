import { Dispatch } from 'redux';
import instance from '../../../api/request';
import { ActionType as ActionTypeLoading } from '../loading/reducer';
import { ActionType as ActionTypeError } from '../error/reducer';

export const assignOrRemoveUsersToOrFromCard =
  (boardId: number, cardId: number, updateBoard: () => void, add: number[], remove: number[]) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      const result = (await instance.put(`/board/${boardId}/card/${cardId}/users`, {
        add,
        remove,
      })) as { result: string };

      if (result.result === 'Updated') {
        updateBoard();
        return !0;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log('edit card error: ', e);
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось изменить описание карточки.', e.message] });
      return false;
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }

    return !1;
  };
