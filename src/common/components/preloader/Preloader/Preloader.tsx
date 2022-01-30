import React from 'react';
import { connect } from 'react-redux';
import { loadProgressBar } from 'x-axios-progress-bar';
import PreloaderIcon from './PreloaderIcon';
import instance from '../../../../api/request';
import './preloader.scss';
import 'x-axios-progress-bar/dist/nprogress.css';

class PreloaderComponent extends React.Component {
  componentDidMount(): void {
    loadProgressBar({}, instance);
  }

  render(): JSX.Element {
    const { loading } = this.props as { loading: boolean };

    if (loading) {
      return (
        <div className="loading-box">
          <span className="loading-line" />
          <PreloaderIcon />
        </div>
      );
    }

    return <div />;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapStateToProps = (state: any): any => ({ ...state.loading });

export default connect(mapStateToProps, null)(PreloaderComponent);
