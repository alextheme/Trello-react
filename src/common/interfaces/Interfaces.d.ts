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
  lists: ILists;
  users: number[];
}

export interface ILists {
  [id: number]: IListContent;
}

export interface IListContent {
  id: number;
  position: number;
  title: string;
  cards: {
    [id: number]: ICardContent;
  };
}

export interface ICards {
  [id: number]: ICardContent;
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
  logging: boolean;
}

export interface IUserReducer {
  userIsLogged: boolean;
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

export interface IValuesNewCardPositions {
  id: number;
  position: number;
  list_id: number;
}

export interface IParamsForEditCardTitle {
  board_id: number;
  list_id: number;
  card_id: number;
  title?: string;
}

export interface IParamsForEditCardDescription {
  board_id: number;
  list_id: number;
  card_id: number;
  description?: string;
}
export interface IArgumentsForEditCard {
  board_id: number;
  list_id: number;
  card_id: number;
  text: string;
  textType: 'title' | 'description';
}

export type IParamsForEditCard = IParamsForEditCardTitle | IParamsForEditCardDescription;
