/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IBoards {
  boards: IBoardCover[];
}

export interface IBoardCover {
  id: number;
  title: string;
}

export interface IBoardReducer {
  boardContent: IBoardContent | null;
}

export interface IBoardContent {
  title: string;
  lists: {
    [id: number]: IListContent;
  };
  users: number[];
}

export interface IListContent {
  id: number;
  position: number;
  title: string;
  cards: {
    [id: number]: ICardContent;
  };
}

export interface ICardContent {
  id: number;
  position: number;
  title: string;
  created_at: number;
  description: string;
  users: number[];
}

export interface IBoardsListReducer {
  boardsList: IBoardCover[] | null;
}

export interface IErrorReducer {
  errorMessages: string[];
}

export interface ILoadingReducer {
  loading: boolean;
}

export interface IUserReducer {
  userIsLogged: boolean;
  userName: string;
  userId: number;
  userEmail: string;
}

export interface IFoundUsers {
  id: number;
  username: string;
}

export interface IEditableCardProps {
  closeBGEditor: (event: any) => void;
  closeEditor: () => void;
  deleteCard: (event: any) => Promise<void>;
  openEditCard: boolean;
  saveTitle: (title: string, idCard: number) => Promise<void>;
  width: number;
  x: number;
  y: number;
  card: ICardContent;
}

export interface IButtonLinkForEditableCard {
  titleBtn: string;
  awesomeIcon: IconProp;
  cardId: number;
  handlerOnClick: (event: any) => Promise<void>;
}

export interface IMatch {
  isExact: boolean;
  params: { boardId: string; cardId: string };
  path: string;
  url: string;
}
