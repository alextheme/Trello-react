export interface IBoards {
  boards: IBoardTlt[];
}

export interface IBoardTlt {
  id: number;
  title: string;
}

export interface IData {
  board: { board: IBoard };
}

export interface IBoard {
  title: string;
  lists: {
    [id: number]: IList;
  };
  users: User[];
}

export interface IList {
  id: number;
  position: number;
  title: string;
  cards: {
    [id: number]: ICard;
  };
}

export interface ICard {
  id: number;
  position: number;
  title: string;
  created_at: number;
  description: string;
  users: User[];
}

export interface IUser {
  id: number;
  username: string;
}

export interface IData1 {
  board: {
    title: string;
    lists: {
      [id: number]: {
        id: number;
        title: string;
        position: number;
        cards: {
          [id: number]: {
            id: number;
            title: string;
            description: string;
            created_at: number;
            position: number;
            users: { id: number; username: string }[];
          };
        };
      };
    };
    users: { id: number; username: string }[];
  };
}
