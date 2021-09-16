import { useState, useEffect } from 'react';
// The router lib is a detail; just to simulate navigating away.
import { Link, Route, BrowserRouter } from 'react-router-dom';

function makeCancelable(promise: Promise<unknown>) {
  return {
    promise,
    cancel: () => {
      promise.then((r) => {
        console.log(r);
      });
    },
  };
}

function ExampleButton() {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (submitting) {
      // using an ad hoc cancelable promise, since ECMAScript still has no native way to cancel promises
      // see example makeCancelable() definition on https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
      const cancelablePromise = makeCancelable(doStuff());
      // using then since to use await you either have to create an inline function or use an async iife
      cancelablePromise.promise.then(() => setSubmitting(false));
      return () => cancelablePromise.cancel(); // we return the cleanup function
    }
  }, [submitting]);

  const handleClick = () => {
    setSubmitting(true);
  };

  return (
    <button onClick={handleClick} disabled={submitting}>
      {submitting ? 'Submitting' : 'Submit'}
    </button>
  );
}

function doStuff() {
  // Suppose this is a network request or some other async operation.
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

const TestApp = () => {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/other">Other</Link>
      </nav>
      <Route path="/" exact>
        Click the button and go to "Other" page (02)
        <br />
        <ExampleButton />
      </Route>
      <Route path="/other">Nothing interesting here</Route>
    </BrowserRouter>
  );
};

export default TestApp;
