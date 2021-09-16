import { useState } from 'react';
// The router lib is a detail; just to simulate navigating away.
import { Link, Route, BrowserRouter } from 'react-router-dom';

function ExampleButton() {
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async () => {
    setSubmitting(true);
    await doStuff();
    setSubmitting(false);
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

function TestApp() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/other">Other</Link>
      </nav>
      <Route path="/" exact>
        Click the button and go to "Other" page (01 Warning!)
        <br />
        <ExampleButton />
      </Route>
      <Route path="/other">Nothing interesting here</Route>
    </BrowserRouter>
  );
}

export default TestApp;
