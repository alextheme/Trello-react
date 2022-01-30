/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from 'react';

class ErrorBoundares extends Component {
  constructor(props: any) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: any): any {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: any, info: any): void {
    console.log(error);
    console.log(info);
  }

  render(): React.ReactNode {
    const { hasError } = this.state as { hasError: boolean };
    const { children } = this.props;
    if (hasError) {
      return <h1 style={{ color: 'red' }}>Something went wrong</h1>;
    }
    return children as React.ReactNode;
  }
}

export default ErrorBoundares;
