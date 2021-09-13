export interface IData {
  id: number;
  title: string;
}
export interface IUser {
  id: number;
  username: string;
}

export interface IList extends IData {
  cards: IData[];
}

export interface IBoard {
  board: {
    title: string;
    users: { id: number; username: string }[];
    lists: {
      id: number;
      title: string;
      cards: { id: number; title: string; description: string; users: number[] }[];
    }[];
    position: number;
  };
}

export interface ActionType {
  type: string;
  payload?: any;
}

export interface StoreStateType {
  boards: IData[];
}

export interface IBoardActions {
  type: string;
  payLoad: string;
}
