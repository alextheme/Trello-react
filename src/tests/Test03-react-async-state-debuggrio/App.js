import React, { useState } from 'react';
// import { PetsHooks as Pets } from './Pets';
import { PetsClass as Pets } from './Pets';
import './styles.css';

function App() {
  const [showPets, setShowPets] = useState(true);

  const toggle = () => {
    setShowPets((state) => !state);
  };

  return (
    <div className="App">
      <button onClick={toggle}>{showPets ? 'hide' : 'show'}</button>
      {showPets && <Pets />}
    </div>
  );
}

export default App;
