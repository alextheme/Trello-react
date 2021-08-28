/* eslint-disable no-console */
import React from 'react';

// eslint-disable-next-line react/prefer-stateless-function
class ButtonCreateNewBoard extends React.Component<{ text: string }> {
  render(): JSX.Element {
    const { text } = this.props;
    return <button>{text}</button>;
  }
}

export default ButtonCreateNewBoard;
