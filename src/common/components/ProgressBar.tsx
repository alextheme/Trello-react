/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import './progressBar.scss';

class ProgressBar extends React.Component {
  render(): JSX.Element {
    return (
      <div id="nprogress">
        <div className="bar" />
        <div className="spinner-icon" />
      </div>
    );
  }
}

export default ProgressBar;
