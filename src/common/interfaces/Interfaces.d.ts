/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export interface IData {
  id: number;
  title: string;
}

export interface IList extends IData {
  cards: IData[];
}

export interface IState {
  boards: IData[];
  path: '';
}

export interface IProps {
  [component: string]:
    | React.ComponentType<any>
    | React.ComponentType<RouteComponentProps<any, StaticContext, unknown>>
    | undefined;
}

export interface IBoardActions {
  type: string;
  payLoad: string;
}
