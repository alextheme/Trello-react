/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-empty-interface */
import React from 'react';
import { IData } from '../../common/interfaces/interfacesDnD';

interface TypeProps extends IData {}

interface TypeState {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars

class BoardDnD extends React.Component<TypeProps, TypeState> {
  constructor(props: TypeProps) {
    super(props);
    this.state = {};
  }

  componentDidMount(): void {
    console.log('did mount');
  }

  componentWillUnmount(): void {
    console.log('will unmount');
  }

  render(): JSX.Element | null {
    return (
      // comment
      <div>This Div</div>
    );
  }
}

export default BoardDnD;
