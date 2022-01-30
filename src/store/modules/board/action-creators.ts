/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'redux';
import instance from '../../../api/request';
import { IBoardContent, IListContent, IValuesNewCardPositions } from '../../../common/interfaces/Interfaces';
import { ActionType } from './action-types';
import { ActionType as ActionTypeLoading } from '../loading/reducer';
import { ActionType as ActionTypeError } from '../error/reducer';

export const getBoard =
  (boardId: number) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      const data: IBoardContent = await instance.get(`/board/${boardId}`);

      dispatch({ type: ActionType.UPDATE_BOARD, payload: data });
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log('Error update data: ', e);
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось обновить доску', e.message] });
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

export const renameTitleBoard =
  (boardId: number, title: string) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      const response = (await instance.put(`/board/${boardId}`, { title })) as { result: 'Updated' };
      return response.result === 'Updated';
    } catch (e: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось переименовать доску.', e.message] });
      return false;
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

/**
 * LIST
 */
export const addList =
  (boardId: number, title: string, position: number) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      const response = (await instance.post(`/board/${boardId}/list`, { title, position })) as { result: 'Updated' };
      return response.result === 'Updated';
    } catch (e: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось добавить список на доску.', e.message] });
      return false;
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

export const deleteList =
  (boardId: number, listId: number) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      await instance.delete(`/board/${boardId}/list/${listId}`);
    } catch (e: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось удалить список с доски.', e.message] });
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

export const renameTitleList =
  (boardId: number, listId: number, title: string) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      const response = (await instance.put(`/board/${boardId}/list/${listId}`, { title })) as { result: 'Updated' };
      return response.result === 'Updated';
    } catch (e: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось переименовать этот список.', e.message] });
      return !1;
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

export const movedLists =
  (boardId: number, data: { id: number; position: number }[]) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      await instance.put(`/board/${boardId}/list`, data);
    } catch (e: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось переместить списки.', e.message] });
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

/**
 * CARD
 */
export const addCard =
  (boardId: number, title: string, list_id: number, position: number) =>
  async (dispatch: Dispatch): Promise<number | undefined> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      const response = (await instance.post(`/board/${boardId}/card`, { title, list_id, position })) as {
        result: string;
        id: number;
      };
      return response.result === 'Created' ? response.id : undefined;
    } catch (e: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось создать новую карточку.', e.message] });
      return undefined;
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

const getNewCardPositionsForCreate = (list: IListContent, position: number): IValuesNewCardPositions[] =>
  Object.entries(list.cards)
    .sort(([, a], [, b]) => a.position - b.position)
    .filter(([, c]) => c.position >= position)
    .map(([, cd]) => ({ id: cd.id, position: cd.position + 1, list_id: list.id }));

// create a new card with the movement of the previous ones
export const createNewCardWithMovement =
  (boardId: number, listContent: IListContent, position: number, title: string) =>
  async (dispatch: Dispatch): Promise<number | undefined> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    const newCardPositions = getNewCardPositionsForCreate(listContent, position);
    try {
      await instance.put(`/board/${boardId}/card`, newCardPositions);
    } catch (e: any) {
      dispatch({
        type: ActionTypeError.ERROR,
        payload: ['При создании карточки не удалось переместить предыдущие карточки.', e.message],
      });
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }

    try {
      const response = (await instance.post(`/board/${boardId}/card`, {
        title,
        list_id: listContent.id,
        position,
      })) as { result: string; id: number };
      return response.result === 'Created' ? response.id : undefined;
    } catch (e: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось создать новую карточку.', e.message] });
      return undefined;
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

const getNewCardPositionsForDelete = (list: IListContent, cardId: number): IValuesNewCardPositions[] => {
  let position = -1;
  return Object.entries(list.cards)
    .sort(([, a], [, b]) => a.position - b.position)
    .filter(([, c]) => {
      if (c.id === +cardId) {
        position = c.position;
      }
      return c.id !== +cardId;
    })
    .filter(([, c]) => c.position >= position)
    .map(([, cd], i) => ({ id: cd.id, position: position + i, list_id: list.id }));
};

export const deleteCard =
  (boardId: number, cardId: number, listContent: IListContent | null = null) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    // get value new card positions
    const moveCardsList = listContent && getNewCardPositionsForDelete(listContent, cardId);

    // delete card & move cards
    try {
      if (moveCardsList) {
        const response = (await instance.delete(`/board/${boardId}/card/${cardId}`)) as { result: string };
        try {
          (await instance.put(`/board/${boardId}/card`, moveCardsList)) as { result: string };
        } catch (e: any) {
          dispatch({
            type: ActionTypeError.ERROR,
            payload: ['Не удалось удалить карточку. Сбой перемезщения карточек.', e.message],
          });
          return false;
        }
        return response.result === 'Deleted';
      }
      return !1;
    } catch (e: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось удалить карточку.', e.message] });
      return false;
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

export const movedCards =
  (boardId: number, data: { id: number; position: number; list_id: number }[]) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      const response = (await instance.put(`/board/${boardId}/card`, data)) as { result: string };
      return response.result === 'Updated';
    } catch (e: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось переместить карточки.', e.message] });
      return false;
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

// To move the card to the desired list, and/or rename the name or description
// You can only or rename the title or description.
export const editCard =
  (board_id: number, list_id: number, card_id: number, text: string, textType: 'title' | 'description') =>
  async (dispatch: Dispatch): Promise<boolean> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    const data = textType === 'title' ? { title: text, list_id } : { description: text, list_id };

    try {
      const response = (await instance.put(`/board/${board_id}/card/${card_id}`, data)) as { result: string };

      return response.result === 'Updated';
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log('edit card error: ', e);
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось изменить описание карточки.', e.message] });
      return false;
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };
