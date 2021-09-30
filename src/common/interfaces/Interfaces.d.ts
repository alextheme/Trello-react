/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IData {
  id: number;
  title: string;
}
export interface IUser {
  id: number;
  username: string;
}

export interface IList {
  id: number;
  title: string;
  cards: ICard[];
  position: number;
}

export interface ICard {
  id: number;
  title: string;
  description: string;
  position: number;
  users: number[];
}

// export interface IBoard {
//   board: {
//     lists: IList[];
//     title: string;
//     users: IUser[];
//   };
// }

export interface ActionType {
  type: string;
  payload?: any;
}

export interface IBoardActions {
  type: string;
  payLoad: string;
}

export interface IBoard {
  board: IBackendDataBoard;
}

/* Backend data interface */

/* Boards */
export interface IBackendBoard {
  id: number;
  title: string;
}

export interface IBackendDataBoards {
  boards: IBackendBoard[];
}

/* Board */
export interface IUserBackend {
  id: number;
  username: string;
}

export interface ICardBackend {
  created_at: number;
  description: string;
  id: number;
  position: number;
  title: string;
  users: IUserBackend[];
}

export interface IListBackend {
  cards: {
    [id: number]: ICardBackend;
  };
  id: number;
  position: number;
  title: string;
}

export interface IBackendDataBoard {
  lists: {
    [id: number]: IListBackend;
  };
  title: string;
  users: IUserBackend[];
}
