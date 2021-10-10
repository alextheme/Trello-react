/* eslint-disable no-console */
import { AxiosResponse } from 'axios';
import { Dispatch } from 'redux';
import instance from '../../../api/request';
import { IBoardTlt } from '../../../common/interfaces/Interfaces';

export const getBoard =
  (boardId: number) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      const data: IBoardTlt = await instance.get(`/board/${boardId}`);
      dispatch({ type: 'UPDATE_BOARD', payload: data });
    } catch (e) {
      console.log('Error update data: ', e);
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  };

// instance.interceptors.request.use((config) => {
//   console.log('before request (4.1)', config);
//   return config;
// });

instance.interceptors.response.use(
  (res: AxiosResponse) => {
    console.log('before response (5.1)', res);
    return res.data;
  },
  (error) => Promise.reject(error)
);

export const deleteBoard = async (boardId: number): Promise<void> => {
  try {
    await instance.delete(`/board/${boardId}`);
  } catch (e) {
    console.log(e);
  }
};

export const renameTitleBoard = async (boardId: number, title: string): Promise<void> => {
  try {
    await instance.put(`/board/${boardId}`, { title });
    getBoard(boardId);
  } catch (e) {
    console.log(e);
  }
};

export const addList = (boardId: number | string, title: string, position: number): void => {
  try {
    instance.post(`/board/${boardId}/list`, { title, position });
  } catch (e) {
    console.log(e);
  }
};

export const deleteList = async (boardId: number, listId: number): Promise<void> => {
  try {
    await instance.delete(`/board/${boardId}/list/${listId}`);
  } catch (e) {
    console.log(e);
  }
};

export const renameTitleList = async (boardId: number, listId: number, title: string): Promise<void> => {
  try {
    await instance.put(`/board/${boardId}/list/${listId}`, { title });
    // getBoard(boardId);
  } catch (e) {
    console.log(e);
  }
};

export const movedLists = async (boardId: number, data: { id: number; position: number }[]): Promise<void> => {
  try {
    await instance.put(`/board/${boardId}/list`, data);
  } catch (e) {
    console.log(e);
  }
};

export const addCard = async (boardId: number, title: string, list_id: number, position: number): Promise<void> => {
  try {
    await instance.post(`/board/${boardId}/card`, { title, list_id, position });
  } catch (e) {
    console.log(e);
  }
};

export const deleteCard = async (board_id: number, card_id: string): Promise<void> => {
  try {
    await instance.delete(`/board/${board_id}/card/${card_id}`);
  } catch (e) {
    console.log(e);
  }
};

export const renameTitleCard = async (
  board_id: number,
  card_id: string,
  data: { title: string; list_id: number }
): Promise<void> => {
  try {
    await instance.put(`/board/${board_id}/card/${card_id}`, data);
  } catch (e) {
    console.log(e);
  }
};

export const movedCards = async (
  boardId: number,
  data: { id: number; position: number; list_id: number }[]
): Promise<void> => {
  try {
    await instance.put(`/board/${boardId}/card`, data);
  } catch (e) {
    console.log(e);
  }
};
