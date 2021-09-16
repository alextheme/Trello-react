import React, { useEffect, useReducer } from 'react';
import { getPet } from './api';
import initialState from './initialState';
import Pet from './Pet';

function petsReducer(state, action) {
  switch (action.type) {
    case 'PET_SELECTED': {
      return {
        ...state,
        selectedPet: action.payload, // string
      };
    }
    case 'FETCH_PET': {
      return {
        ...state,
        loading: true,
        petData: null,
      };
    }
    case 'FETCH_PET_SUCCESS': {
      return {
        ...state,
        loading: false,
        petData: action.payload, // { name: "Cats", voice: "Miauuu", avatar: "🐱" }
      };
    }

    case 'RESET': {
      return initialState;
    }

    default:
      throw new Error(`Not supported action ${action.type}`);
  }
}

/**
 * Бонусный совет
 * Мы устанавливаем локальную переменную "mounted" внутри области видимости useEffect.
 * Если мы хотим повторно использовать эту переменную внутри другого useEffect,
 * мы можем использовать useRef, который является своего рода состоянием отрисовки
 * компонентов без отрисовки.
 */
function Pets() {
  const [pets, dispatch] = useReducer(petsReducer, initialState);
  // b1
  const isMountedRef = useRef(null);

  const onChange = ({ target }) => {
    dispatch({ type: 'PET_SELECTED', payload: target.value });
  };

  useEffect(() => {
    /* Нам просто НЕ нужно обновлять состояние в обратном вызове,
    если компонент еще не смонтирован. */
    // a1
    // let mounted = true;
    // b2
    isMountedRef.current = true;

    if (pets.selectedPet) {
      dispatch({ type: 'FETCH_PET' });
      getPet(pets.selectedPet).then((data) => {
        // if (mounted) { // a2
        if (isMountedRef.current) {
          // b3
          dispatch({ type: 'FETCH_PET_SUCCESS', payload: data });
        }
      });
    } else {
      dispatch({ type: 'RESET' });
    }

    // a3
    // return () => (mounted = false);
    // b4
    return () => (isMountedRef.current = false);
  }, [pets.selectedPet]);

  // b5
  useEffect(() => {
    // we can access isMountedRef.current here as well
  });

  return (
    <div>
      <span>Pets Hooks</span>
      <br />
      <select value={pets.selectedPet} onChange={onChange}>
        <option value="">Select a pet</option>
        <option value="cats">Cats</option>
        <option value="dogs">Dogs</option>
      </select>
      {pets.loading && <div>Loading...</div>}
      {pets.petData && <Pet {...pets.petData} />}
    </div>
  );
}

export default Pets;
