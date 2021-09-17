import { Dispatch } from 'redux';
import instance from '../../../api/request';

export const getBoard =
  (boardId: string) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      const data = await instance.get(`/board/${boardId}`);
      console.log('axios: ', data);
      await dispatch({ type: 'UPDATE_BOARD', payload: data });
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  };

export const deleteBoard = async (boardId: string): Promise<void> => {
  try {
    await instance.delete(`/board/${boardId}`);
  } catch (e) {
    console.log(e);
  }
};

export const renameTitleBoard = (boardId: string, title: string): void => {
  try {
    instance.put(`/board/${boardId}`, { title });
  } catch (e) {
    console.log(e);
  }
};

export const addList = (boardId: number, title: string, position: number): void => {
  try {
    instance.post(`/board/${boardId}/list`, { title, position });
  } catch (e) {
    console.log(e);
  }
};

export const deleteList = async (boardId: string, listId: number): Promise<void> => {
  try {
    await instance.delete(`/board/${boardId}/list/${listId}`);
  } catch (e) {
    console.log(e);
  }
};

export const renameTitleList = (boardId: string, listId: string, title: string, position: number): void => {
  try {
    instance.put(`/board/${boardId}/list/${listId}`, { title, position });
  } catch (e) {
    console.log(e);
  }
};

export const addCard = async (boardId: string, title: string, list_id: number, position: number): Promise<void> => {
  try {
    await instance.post(`/board/${boardId}/card`, { title, list_id, position });
  } catch (e) {
    console.log(e);
  }
};

export const deleteCard = async (board_id: string, card_id: string): Promise<void> => {
  try {
    await instance.delete(`/board/${board_id}/card/${card_id}`);
  } catch (e) {
    console.log(e);
  }
};
