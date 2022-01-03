/* eslint-disable no-console */
import { Dispatch } from 'redux';
import instance from '../../../api/request';
import { ActionType } from './action-types';
import { ActionType as ActionTypeBoard } from '../board/action-types';
import { ActionType as ActionTypeBoards } from '../boards/action-types';
import { removeToken, setToken } from './session-storage-actions';
import { IFoundUsers } from '../../../common/interfaces/Interfaces';

export const authorization =
  (email: string, password: string) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      const resultAutorization = (await instance.post('/login', { email, password })) as {
        result: string;
        token: string;
      };

      if (resultAutorization && resultAutorization.result === 'Authorized') {
        setToken(resultAutorization.token);
        dispatch({ type: ActionType.AUTORIZATION });

        // get data authorized user
        const resultAuthorizedUser = (await instance.get(`/user?emailOrUsername=${email}`)) as IFoundUsers[];

        if (resultAuthorizedUser) {
          const { username, id } = resultAuthorizedUser[0];
          dispatch({ type: ActionType.AUTHORIZED_USER_FILL_THE_DATA, payload: { userName: username, userId: id } });
        }
      } else {
        console.log('Authorized false :(');
        removeToken();
        dispatch({ type: ActionType.LOGOUT });
      }
    } catch (err) {
      console.log('Error authorized: ', err);
    }
  };

export const logOut =
  () =>
  (dispatch: Dispatch): void => {
    removeToken();
    dispatch({ type: ActionType.LOGOUT });
    dispatch({ type: ActionTypeBoard.CLEAR_BOARD });
    dispatch({ type: ActionTypeBoards.CLEAR_BOARDS });
  };

// export const getUser = async (emailOrUsername: string): Promise<void> => {
//   const users = await instance.get('/user', {
//     params: {
//       emailOrUsername,
//     },
//   });
//   console.log('users.: ', users);
// };
