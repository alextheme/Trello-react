import React from 'react';
import './Rainbow.scss';

export const Rainbow: React.FC = (): JSX.Element => {
  return (
    <div className="Rainbow-loader">
      <div className="loader-inner">
        <div className="loader-line-wrap">
          <div className="loader-line" />
        </div>
        <div className="loader-line-wrap">
          <div className="loader-line" />
        </div>
        <div className="loader-line-wrap">
          <div className="loader-line" />
        </div>
        <div className="loader-line-wrap">
          <div className="loader-line" />
        </div>
        <div className="loader-line-wrap">
          <div className="loader-line" />
        </div>
      </div>
    </div>
  );
};
