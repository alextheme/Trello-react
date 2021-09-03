import React from 'react';

export interface IData {
  id: number;
  title: string;
}

export interface IList extends IData {
  cards: IData[];
}

export interface IBoard {
  board: {
    id: number;
    title: string;
    lists: IList[];
  };
}

export interface IProps {
  [component: string]: /* eslint-disable @typescript-eslint/no-explicit-any */
  React.ComponentType<any> | React.ComponentType<RouteComponentProps<any, StaticContext, unknown>> | undefined;
}

export interface IBoardActions {
  type: string;
  payLoad: string;
}
