import { Dispatch } from 'redux';
import instance from '../../../api/request';

export const getBoards =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      const data = await instance.get('/board');
      await dispatch({ type: 'UPDATE_BOARDS', payload: data });
      await dispatch({ type: 'UPDATE_BOARDS_LOCAL' });
    } catch (e) {
      console.log(e);
      dispatch({ type: 'ERROR_ACTION_TYPE' });
    }
  };

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const addBoard = async (newTitleBoard: string): Promise<any> =>
  instance.post('/board', { title: newTitleBoard });

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deleteBoard = async (idBoard: number): Promise<any> => instance.delete(`/board/${idBoard}`);
