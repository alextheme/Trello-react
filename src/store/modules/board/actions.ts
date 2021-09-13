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

export const addList = async (boardId: string, title: string, position: number): Promise<void> => {
  try {
    await instance.post(`/board/${boardId}/list`, { title, position });
  } catch (e) {
    console.log(e);
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
export const deleteList = (boardId: string, listId: string) => {
  try {
    instance.delete(`/board/${boardId}/list/${listId}`);
  } catch (e) {
    console.log(e);
  }
};
