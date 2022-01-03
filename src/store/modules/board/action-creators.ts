/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Dispatch } from 'redux';
import instance from '../../../api/request';
import { IBoardContent } from '../../../common/interfaces/Interfaces';
import { ActionType } from './action-types';
import { ActionType as ActionTypeLoading } from '../loading/reducer';
import { ActionType as ActionTypeError } from '../error/reducer';

export const getBoard =
  (boardId: number) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      const data: IBoardContent = await instance.get(`/board/${boardId}`);
      // console.log('data one board: ', data);
      dispatch({ type: ActionType.UPDATE_BOARD, payload: data });
    } catch (e: any) {
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
      const response = await instance.put(`/board/${boardId}`, { title }) as { result: 'Updated' };
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
      const response = await instance.post(`/board/${boardId}/list`, { title, position }) as { result: 'Updated' };
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
      const response = await instance.put(`/board/${boardId}/list/${listId}`, { title }) as { result: 'Updated' };
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
  async (dispatch: Dispatch): Promise<void> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      await instance.post(`/board/${boardId}/card`, { title, list_id, position });
    } catch (e: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось создать новую карточку.', e.message] });
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

export const deleteCard =
  (boardId: number, cardId: number) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      await instance.delete(`/board/${boardId}/card/${cardId}`);
    } catch (e: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось удалить карточку.', e.message] });
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

export const renameTitleCard =
  (boardId: number, cardId: number, data: { title: string; list_id: number }) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      const response = await instance.put(`/board/${boardId}/card/${cardId}`, data) as { result: string };
      return response.result === 'Updated';
    } catch (e: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось переименовать карточку.', e.message] });
      return false;
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

export const editDescriptionCard =
  (board_id: number, list_id: number, card_id: number, description: string) =>
  async (dispatch: Dispatch): Promise<boolean> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      const response = await instance.put(`/board/${board_id}/card/${card_id}`, { description, list_id }) as { result: string };
      return response.result === 'Updated';
    } catch (e: any) {
      // console.log({ ...e });
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось изменить описание карточки.', e.message] });
      return false;
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };

export const movedCards =
  (boardId: number, data: { id: number; position: number; list_id: number }[]) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch({ type: ActionTypeLoading.LOADING });
    dispatch({ type: ActionTypeError.ERROR_CLEAR });

    try {
      await instance.put(`/board/${boardId}/card`, data);
    } catch (e: any) {
      dispatch({ type: ActionTypeError.ERROR, payload: ['Не удалось переместить карточки.', e.message] });
    } finally {
      dispatch({ type: ActionTypeLoading.LOADING_END });
    }
  };
