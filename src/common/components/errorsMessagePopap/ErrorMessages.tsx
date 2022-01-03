/* eslint-disable react/no-unused-state */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable no-console */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { errorClear } from '../../../store/modules/error/reducer';
import { IErrorReducer } from '../../interfaces/Interfaces';
import './errorMessage.scss';

interface PropsType {
  clearErrorMessages?: () => {};
  error?: IErrorReducer;
}

interface StateProps {
  marginLeft: number;
}

class ErrorMessage extends React.Component<PropsType, StateProps> {
  handleClosedErrorMessage = (): void => {
    const { clearErrorMessages } = this.props as PropsType;
    if (clearErrorMessages) {
      clearErrorMessages();
    }
  };

  render(): JSX.Element {
    const { error } = this.props as PropsType;
    const errorMessages = error ? error.errorMessages : [];

    return (
      <div className="error-box" style={{ marginLeft: errorMessages.length ? 0 : -300 }}>
        <div className="error-container">
          <div className="message">
            {errorMessages.map((m) => (
              <p className="error-description" key={m}>
                {m}
              </p>
            ))}
          </div>
        </div>

        <div className="error__delete_btn" onClick={this.handleClosedErrorMessage} />
      </div>
    );
  }
}

const mapStateToProps = (state: any): any => ({ ...state });

const mapDispatchToProps = (dispatch: Dispatch): { clearErrorMessages: () => void } => ({
  clearErrorMessages: (): void => {
    dispatch(errorClear());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorMessage);
